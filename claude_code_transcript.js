javascript:
/* @title: Claude Code Transcript Exporter */
/* @description: Exports a full Claude Code (web) session transcript as Markdown or JSON, pulling every entry out of the virtualized list's React props */
/* @domains: claude.ai */
(function () {
  /* Claude Code (web) — Full Transcript Exporter
     Pulls the complete entry list out of the virtualized transcript's React
     props, so nothing is lost to windowing. Copy as Markdown, download as
     Markdown, or download raw JSON. */

  try {
    console.log('CC-Transcript: starting');

    /* ---------- locate the transcript data ---------- */

    var SESSION_RE = /^session_[A-Za-z0-9_-]+$/;

    var urlMatch = location.pathname.match(/session_[A-Za-z0-9_-]+/);
    var sessionId = urlMatch ? urlMatch[0] : null;

    function fiberOf(el) {
      var k = Object.keys(el).filter(function(x) { return x.indexOf('__reactFiber$') === 0; })[0];
      return k ? el[k] : null;
    }

    /* Pull a session id out of one props object, without walking the whole
       React graph. Session-named keys are read first, so a stray `session_...`
       string in some unrelated prop cannot outrank an explicit `sessionId`. */
    function sessionIdFrom(props) {
      if (!props || typeof props !== 'object') return null;
      var keys;
      try { keys = Object.keys(props); } catch (e) { return null; }
      var named = [], other = [], i, v;
      for (i = 0; i < keys.length; i++) {
        (/session/i.test(keys[i]) ? named : other).push(keys[i]);
      }
      var order = named.concat(other);
      for (i = 0; i < order.length; i++) {
        try { v = props[order[i]]; } catch (e) { continue; }
        if (typeof v === 'string' && SESSION_RE.test(v)) return v;
        if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.id === 'string' && SESSION_RE.test(v.id)) return v.id;
      }
      return null;
    }

    /* Climb from one transcript host to the nearest props carrying an entry
       array, and to the nearest session id in the same chain. That id is what
       distinguishes this session's transcript from another session the SPA
       still has mounted. */
    function candidateFor(host) {
      var node = fiberOf(host), hops = 0;
      var entries = null, depth = -1, found = null;
      while (node && hops < 80) {
        var p = null;
        try { p = node.memoizedProps; } catch (e) { p = null; }
        if (p) {
          if (!entries) {
            if (Array.isArray(p.entries) && p.entries.length) { entries = p.entries; depth = hops; }
            else if (Array.isArray(p.baseEntries) && p.baseEntries.length) { entries = p.baseEntries; depth = hops; }
          }
          if (!found) found = sessionIdFrom(p);
        }
        if (entries && found) break;
        node = node.return;
        hops++;
      }
      return entries ? { entries: entries, sessionId: found, depth: depth, host: host } : null;
    }

    function areaOf(el) {
      try {
        var r = el.getBoundingClientRect();
        return (r.width || 0) * (r.height || 0);
      } catch (e) { return 0; }
    }

    function isVisible(el) {
      try { return !!(el.offsetParent || areaOf(el)); } catch (e) { return true; }
    }

    function collectCandidates() {
      var hosts = document.querySelectorAll('[data-testid="epitaxy-virtual-transcript"]');
      var out = [], seen = [];
      for (var i = 0; i < hosts.length; i++) {
        var c = candidateFor(hosts[i]);
        if (!c || seen.indexOf(c.entries) !== -1) continue;
        seen.push(c.entries);
        c.visible = isVisible(hosts[i]);
        c.area = areaOf(hosts[i]);
        out.push(c);
      }
      return out;
    }

    var candidates = collectCandidates();
    if (!candidates.length) {
      alert('✗ No transcript data found.\n\nOpen a Claude Code session page (claude.ai/code/session_...) and let it finish loading, then try again.');
      return;
    }

    console.log('CC-Transcript: candidates =', candidates.map(function(c) {
      return { session: c.sessionId, entries: c.entries.length, depth: c.depth, visible: c.visible, area: c.area };
    }));

    /* ---------- scope to one session ---------- */

    var matched = [], foreign = [], unknown = [];
    candidates.forEach(function(c) {
      if (!c.sessionId || !sessionId) unknown.push(c);
      else if (c.sessionId === sessionId) matched.push(c);
      else foreign.push(c);
    });

    var scopeWarnings = [];
    var chosen, dropped;

    function describe(list) {
      return list.map(function(c) { return (c.sessionId || 'unidentified') + ' (' + c.entries.length + ')'; }).join(', ');
    }

    if (matched.length) {
      chosen = matched;
      dropped = foreign.concat(unknown);
    } else if (candidates.length === 1) {
      chosen = candidates;
      dropped = [];
      if (foreign.length) {
        scopeWarnings.push('The mounted transcript reports ' + foreign[0].sessionId + ' but the URL says ' + sessionId + '. Exported what is mounted.');
      }
    } else {
      /* Nothing carried a usable session id. Rank by what is actually on
         screen — a stale transcript the router left mounted is hidden or
         collapsed — then by how close the entry array sits to its host. */
      var ranked = candidates.slice().sort(function(a, b) {
        if (a.visible !== b.visible) return a.visible ? -1 : 1;
        if (a.area !== b.area) return b.area - a.area;
        return a.depth - b.depth;
      });
      chosen = ranked.slice(0, 1);
      dropped = ranked.slice(1);
      scopeWarnings.push('None of the ' + candidates.length + ' mounted transcripts identifies itself as ' +
                         (sessionId || 'this session') + '; exported the ' + (chosen[0].visible ? 'largest visible' : 'first') + ' one.');
    }

    if (dropped.length) {
      scopeWarnings.push('Ignored ' + dropped.length + ' other transcript' + (dropped.length === 1 ? '' : 's') +
                         ' mounted on this page: ' + describe(dropped) + '.');
      console.log('CC-Transcript: skipped', describe(dropped));
    }

    var transcriptSession = chosen[0].sessionId || sessionId || 'unknown';

    /* ---------- helpers ---------- */

    function safeJson(value, indent) {
      var seen = new WeakSet();
      return JSON.stringify(value, function(k, v) {
        if (typeof v === 'object' && v !== null) {
          if (seen.has(v)) return '[Circular]';
          seen.add(v);
        }
        if (typeof v === 'function') return '[Function]';
        return v;
      }, indent);
    }

    function fence(body, lang) {
      var s = (body === null || body === undefined) ? '' : String(body);
      var runs = s.match(/`+/g) || [];
      var longest = 0;
      runs.forEach(function(r) { if (r.length > longest) longest = r.length; });
      var bar = new Array(Math.max(3, longest + 1) + 1).join('`');
      return bar + (lang || '') + '\n' + s + '\n' + bar;
    }

    function stamp(ts) {
      if (!ts) return '';
      try { return new Date(ts).toISOString().replace('T', ' ').replace(/\.\d+Z$/, 'Z'); }
      catch (e) { return String(ts); }
    }

    function textOf(v) { return (typeof v === 'string') ? v : safeJson(v, 2); }

    /* ---------- renderers ---------- */

    function renderTool(t) {
      var out = [];
      var state = t.isError ? 'ERROR' : (t.status || 'done');
      out.push('#### 🔧 ' + (t.name || 'tool') + '  `' + state + '`');
      if (t.policyDenied) out.push('> policy denied');

      if (t.input !== undefined && t.input !== null) {
        out.push('**Input**\n\n' + fence(safeJson(t.input, 2), 'json'));
      }

      var res = t.output;
      if (res === undefined || res === null || res === '') res = t.toolUseResult;
      if (res === undefined || res === null || res === '') res = t.rawResultContent;
      if (res !== undefined && res !== null && res !== '') {
        out.push('**Output**\n\n' + fence(textOf(res)));
      } else {
        out.push('**Output**\n\n_(empty)_');
      }
      return out.join('\n\n');
    }

    function renderTaskEvent(ev) {
      var bits = [];
      if (ev.taskType) bits.push(ev.taskType);
      if (ev.status) bits.push('status=' + ev.status);
      if (ev.durationMs !== undefined && ev.durationMs !== null) bits.push(Math.round(ev.durationMs / 1000) + 's');
      var line = '- 🧵 **task** ' + (ev.description || ev.taskId || '') + (bits.length ? '  _(' + bits.join(', ') + ')_' : '');
      if (ev.summary) line += '\n\n' + fence(textOf(ev.summary));
      return line;
    }

    function renderItem(item) {
      var kind = item.kind || item.type || 'unknown';

      if (kind === 'text') return textOf(item.text);

      if (kind === 'thinking') return '> **thinking**\n\n' + fence(textOf(item.thinking || item.text));

      if (kind === 'tools') {
        var parts = [];
        (item.tools || []).forEach(function(t) { parts.push(renderTool(t)); });
        (item.taskEvents || []).forEach(function(ev) { parts.push(renderTaskEvent(ev)); });
        return parts.join('\n\n');
      }

      if (kind === 'task_event') return renderTaskEvent(item);

      if (kind === 'error') return '> ⚠️ **error** ' + (item.code ? '`' + item.code + '` ' : '') + (textOf(item.text) || '');

      if (kind === 'turn_error') {
        return '> ⚠️ **turn error** ' + (item.subtype || '') + '\n\n' + fence(safeJson(item.errors, 2), 'json');
      }

      /* unknown kind — dump it verbatim so nothing is silently dropped */
      return '_(' + kind + ')_\n\n' + fence(safeJson(item, 2), 'json');
    }

    function renderEntry(entry, index) {
      var who = String(entry.author || 'unknown');
      var head = who.charAt(0).toUpperCase() + who.slice(1);
      if (entry.model) head += ' (' + entry.model + ')';
      var when = stamp(entry.timestamp);

      var lines = ['## ' + (index + 1) + '. ' + head + (when ? ' — ' + when : '')];
      if (entry.sourceUuid) lines.push('<!-- ' + entry.sourceUuid + ' -->');
      (entry.items || []).forEach(function(it) {
        var body = renderItem(it);
        if (body) lines.push(body);
      });
      return lines.join('\n\n');
    }

    /* ---------- assemble ---------- */

    var fileTag = sessionId || 'transcript';
    var exportedAt = new Date().toISOString();

    /* Flatten the selected transcripts and drop repeats by entry identity, so
       two props pointing at overlapping slices of one session cannot double up. */
    function flatten(list) {
      var out = [], seenIds = {};
      list.forEach(function(c) {
        c.entries.forEach(function(e) {
          var key = e && (e.id || e.eventUuid || e.sourceUuid);
          if (key) {
            if (seenIds[key]) return;
            seenIds[key] = 1;
          }
          out.push(e);
        });
      });
      return out;
    }

    /* Backwards time inside one export means entries from more than one
       session got concatenated — the failure this scoping exists to prevent. */
    function chronologyWarning(list) {
      var backSteps = 0, prev = null;
      list.forEach(function(e) {
        var t = (e && e.timestamp) ? Date.parse(e.timestamp) : NaN;
        if (isNaN(t)) return;
        if (prev !== null && t < prev - 1000) backSteps++;
        prev = t;
      });
      if (!backSteps) return null;
      return backSteps + ' backwards timestamp jump' + (backSteps === 1 ? '' : 's') +
             ' in the exported entries — this export may still mix sessions.';
    }

    var entries, warnings, scopeLabel, md;

    function setScope(list, baseWarnings, label) {
      entries = flatten(list);
      warnings = baseWarnings.slice();
      var chrono = chronologyWarning(entries);
      if (chrono) warnings.push(chrono);
      scopeLabel = label;
      md = buildMarkdown();
      console.log('CC-Transcript:', label, '—', entries.length, 'entries,', md.length, 'chars of markdown');
      warnings.forEach(function(w) { console.warn('CC-Transcript:', w); });
    }

    function buildMarkdown() {
      var lines = [
        '# ' + (document.title || 'Claude Code transcript'),
        '',
        '- **Session:** `' + (scopeLabel === 'all' ? 'all mounted transcripts' : transcriptSession) + '`',
        '- **URL:** ' + location.origin + location.pathname,
        '- **Exported:** ' + exportedAt,
        '- **Entries:** ' + entries.length
      ];
      warnings.forEach(function(w) { lines.push('- **Warning:** ' + w); });
      lines.push('', '---');
      var body = entries.map(renderEntry).join('\n\n---\n\n');
      return lines.join('\n') + '\n\n' + body + '\n';
    }

    function buildJson() {
      return safeJson({
        session: scopeLabel === 'all' ? null : transcriptSession,
        urlSession: sessionId,
        scope: scopeLabel,
        url: location.origin + location.pathname,
        title: document.title,
        exportedAt: exportedAt,
        entryCount: entries.length,
        skippedTranscripts: (scopeLabel === 'all' ? [] : dropped).map(function(c) {
          return { session: c.sessionId || null, entryCount: c.entries.length };
        }),
        warnings: warnings,
        entries: entries
      }, 2);
    }

    /* ---------- delivery ---------- */

    function download(text, ext, mime) {
      var name = 'claude-code-' + fileTag + (scopeLabel === 'all' ? '-all' : '') + '-' + exportedAt.slice(0, 10) + '.' + ext;
      var blob = new Blob([text], { type: mime + ';charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function() { URL.revokeObjectURL(url); }, 4000);
      return name;
    }

    function copy(text, done) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() { done(true); }, function(err) {
          console.error('CC-Transcript: clipboard failed', err);
          done(fallbackCopy(text));
        });
      } else {
        done(fallbackCopy(text));
      }
    }

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    }

    /* ---------- panel ---------- */

    var old = document.getElementById('cc-transcript-panel');
    if (old) old.remove();

    setScope(chosen, scopeWarnings, 'session');

    var panel = document.createElement('div');
    panel.id = 'cc-transcript-panel';
    panel.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;background:#1f1e1d;color:#f5f4f2;font:13px/1.5 ui-sans-serif,system-ui,sans-serif;border:1px solid #454340;border-radius:10px;padding:12px 14px;box-shadow:0 8px 30px rgba(0,0,0,.45);min-width:250px;max-width:340px';

    var title = document.createElement('div');
    title.textContent = 'Transcript export';
    title.style.cssText = 'font-weight:600;margin-bottom:2px';

    var meta = document.createElement('div');
    meta.style.cssText = 'opacity:.65;margin-bottom:8px;font-size:12px;word-break:break-all';

    var warn = document.createElement('div');
    warn.style.cssText = 'color:#e8c07d;font-size:12px;margin-bottom:10px';

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';

    var status = document.createElement('div');
    status.style.cssText = 'margin-top:9px;font-size:12px;min-height:16px;color:#c8e6a0';

    function refresh() {
      meta.textContent = entries.length + ' entries · ' + Math.round(md.length / 1024) + ' KB markdown · ' +
                         (scopeLabel === 'all' ? 'all mounted transcripts' : transcriptSession);
      warn.textContent = warnings.length ? '⚠ ' + warnings.join(' ') : '';
      warn.style.display = warnings.length ? 'block' : 'none';
      status.textContent = '';
    }

    function button(label, handler) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'cursor:pointer;background:#c96442;color:#fff;border:0;border-radius:6px;padding:6px 10px;font:inherit;font-size:12px';
      b.addEventListener('click', handler);
      row.appendChild(b);
      return b;
    }

    button('Copy MD', function() {
      status.textContent = 'copying…';
      copy(md, function(ok) { status.textContent = ok ? '✓ copied to clipboard' : '✗ copy blocked — use Download'; });
    });
    button('Download MD', function() { status.textContent = '✓ ' + download(md, 'md', 'text/markdown'); });
    button('Download JSON', function() { status.textContent = '✓ ' + download(buildJson(), 'json', 'application/json'); });

    /* Escape hatch: if the scoping picked the wrong transcript, everything
       mounted is still one click away. */
    if (dropped.length) {
      var toggle = button('Include all', function() {
        if (scopeLabel === 'session') {
          setScope(candidates, ['Scope: every transcript mounted on this page (' + describe(candidates) + ').'], 'all');
          toggle.textContent = 'This session only';
        } else {
          setScope(chosen, scopeWarnings, 'session');
          toggle.textContent = 'Include all';
        }
        refresh();
      });
      toggle.style.background = '#454340';
    }

    var close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'cursor:pointer;background:transparent;color:#f5f4f2;border:0;font:inherit;font-size:18px;line-height:1;position:absolute;top:8px;right:10px;opacity:.6';
    close.addEventListener('click', function() { panel.remove(); });

    panel.appendChild(close);
    panel.appendChild(title);
    panel.appendChild(meta);
    panel.appendChild(warn);
    panel.appendChild(row);
    panel.appendChild(status);
    document.body.appendChild(panel);
    refresh();

    console.log('CC-Transcript: ready');
  } catch (error) {
    console.error('CC-Transcript error:', error);
    alert('✗ Transcript export failed: ' + error.message);
  }
})();
