# Markdown Renderer

Renders raw markdown on the current page as styled HTML, with a persistent light/dark theme toggle. Useful for `.md` files served as plain text by GitHub raw, S3, Pages, gists, or anything that serves the source instead of rendering it.

## Purpose

Click on a raw markdown URL (e.g. `raw.githubusercontent.com/.../README.md`, an S3 bucket, a local file, an internal docs server) and the browser shows you the source. This bookmarklet replaces that view with a GitHub-style rendered version, in place. No new tab, no copy-paste, no detour through a dedicated viewer.

Common use cases:
- Reading raw GitHub markdown without going back to the rendered repo view
- Skimming markdown attachments served as `text/plain`
- Reviewing local `.md` files opened in the browser
- Reading markdown from internal tools that don't render it

## Features

- **Smart source detection**: Picks the markdown body whether the page is served as `text/markdown`, as a single `<pre>` block (the typical raw view), or as plain body text.
- **GitHub-style rendering**: Headings, code blocks, tables, blockquotes, and links styled to match GitHub's light and dark themes.
- **Light/dark toggle**: Fixed button in the top-right; choice is persisted in `localStorage` (`mdBookmarkletTheme`) across pages and sessions.
- **System-default first run**: On first use, picks light or dark based on `prefers-color-scheme`.
- **Title from H1**: Sets the document title to the first `# H1` in the source, so the browser tab reflects what you're reading.
- **Idempotent loader**: Reuses `window.marked` if it's already on the page; otherwise loads `marked.min.js` from jsdelivr on demand.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=markdown_renderer.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [markdown_renderer.js file](https://github.com/oaustegard/bookmarklets/blob/main/markdown_renderer.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Render Markdown").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any page whose body is markdown source — for example a `raw.githubusercontent.com` URL, an S3-hosted `.md` file, or a local `file:///.../README.md`.
2.  Click the "Render Markdown" bookmarklet.
3.  The page is replaced in place with rendered HTML. Use the button in the top-right to toggle light/dark.

## How It Works

1.  **Source detection**: Picks `src` from the first matching rule:
    *   `document.contentType` matches `/markdown/i` → use `document.body.innerText`.
    *   Body has a single child that is a `<pre>` element (the typical raw-text view) → use `pre.innerText`.
    *   Otherwise → fall back to `document.body.innerText`.
2.  **Loader**: If `window.marked` is already defined, render immediately. Otherwise inject `<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js">` and render in its `onload`.
3.  **Render**: Calls `marked.parse(src)`, replaces `document.body` with a fixed-position theme toggle button plus a `#md-rendered` container holding the parsed HTML.
4.  **Styling**: Injects a single `<style>` element scoped via the `data-md-theme` attribute on `<html>`. Both light and dark variants are defined; the active one is selected by attribute value.
5.  **Theme**: Reads saved theme from `localStorage` under `mdBookmarkletTheme`; falls back to `matchMedia('(prefers-color-scheme: dark)')`. The toggle button flips the attribute and re-saves.
6.  **Title**: Matches `/^#\s+(.+)/m` against the source; if found, sets `document.title` to the first H1 text.

## Notes & Caveats

- The script replaces `document.body.innerHTML`, so any original page state (form input, scroll-restored elements) is discarded once the bookmarklet runs.
- Reading from `localStorage` is wrapped in `try/catch`; the bookmarklet still works on origins that block storage, you just lose persistence of the theme choice.
- Loading `marked.min.js` from jsdelivr requires the page's CSP to allow `script-src cdn.jsdelivr.net`. Strict-CSP pages will block it; in that case, save the page as `.md` locally and run the bookmarklet there.
- No syntax highlighting — code blocks are rendered as plain `<pre><code>`. Add a highlighter (e.g. `highlight.js`) to the loader if you need it.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/markdown_renderer.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
