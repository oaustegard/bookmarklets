/* Build a bookmarklet: minify a source file into a javascript: URL and write
   an install page with a draggable link.

   Usage (from tools/):  npm install && node build_bookmarklet.mjs ../caption_transcript.js
   Writes:  ../install/<name>.url   (the javascript: URL, one line)
            ../install/<name>.html  (install page) */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { minify } from 'terser';

const source = process.argv[2];
if (!source) {
  console.error('usage: node build_bookmarklet.mjs <bookmarklet.js>');
  process.exit(1);
}

const raw = readFileSync(source, 'utf8');
const meta = (tag) => (raw.match(new RegExp('@' + tag + ':\\s*(.*?)\\s*\\*/')) || [])[1] || '';
const name = basename(source, '.js');
const title = meta('title') || name.replace(/_/g, ' ');
const description = meta('description');

const code = raw.replace(/^\s*javascript:/, '');
const result = await minify(code, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false }
});
if (!result.code) throw new Error('terser produced no output');
/* The repo rule is block comments only: a line comment breaks the source
   when pasted unminified as a bookmark URL. */
if (/(^|[\s;{}),])\/\/(?!\/)/m.test(raw.replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, '""'))) {
  throw new Error(source + ' contains a // comment; use block comments');
}

const url = 'javascript:' + encodeURIComponent(result.code).replace(/'/g, '%27');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const outDir = join(dirname(resolve(source)), 'install');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, name + '.url'), url + '\n');

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; --fg: #1d1d1f; --bg: #fafafa; --muted: #666; --accent: #2b5fd9; }
  @media (prefers-color-scheme: dark) { :root { --fg: #eee; --bg: #161616; --muted: #aaa; --accent: #7ea2ff; } }
  body { margin: 0; padding: 32px 16px; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
  main { max-width: 640px; margin: 0 auto; }
  a.bookmarklet { display: inline-block; padding: 10px 18px; border-radius: 8px; background: var(--accent); color: #fff; text-decoration: none; font-weight: 600; cursor: grab; }
  p.small { color: var(--muted); font-size: 14px; }
  code { font-size: 14px; }
</style>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
<p>${escapeHtml(description)}</p>
<p><a class="bookmarklet" href="${escapeHtml(url)}">${escapeHtml(title)}</a></p>
<p>Drag the button to your bookmarks bar. Open a page with a video and click the bookmark.</p>
<p class="small">${result.code.length.toLocaleString('en-US')} characters minified. Source:
<a href="https://github.com/oaustegard/bookmarklets/blob/main/${name}.js"><code>${name}.js</code></a></p>
</main>
</body>
</html>
`;
writeFileSync(join(outDir, name + '.html'), page);
console.log(`built ${name}: ${result.code.length} chars minified, ${url.length} chars as URL -> ${outDir}`);
