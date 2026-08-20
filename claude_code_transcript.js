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

    function fiberOf(el) {
      var k = Object.keys(el).filter(function(x) { return x.indexOf('__reactFiber$') === 0; })[0];
      return k ? el[k] : null;
    }

    function entriesFrom(el) {
      var node = fiberOf(el), hops = 0;
      while (node && hops < 80) {
        var p = node.memoizedProps;
        if (p) {
          if (Array.isArray(p.entries) && p.entries.length) return p.entries;
          if (Array.isArray(p.baseEntries) && p.baseEntries.length) return p.baseEntries;
        }
        node = node.return;
        hops++;
      }
      return null;
    }

    function collectEntries() {
      var hosts = document.querySelectorAll('[data-testid="epitaxy-virtual-transcript"]');
      var seen = [], all = [];
      for (var i = 0; i < hosts.length; i++) {
        var e = entriesFrom(hosts[i]);
        if (e && seen.indexOf(e) === -1) { seen.push(e); all = all.concat(e); }
      }
      return all;
    }

    var entries = collectEntries();
    if (!entries.length) {
      alert('✗ No transcript data found.\n\nOpen a Claude Code session page (claude.ai/code/session_...) and let it finish loading, then try again.');
      return;
    }
    console.log('CC-Transcript: entries =', entries.length);

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

    var sessionMatch = location.pathname.match(/session_[A-Za-z0-9_-]+/);
    var sessionId = sessionMatch ? sessionMatch[0] : 'transcript';
    var exportedAt = new Date().toISOString();

    function buildMarkdown() {
      var header = [
        '# ' + (document.title || 'Claude Code transcript'),
        '',
        '- **Session:** `' + sessionId + '`',
        '- **URL:** ' + location.origin + location.pathname,
        '- **Exported:** ' + exportedAt,
        '- **Entries:** ' + entries.length,
        '',
        '---'
      ].join('\n');
      var body = entries.map(renderEntry).join('\n\n---\n\n');
      return header + '\n\n' + body + '\n';
    }

    function buildJson() {
      return safeJson({
        session: sessionId,
        url: location.origin + location.pathname,
        title: document.title,
        exportedAt: exportedAt,
        entryCount: entries.length,
        entries: entries
      }, 2);
    }

    /* ---------- delivery ---------- */

    function download(text, ext, mime) {
      var name = 'claude-code-' + sessionId + '-' + exportedAt.slice(0, 10) + '.' + ext;
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

    var md = buildMarkdown();

    var panel = document.createElement('div');
    panel.id = 'cc-transcript-panel';
    panel.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;background:#1f1e1d;color:#f5f4f2;font:13px/1.5 ui-sans-serif,system-ui,sans-serif;border:1px solid #454340;border-radius:10px;padding:12px 14px;box-shadow:0 8px 30px rgba(0,0,0,.45);min-width:250px';

    var title = document.createElement('div');
    title.textContent = 'Transcript export';
    title.style.cssText = 'font-weight:600;margin-bottom:2px';

    var meta = document.createElement('div');
    meta.textContent = entries.length + ' entries · ' + Math.round(md.length / 1024) + ' KB markdown';
    meta.style.cssText = 'opacity:.65;margin-bottom:10px;font-size:12px';

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';

    var status = document.createElement('div');
    status.style.cssText = 'margin-top:9px;font-size:12px;min-height:16px;color:#c8e6a0';

    function button(label, handler) {
      var b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'cursor:pointer;background:#c96442;color:#fff;border:0;border-radius:6px;padding:6px 10px;font:inherit;font-size:12px';
      b.onclick = handler;
      row.appendChild(b);
      return b;
    }

    button('Copy MD', function() {
      status.textContent = 'copying…';
      copy(md, function(ok) { status.textContent = ok ? '✓ copied to clipboard' : '✗ copy blocked — use Download'; });
    });
    button('Download MD', function() { status.textContent = '✓ ' + download(md, 'md', 'text/markdown'); });
    button('Download JSON', function() { status.textContent = '✓ ' + download(buildJson(), 'json', 'application/json'); });

    var close = document.createElement('button');
    close.textContent = '×';
    close.style.cssText = 'cursor:pointer;background:transparent;color:#f5f4f2;border:0;font:inherit;font-size:18px;line-height:1;position:absolute;top:8px;right:10px;opacity:.6';
    close.onclick = function() { panel.remove(); };

    panel.appendChild(close);
    panel.appendChild(title);
    panel.appendChild(meta);
    panel.appendChild(row);
    panel.appendChild(status);
    document.body.appendChild(panel);

    console.log('CC-Transcript: ready,', md.length, 'chars of markdown');
  } catch (error) {
    console.error('CC-Transcript error:', error);
    alert('✗ Transcript export failed: ' + error.message);
  }
})();
