javascript:
/* @title: Bitbucket diff stats */
/* @description: Adds add/delete line number stats to a Bitbucket PR's Diff page */
/* @domains: *bitbucket* */
(async () => {
  /* Match Bitbucket Data Center/Server PR URL pattern */
  const m = location.pathname.match(/\/projects\/([^/]+)\/repos\/([^/]+)\/pull-requests\/(\d+)/);
  if (!m) return alert('Not on a Bitbucket PR page');
  const [, p, r, n] = m;

  /* Fetch the PR diff with zero context lines */
  const res = await fetch(
    `/rest/api/latest/projects/${p}/repos/${r}/pull-requests/${n}/diff?withComments=false&contextLines=0`,
    { headers: { Accept: 'application/json' }, credentials: 'same-origin' }
  );
  if (!res.ok) return alert('API ' + res.status);
  const d = await res.json();

  /* Aggregate per-file added/removed line counts */
  const f = {};
  (d.diffs || []).forEach(x => {
    const k = (x.destination && x.destination.toString) || (x.source && x.source.toString);
    if (!k) return;
    let a = 0, b = 0;
    (x.hunks || []).forEach(h =>
      (h.segments || []).forEach(s => {
        if (s.type === 'ADDED') a += s.lines.length;
        else if (s.type === 'REMOVED') b += s.lines.length;
      })
    );
    f[k] = { a, b };
  });

  /* Inject diff-stat styles once */
  const SID = 'bb-diffstat-style';
  if (!document.getElementById(SID)) {
    const s = document.createElement('style');
    s.id = SID;
    s.textContent =
      '.bb-ds{float:right;font-size:11px;font-family:ui-monospace,monospace;margin-left:6px;white-space:nowrap}' +
      '.bb-ds .a{color:#1a7f37;font-weight:600}' +
      '.bb-ds .d{color:#cf222e;font-weight:600;margin-left:4px}' +
      '.bb-dd{float:right;font-size:11px;font-family:ui-monospace,monospace;margin-left:6px;white-space:nowrap;opacity:.85}' +
      '.bb-dd .a{color:#1a7f37}' +
      '.bb-dd .d{color:#cf222e;margin-left:4px}';
    document.head.appendChild(s);
  }

  /* Remove previously injected stat spans on re-run */
  document.querySelectorAll('.bb-ds,.bb-dd').forEach(e => e.remove());

  /* Annotate individual files in the changes tree */
  document.querySelectorAll('.changes-tree li.file').forEach(li => {
    const a = li.querySelector('a[href^="#"]');
    if (!a) return;
    const k = decodeURIComponent(a.getAttribute('href').slice(1));
    const s = f[k];
    if (!s) return;
    const e = document.createElement('span');
    e.className = 'bb-ds';
    e.innerHTML = `<span class="a">+${s.a}</span><span class="d">-${s.b}</span>`;
    a.appendChild(e);
  });

  /* Recursively roll up stats per directory */
  function rollup(li) {
    const ol = li.querySelector(':scope > ol.files');
    if (!ol) return { a: 0, b: 0 };
    let a = 0, b = 0;
    ol.querySelectorAll(':scope > li').forEach(c => {
      if (c.classList.contains('file')) {
        const x = c.querySelector('a[href^="#"]');
        if (x) {
          const s = f[decodeURIComponent(x.getAttribute('href').slice(1))];
          if (s) { a += s.a; b += s.b; }
        }
      } else if (c.classList.contains('directory')) {
        const s = rollup(c);
        a += s.a; b += s.b;
      }
    });
    return { a, b };
  }

  /* Annotate directory labels with rolled-up totals */
  document.querySelectorAll('.changes-tree li.directory').forEach(dir => {
    const btn = dir.querySelector(':scope > .directory-label');
    if (!btn) return;
    const s = rollup(dir);
    if (!s.a && !s.b) return;
    const e = document.createElement('span');
    e.className = 'bb-dd';
    e.innerHTML = `<span class="a">+${s.a}</span><span class="d">-${s.b}</span>`;
    btn.appendChild(e);
  });

  /* Update page title with total diff stats */
  const t = Object.values(f).reduce((x, s) => ({ a: x.a + s.a, b: x.b + s.b }), { a: 0, b: 0 });
  document.title = `[+${t.a}/-${t.b}] ` + document.title.replace(/^\[[^\]]+\]\s*/, '');
})();
