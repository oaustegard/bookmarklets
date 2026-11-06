javascript:(function(){
/* @title: Export Claude Transcript */
/* @description: Download a claude.ai chat, shared chat, or Claude Code / Cowork session as pruned JSON, with full, compact, or outline detail for sessions */
/* @domains: claude.ai */

  const LOG = 'Chat Export:';

  const API_HEADERS = {
    accept: '*/*',
    'content-type': 'application/json',
    'anthropic-client-platform': 'web_claude_ai',
    'anthropic-version': '2023-06-01'
  };

  /* ---------- Generic helpers ---------- */

  /* Delete every key in dropKeys, and every key in dropIfEmptyKeys whose
     value is "", false, null, or an empty array. Mutates obj. */
  function pruneFields(obj, dropKeys, dropIfEmptyKeys) {
    dropKeys.forEach(function (key) { delete obj[key]; });
    dropIfEmptyKeys.forEach(function (key) {
      if (!(key in obj)) return;
      const value = obj[key];
      if (value === '' || value === false || value === null ||
          (Array.isArray(value) && value.length === 0)) {
        delete obj[key];
      }
    });
  }

  /* A content array made only of text blocks collapses to one string;
     anything else is returned unchanged. */
  function flattenText(content) {
    if (typeof content === 'string') return content;
    if (Array.isArray(content) && content.every(function (b) { return b && b.type === 'text'; })) {
      return content.map(function (b) { return b.text; }).join('\n');
    }
    return content;
  }

  function truncate(value, max) {
    const str = String(value == null ? '' : value);
    return str.length > max
      ? str.slice(0, max) + '…[+' + (str.length - max) + ' chars]'
      : str;
  }

  function collapseWhitespace(value) {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: API_HEADERS, credentials: 'include' });
    console.log(LOG, res.status, url);
    if (!res.ok) {
      const body = await res.text().catch(function () { return ''; });
      console.error(LOG, 'HTTP', res.status, body.slice(0, 500));
      return null;
    }
    return res.json();
  }

  function downloadJson(data, title, id) {
    const json = JSON.stringify(data, null, 2);
    const slug = (title || 'claude-chat')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'claude-chat';
    const filename = slug + '-' + id.slice(0, 12) + '.json';

    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 5000);

    console.log(LOG, 'Downloaded', filename, Math.round(json.length / 1024) + ' KB');
  }

  /* ---------- Claude Code / Cowork sessions ---------- */

  /* One-line summary of a tool call. limits.inp caps inputs, limits.typ caps
     typed text and messages. */
  function summarizeToolCall(name, input, limits) {
    input = input || {};
    const tool = String(name).replace(/^mcp__.+?__/, '');

    switch (tool) {
      case 'computer':
        return input.action === 'type'
          ? 'type ' + JSON.stringify(truncate(input.text, limits.typ))
          : input.action_summary || input.action || 'computer';
      case 'navigate':
        return 'navigate ' + input.url;
      case 'javascript_tool':
        return 'js ' + truncate(collapseWhitespace(input.text), limits.inp);
      case 'Bash':
        return 'Bash ' + truncate(collapseWhitespace(input.command), limits.inp);
      case 'Skill':
        return 'Skill ' + input.skill;
      case 'SendUserMessage':
        return 'SendUserMessage ' + JSON.stringify(truncate(input.message, limits.typ));
      case 'browser_batch':
        return 'batch[' + (input.actions || []).map(function (action) {
          return summarizeToolCall(action.name, action.input, limits);
        }).join(' ; ') + ']';
      default: {
        const rest = {};
        Object.keys(input || {}).forEach(function (key) {
          if (key !== 'tabId' && key !== 'description') rest[key] = input[key];
        });
        return tool + ' ' + truncate(JSON.stringify(rest), limits.inp);
      }
    }
  }

  /* One-line summary of a tool result. Acknowledgement-only results
     ("Clicked at …", "Navigated to …") summarize to "". */
  function summarizeToolResult(content, max) {
    let text;
    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = content.map(function (block) {
        if (typeof block === 'string') return block;
        if (block && block.type === 'text') return block.text;
        if (block && block.type === 'image') return '[image]';
        return truncate(JSON.stringify(block), 80);
      }).join(' ');
    } else {
      text = JSON.stringify(content);
    }
    text = collapseWhitespace(text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ''));
    if (/^(Message delivered|Launching skill|Clicked at|Waited for|Navigated to|Typed |Scrolled)/.test(text)) {
      return '';
    }
    return truncate(text, max);
  }

  /* Rewrite a full export into "compact" or "outline" form: consecutive
     assistant turns merge into one, every block becomes a line of text, and
     each tool call carries a summary of its result (compact only). */
  function condenseExport(exported, level) {
    const limits = level === 'outline'
      ? { res: 0, inp: 160, typ: 160 }
      : { res: 300, inp: 400, typ: 3000 };

    const resultsById = {};
    exported.messages.forEach(function (msg) {
      if (msg.role === 'tool_result') {
        msg.results.forEach(function (r) { resultsById[r.tool_use_id] = r; });
      }
    });

    const condensed = [];
    exported.messages.forEach(function (msg) {
      if (msg.role === 'user') {
        condensed.push({ role: 'user', ts: msg.ts, text: msg.text });
        return;
      }
      if (msg.role !== 'assistant') return;

      let turn = condensed[condensed.length - 1];
      if (!turn || turn.role !== 'assistant') {
        turn = { role: 'assistant', content: [] };
        condensed.push(turn);
      }

      msg.content.forEach(function (block) {
        if (block.type === 'text') {
          turn.content.push(block.text);
        } else if (block.type === 'thinking') {
          turn.content.push('[thinking] ' + block.text);
        } else if (block.type === 'tool_use') {
          let line = '▸ ' + summarizeToolCall(block.name, block.input, limits);
          const result = resultsById[block.id];
          if (result && limits.res) {
            const summary = summarizeToolResult(result.content, limits.res);
            if (summary) line += '\n  → ' + (result.is_error ? '[error] ' : '') + summary;
          }
          turn.content.push(line);
        }
      });
    });

    exported.messages = condensed;
    exported.session.detail = level;
    return exported;
  }

  /* The events endpoint has returned several list and cursor shapes. */
  function eventsOf(page) {
    if (Array.isArray(page)) return page;
    return page.data || page.events || page.items || page.results || [];
  }

  /* Turn the raw event stream into { session, messages }: user prompts,
     tool results, and assistant messages (streamed chunks with the same
     message id merge into one entry). */
  function buildSessionExport(sessionResponse, events) {
    const session = sessionResponse.response_shape || sessionResponse;

    const seen = {};
    const ordered = events
      .filter(function (ev) {
        if (!ev || seen[ev.event_id]) return false;
        seen[ev.event_id] = true;
        return true;
      })
      .sort(function (a, b) { return Number(a.sequence_num) - Number(b.sequence_num); });

    let messages = [];
    const assistantById = {};
    let model = null;
    let totalCost = null;

    ordered.forEach(function (ev) {
      const payload = ev.payload || {};
      const ts = payload.timestamp || ev.created_at;
      const seq = Number(ev.sequence_num);

      if (payload.type === 'result' && payload.total_cost_usd != null) {
        totalCost = payload.total_cost_usd;
      }

      if (payload.type === 'user' && payload.message) {
        const content = payload.message.content;
        if (typeof content === 'string') {
          if (payload.isSynthetic) return;
          if (payload.shouldQuery === false || /^\s*<system-reminder>/.test(content)) return;
          messages.push({ seq: seq, ts: ts, role: 'user', text: content });
        } else if (Array.isArray(content)) {
          const results = content
            .filter(function (b) { return b.type === 'tool_result'; })
            .map(function (b) {
              const result = { tool_use_id: b.tool_use_id, content: flattenText(b.content) };
              if (b.is_error) result.is_error = true;
              return result;
            });
          if (results.length) messages.push({ seq: seq, ts: ts, role: 'tool_result', results: results });
        }
      } else if (payload.type === 'assistant' && payload.message) {
        const msg = payload.message;
        model = msg.model || model;
        const key = msg.id || ev.event_id;
        let entry = assistantById[key];
        if (!entry) {
          entry = { seq: seq, ts: ts, role: 'assistant', content: [] };
          assistantById[key] = entry;
          messages.push(entry);
        }
        (msg.content || []).forEach(function (block) {
          if (block.type === 'text') {
            entry.content.push({ type: 'text', text: block.text });
          } else if (block.type === 'thinking') {
            if (block.thinking) entry.content.push({ type: 'thinking', text: block.thinking });
          } else if (block.type === 'tool_use') {
            entry.content.push({ type: 'tool_use', id: block.id, name: block.name, input: block.input });
          } else {
            entry.content.push(block);
          }
        });
        if (msg.stop_reason) entry.stop_reason = msg.stop_reason;
      }
    });

    messages = messages.filter(function (m) { return m.role !== 'assistant' || m.content.length; });

    return {
      session: {
        id: session.id,
        title: session.title,
        created_at: session.created_at,
        updated_at: session.updated_at,
        status: session.status,
        model: model,
        total_cost_usd: totalCost,
        session_url: session.session_url
      },
      messages: messages
    };
  }

  async function exportSession(id) {
    const base = location.origin + '/v1/code/sessions/' + id;
    const session = await fetchJson(base);
    if (!session) {
      alert('✗ Session fetch failed (see console for status/body)');
      return;
    }

    let events = [];
    let cursor = null;
    let pages = 0;
    let partial = false;

    while (pages < 200) {
      const page = await fetchJson(base + '/events?limit=100' + (cursor ? '&' + cursor : ''));
      if (!page) {
        alert('✗ Events fetch failed (see console)');
        return;
      }
      pages++;
      events = events.concat(eventsOf(page));
      console.log(LOG, 'Page', pages, 'keys:', Object.keys(page), 'total events:', events.length);

      let next = null;
      if (page.next_cursor) next = 'cursor=' + encodeURIComponent(page.next_cursor);
      else if (page.next_page) next = 'page=' + encodeURIComponent(page.next_page);
      else if (page.has_more && page.last_id) next = 'after_id=' + encodeURIComponent(page.last_id);
      else if (page.has_more) partial = true;

      if (!next || next === cursor) break;
      cursor = next;
    }

    if (partial) alert('⚠ More events exist but no cursor field was recognized. Export is partial; see console.');

    let exported = buildSessionExport(session, events);
    const level = String(prompt('Detail level: full | compact | outline', 'compact') || 'compact').toLowerCase();
    if (level === 'compact' || level === 'outline') exported = condenseExport(exported, level);

    console.log(LOG, 'Events:', events.length, 'Messages:', exported.messages.length);
    downloadJson(exported, exported.session.title || 'cowork-session', id);
  }

  /* ---------- claude.ai chats and shared snapshots ---------- */

  /* Strip UI state and empty fields from a conversation tree. */
  function pruneConversation(conv) {
    pruneFields(conv, [
      'settings', 'is_starred', 'is_archived', 'is_temporary', 'workspace_upgraded',
      'is_multiplayer', 'platform', 'is_wiggle_enabled', 'effective_thinking_mode'
    ], []);
    (conv.chat_messages || []).forEach(function (msg) {
      pruneFields(msg, ['index', 'updated_at'],
        ['text', 'truncated', 'attachments', 'files', 'sync_sources']);
      (msg.content || []).forEach(function (block) {
        pruneFields(block, [
          'start_timestamp', 'stop_timestamp', 'display_content', 'message',
          'integration_name', 'icon_name', 'tool_origin', 'meta'
        ], ['citations', 'truncated', 'cut_off', 'hidden', 'thinking_hidden', 'thinking']);
      });
    });
    return conv;
  }

  async function exportConversation(id, isShare) {
    const bootstrap = await fetchJson(location.origin + '/api/bootstrap');
    const orgIds = (bootstrap && bootstrap.account && bootstrap.account.memberships || [])
      .map(function (m) { return m.organization && m.organization.uuid; })
      .filter(Boolean);
    if (!orgIds.length) {
      alert('✗ Could not find organization ID');
      return;
    }

    /* Try each organization the account belongs to until one returns the chat. */
    let conv = null;
    for (let i = 0; i < orgIds.length && !conv; i++) {
      const orgBase = location.origin + '/api/organizations/' + orgIds[i];
      const url = isShare
        ? orgBase + '/chat_snapshots/' + id + '?rendering_mode=messages&render_all_tools=true'
        : orgBase + '/chat_conversations/' + id + '?tree=True&rendering_mode=messages&render_all_tools=true';
      conv = await fetchJson(url);
    }
    if (!conv) {
      alert('✗ Conversation fetch failed for all organizations');
      return;
    }

    conv = pruneConversation(conv);
    downloadJson(conv, conv.name, id);
  }

  /* ---------- Entry point ---------- */

  (async function () {
    if (location.hostname.indexOf('claude.ai') === -1) {
      alert('✗ This bookmarklet only works on claude.ai pages');
      return;
    }
    const path = location.pathname;
    const id = path.split('/').filter(Boolean).pop();
    if (!id) {
      alert('✗ No ID in URL');
      return;
    }

    const isSession = path.indexOf('/cowork/') !== -1 || path.indexOf('/code/') !== -1 ||
      id.indexOf('cse_') === 0 || id.indexOf('session_') === 0;

    if (isSession) await exportSession(id);
    else await exportConversation(id, path.indexOf('/share/') !== -1);
  })().catch(function (err) {
    console.error(LOG, err);
    alert('✗ Export failed: ' + err.message);
  });
})();
