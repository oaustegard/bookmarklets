javascript:
/* @title: Claude Hooks */
/* @description: Connects to the events in the Claude.ai UX emitting them as events that can be tapped into -- to be part of a future extension...  see https://muninn.austegard.com/blog/the-wrong-side-of-the-websocket.html */
/* @domains: claude.ai */
(function() {
  if (window.__claudeHooks) {
    console.log('[claude-hooks] already active');
    return;
  }

  /* ── CONFIGURATION ──────────────────────────────────────────────────────
     PATH_PATTERNS: best-guess until mapper confirms real endpoint path.
     Typically: /api/organizations/<uuid>/chat_conversations/<uuid>/completion
     Update the first pattern once confirmed; remove the loose fallback.     */
  var PATH_PATTERNS = [
    /\/api\/organizations\/[^/]+\/chat_conversations\/[^/]+\/completion/,
    /\/completion$/
  ];

  /* ── HELPERS ─────────────────────────────────────────────────────────── */
  function getConvId() {
    return (location.pathname.match(/\/chat\/([^/]+)/) || [])[1] || null;
  }

  function matchesAllowlist(url) {
    var path = '';
    try { path = new URL(String(url instanceof Request ? url.url : url), location.origin).pathname; } catch(e) {}
    return PATH_PATTERNS.some(function(p) { return p.test(path); });
  }

  /* ── LAYER A: RAW TAP ───────────────────────────────────────────────────
     window.__claudeTap.on(fn)  — subscribe to all raw events
     Emits { source: 'sse'|'mo'|'ws'|'es', raw, ts }                       */
  var tapListeners = [];
  window.__claudeTap = {
    on: function(fn) { tapListeners.push(fn); },
    off: function(fn) { var i = tapListeners.indexOf(fn); if (i > -1) tapListeners.splice(i, 1); },
    _emit: function(source, raw) {
      var ev = { source: source, raw: raw, ts: Date.now() };
      tapListeners.forEach(function(fn) { try { fn(ev); } catch(e) {} });
    }
  };
  var tap = window.__claudeTap._emit.bind(window.__claudeTap);

  /* ── LAYER B: SEMANTIC HOOKS ────────────────────────────────────────────
     window.__claudeHooks.on('MessageEnd', fn)
     window.__claudeHooks.off('MessageEnd', fn)
     Payload: { ts, conversationId, type, ...eventData }

     NOTE on ToolUseStart / PreToolUse:
       By the time content_block_start{type:"tool_use"} arrives on the wire,
       the server has already decided to call the tool. Client-side "PreToolUse"
       is post-decision, pre-render. Useful for logging and annotation;
       cannot block execution.                                               */
  var hookListeners = {};
  window.__claudeHooks = {
    on: function(event, fn) {
      if (!hookListeners[event]) hookListeners[event] = [];
      hookListeners[event].push(fn);
    },
    off: function(event, fn) {
      if (!hookListeners[event]) return;
      var i = hookListeners[event].indexOf(fn);
      if (i > -1) hookListeners[event].splice(i, 1);
    },
    _emit: function(event, payload) {
      var p = Object.assign({ ts: Date.now(), conversationId: getConvId(), type: event }, payload);
      (hookListeners[event] || []).forEach(function(fn) { try { fn(p); } catch(e) {} });
    }
  };
  var emit = window.__claudeHooks._emit.bind(window.__claudeHooks);

  /* ── SSE → SEMANTIC TRANSLATION TABLE ──────────────────────────────────
     Keys are SSE event type strings (public API names — verify against ground truth).
     Breakage from Anthropic renaming SSE types is contained here;
     Layer A tap continues to work regardless.                              */
  var _stopReason = null;
  var _pendingToolBlocks = [];

  var SSE_HANDLERS = {
    'message_start': function(raw) {
      emit('MessageStart', {
        messageId: raw.message && raw.message.id,
        model: raw.message && raw.message.model
      });
    },
    'content_block_start': function(raw) {
      var block = raw.content_block || {};
      if (block.type === 'tool_use') {
        _pendingToolBlocks.push({ toolId: block.id, toolName: block.name, blockIndex: raw.index });
        emit('ToolUseStart', {
          toolId: block.id,
          toolName: block.name,
          blockIndex: raw.index
        });
      } else if (block.type === 'thinking') {
        emit('ThinkingStart', { blockIndex: raw.index });
      }
    },
    'content_block_delta': function(raw) {
      var delta = raw.delta || {};
      if (delta.type === 'text_delta') {
        emit('MessageDelta', { text: delta.text, blockIndex: raw.index });
      } else if (delta.type === 'input_json_delta') {
        emit('ToolInputDelta', { partial: delta.partial_json, blockIndex: raw.index });
      } else if (delta.type === 'thinking_delta') {
        emit('ThinkingDelta', { text: delta.thinking, blockIndex: raw.index });
      }
    },
    'content_block_stop': function(raw) {
      var pending = _pendingToolBlocks.filter(function(t) { return t.blockIndex === raw.index; });
      if (pending.length) {
        _pendingToolBlocks = _pendingToolBlocks.filter(function(t) { return t.blockIndex !== raw.index; });
        emit('ToolUseEnd', pending[0]);
      }
    },
    'message_delta': function(raw) {
      if (raw.delta) _stopReason = raw.delta.stop_reason || _stopReason;
    },
    'message_stop': function() {
      emit('MessageEnd', { stopReason: _stopReason, source: 'sse' });
      _stopReason = null;
    }
  };

  window.__claudeTap.on(function(ev) {
    if (ev.source !== 'sse' && ev.source !== 'es') return;
    var handler = ev.raw && SSE_HANDLERS[ev.raw.type];
    if (handler) handler(ev.raw);
  });

  /* ── STREAM READER ───────────────────────────────────────────────────── */
  function detectFraming(chunk) {
    var line = chunk.split('\n').filter(function(l) { return l.trim(); })[0] || '';
    if (line.startsWith('event:') || line.startsWith('data:')) return 'sse';
    if (line.startsWith('{')) return 'ndjson';
    return 'sse'; /* default — treat unknown as SSE */
  }

  function dispatchParsed(raw) {
    try { tap('sse', typeof raw === 'string' ? JSON.parse(raw) : raw); } catch(e) {}
  }

  function readStream(stream, _url) {
    var reader = stream.getReader();
    var decoder = new TextDecoder();
    var buffer = '';
    var framing = null;
    var eventType = '';

    function pump() {
      reader.read().then(function(result) {
        if (result.done) return;
        buffer += decoder.decode(result.value, { stream: true });
        var lines = buffer.split('\n');
        buffer = lines.pop() || '';
        if (!framing && lines.some(function(l) { return l.trim(); })) {
          framing = detectFraming(lines.join('\n'));
        }
        lines.forEach(function(line) {
          if (framing === 'ndjson') {
            if (line.trim()) dispatchParsed(line.trim());
          } else {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              var data = line.slice(5).trim();
              if (data !== '[DONE]') dispatchParsed(data);
              eventType = '';
            } else if (line.trim().startsWith('{')) {
              dispatchParsed(line.trim());
            }
          }
        });
        pump();
      }).catch(function() {});
    }
    pump();
  }

  /* ── FETCH PATCH ─────────────────────────────────────────────────────── */
  var _fetch = window.fetch.bind(window);
  window.fetch = function claudeHooksFetch() {
    var args = Array.from(arguments);
    if (!matchesAllowlist(args[0])) return _fetch.apply(null, args);
    return _fetch.apply(null, args).then(function(resp) {
      if (!resp.body) return resp;
      var streams = resp.body.tee();
      readStream(streams[0], String(args[0]));
      return new Response(streams[1], { status: resp.status, statusText: resp.statusText, headers: resp.headers });
    });
  };

  /* ── WEBSOCKET + EVENTSOURCE PROBES ─────────────────────────────────── */
  var _WS = window.WebSocket;
  window.WebSocket = function(url) {
    var ws = new (Function.prototype.bind.apply(_WS, [null].concat(Array.from(arguments))))();
    ws.addEventListener('message', function(e) { tap('ws', { url: url, data: String(e.data).substring(0, 200) }); });
    return ws;
  };
  window.WebSocket.prototype = _WS.prototype;

  var _ES = window.EventSource;
  window.EventSource = function(url) {
    var es = new _ES(url);
    es.addEventListener('message', function(e) {
      try { tap('es', JSON.parse(e.data)); } catch(err) { tap('es', { raw: e.data }); }
    });
    return es;
  };
  window.EventSource.prototype = _ES.prototype;

  /* ── MUTATION OBSERVER ───────────────────────────────────────────────── */
  var mo = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        var testid = (node.dataset && node.dataset.testid) ||
          (node.querySelector && node.querySelector('[data-testid]') && node.querySelector('[data-testid]').dataset.testid);
        if (testid) tap('mo', { action: 'add', testid: testid, messageId: node.dataset && node.dataset.messageId });
      });
    });
  });
  mo.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });

  /* ── STOP → SEND BUTTON: structural MessageEnd signal ───────────────── */
  var _wasStreaming = false;
  var _btnInterval = setInterval(function() {
    var btn = document.querySelector('[data-testid="send-button"],[data-testid="stop-button"],button[aria-label*="Send"],button[aria-label*="Stop"]');
    if (!btn) return;
    var isStreaming = /stop/i.test(btn.ariaLabel || btn.dataset.testid || '');
    if (_wasStreaming && !isStreaming) emit('MessageEnd', { source: 'button-transition' });
    _wasStreaming = isStreaming;
  }, 200);

  /* ── HISTORY: conversation switch ───────────────────────────────────── */
  var _push = history.pushState.bind(history);
  history.pushState = function() {
    _push.apply(history, arguments);
    tap('mo', { action: 'navigate', conversationId: getConvId() });
  };

  /* ── DOM MAP HELPER ─────────────────────────────────────────────────── */
  window.mapClaudeDOM = function() {
    console.group('[claude-hooks] DOM map');
    var nodes = Array.from(document.querySelectorAll('[data-testid]'))
      .filter(function(el) { return /message|turn|human|assistant|tool|artifact|think|send|stop/i.test(el.dataset.testid); });
    console.table(nodes.map(function(el) {
      return { testid: el.dataset.testid, tag: el.tagName, messageId: el.dataset.messageId || '' };
    }));
    console.groupEnd();
  };

  /* ── CLEANUP ─────────────────────────────────────────────────────────── */
  window.__claudeHooksDestroy = function() {
    window.fetch = _fetch;
    window.WebSocket = _WS;
    window.EventSource = _ES;
    history.pushState = _push;
    mo.disconnect();
    clearInterval(_btnInterval);
    delete window.__claudeHooks;
    delete window.__claudeTap;
    delete window.__claudeHooksDestroy;
    delete window.mapClaudeDOM;
    console.log('[claude-hooks] removed');
  };

  console.log('%c[claude-hooks] active%c  __claudeTap  __claudeHooks  mapClaudeDOM()  __claudeHooksDestroy()', 'color:#7c9ef5;font-weight:bold', 'color:#888');
})();
