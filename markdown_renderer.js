javascript:
/* @title: Render Markdown */
/* @description: Renders raw markdown (markdown content-type, single PRE body, or plain body text) as styled HTML with a light/dark theme toggle */
(function() {
    /* Detect markdown source on the current page */
    let src = '';
    const pre = document.body && document.body.firstElementChild;
    if (document.contentType && /markdown/i.test(document.contentType)) {
        src = document.body.innerText;
    } else if (document.body.children.length === 1 && pre && pre.tagName === 'PRE') {
        src = pre.innerText;
    } else {
        src = document.body.innerText;
    }

    /* Apply (and persist) light/dark theme; update toggle label */
    function applyTheme(t) {
        document.documentElement.setAttribute('data-md-theme', t);
        try { localStorage.setItem('mdBookmarkletTheme', t); } catch (e) {}
        const btn = document.getElementById('md-theme-toggle');
        if (btn) btn.textContent = t === 'dark' ? '\u2600\ufe0f Light' : '\uD83C\uDF19 Dark';
    }

    /* Render markdown into the page */
    function render(md) {
        const html = window.marked.parse(md);
        document.body.innerHTML = '<button id="md-theme-toggle" type="button"></button><div id="md-rendered">' + html + '</div>';

        const s = document.createElement('style');
        s.textContent = 'html{color-scheme:light}html[data-md-theme="dark"]{color-scheme:dark}html,body{margin:0}html[data-md-theme="light"],html[data-md-theme="light"] body{background:#fff!important;color:#24292e!important}html[data-md-theme="dark"],html[data-md-theme="dark"] body{background:#0d1117!important;color:#c9d1d9!important}#md-theme-toggle{position:fixed;top:12px;right:16px;z-index:9999;border:1px solid #d0d7de;background:#f6f8fa;color:#24292e;padding:6px 12px;border-radius:6px;font:13px -apple-system,Segoe UI,sans-serif;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.1)}#md-theme-toggle:hover{background:#eaeef2}html[data-md-theme="dark"] #md-theme-toggle{background:#21262d;color:#c9d1d9;border-color:#30363d}html[data-md-theme="dark"] #md-theme-toggle:hover{background:#30363d}#md-rendered{max-width:880px;margin:24px auto;padding:0 24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;line-height:1.6}#md-rendered h1,#md-rendered h2{padding-bottom:.3em;border-bottom:1px solid}html[data-md-theme="light"] #md-rendered h1,html[data-md-theme="light"] #md-rendered h2{border-color:#eaecef}html[data-md-theme="dark"] #md-rendered h1,html[data-md-theme="dark"] #md-rendered h2{border-color:#30363d}#md-rendered a{color:#0366d6}html[data-md-theme="dark"] #md-rendered a{color:#58a6ff}#md-rendered code{padding:2px 6px;border-radius:4px;font-family:ui-monospace,Consolas,monospace}#md-rendered pre{padding:12px;border-radius:6px;overflow:auto}html[data-md-theme="light"] #md-rendered code,html[data-md-theme="light"] #md-rendered pre{background:#f6f8fa}html[data-md-theme="dark"] #md-rendered code,html[data-md-theme="dark"] #md-rendered pre{background:#161b22}#md-rendered pre code{background:transparent!important;padding:0}#md-rendered table{border-collapse:collapse}#md-rendered th,#md-rendered td{border:1px solid;padding:6px 12px}html[data-md-theme="light"] #md-rendered th,html[data-md-theme="light"] #md-rendered td{border-color:#dfe2e5}html[data-md-theme="dark"] #md-rendered th,html[data-md-theme="dark"] #md-rendered td{border-color:#30363d}#md-rendered blockquote{border-left:4px solid;padding:0 1em;margin:0}html[data-md-theme="light"] #md-rendered blockquote{border-color:#dfe2e5;color:#6a737d}html[data-md-theme="dark"] #md-rendered blockquote{border-color:#30363d;color:#8b949e}#md-rendered hr{border:0;border-top:1px solid}html[data-md-theme="light"] #md-rendered hr{border-color:#eaecef}html[data-md-theme="dark"] #md-rendered hr{border-color:#30363d}';
        document.head.appendChild(s);

        let saved;
        try { saved = localStorage.getItem('mdBookmarkletTheme'); } catch (e) {}
        const initial = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyTheme(initial);

        document.getElementById('md-theme-toggle').addEventListener('click', function() {
            applyTheme(document.documentElement.getAttribute('data-md-theme') === 'dark' ? 'light' : 'dark');
        });

        /* Use first H1 as document title if present */
        const m = md.match(/^#\s+(.+)/m);
        if (m) document.title = m[1];
    }

    /* Load marked.js if not already present, then render */
    if (window.marked) {
        render(src);
    } else {
        const sc = document.createElement('script');
        sc.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        sc.onload = function() { render(src); };
        document.head.appendChild(sc);
    }
})();
