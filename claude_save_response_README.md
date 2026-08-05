# Claude Save Response

Saves Claude's most recent response as a `.md` file, named after the chat title.

## Purpose

Claude.ai has no built-in "export this response" action — the only path is the Copy button, followed by pasting into a text editor and saving by hand. This bookmarklet collapses that into one click: it triggers the page's own Copy button, reads the resulting markdown back from the clipboard, and downloads it as a file named after the current chat.

## Features

- **One-click export**: Click the bookmarklet on any Claude.ai chat to download the last response — no success popup, it just downloads.
- **Chat-title filename**: Reads the chat title from the page and sanitizes it into a safe filename — strips control characters, zero-width characters, and icon/emoji glyphs (UI badges appended to the title can otherwise leak into the filename), replaces filesystem-illegal characters, collapses whitespace, and truncates to 120 characters; falls back to `claude-response.md` if no title is found.
- **Reads the real clipboard**: Triggers the page's own Copy button, then reads the result back with `navigator.clipboard.readText()`, retrying briefly since the site's clipboard write is asynchronous. (An earlier version tried to intercept `navigator.clipboard.writeText` directly, but Claude.ai's copy handler holds its own bound reference to that method from before the bookmarklet runs, so the override was never actually called — the real clipboard write always went through untouched.)
- **Console logging**: Logs each step (target filename, captured length, completion) to the console for troubleshooting.
- **Failure feedback only**: Alerts only when something goes wrong (missing Copy button, no content captured, an error) — silent on success.

## Installation

### Easy Install
1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_save_response.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Save Claude Response".
3. Set the URL to the JavaScript code found in [`claude_save_response.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_save_response.js).
4. Save the bookmark.

## Usage

1. Open a conversation on claude.ai and let Claude finish a response.
2. Click the "Save Claude Response" bookmarklet.
3. The browser downloads a `.md` file named after the chat title (e.g. `My Chat Title.md`), containing the last response's markdown. On the first use, the browser may prompt to allow clipboard access for claude.ai — allow it.

## How It Works

1. **Finds the Copy button**: Queries `button[aria-label="Copy"]` and takes the last match on the page, which corresponds to the most recent assistant response.
2. **Derives the filename**: Reads `[data-testid="chat-title-split"]`, then runs the raw title through a sanitization pipeline: Unicode-normalizes it (`NFKC`), strips control/zero-width/variation-selector/private-use-area characters and pictographic/arrow glyphs (icon-font badges the UI can append to the title text otherwise survive into the filename as stray underscores), replaces filesystem-illegal characters (`\ / : * ? " < > |`) with `-`, collapses whitespace, trims trailing spaces/periods, and truncates to 120 characters.
3. **Triggers the app's copy action**: Calls `.click()` on the Copy button so Claude's own UI code produces the markdown, rather than re-deriving it from the DOM.
4. **Reads the clipboard with retry**: Calls `navigator.clipboard.readText()` after a short delay; if it comes back empty, retries up to 4 times at 200ms intervals (the site's copy write is async and may not have landed yet). Bails out with a clipboard-permission hint if the read is rejected.
5. **Writes the file**: Once non-empty text comes back, wraps it in a `Blob`, creates an object URL, and triggers a download via a temporary anchor element with a `download` attribute. Success is logged to the console only — no alert.

## Technical Notes

- Depends on Claude.ai's current DOM structure — specifically the `aria-label="Copy"` button and the `data-testid="chat-title-split"` title element. If Claude.ai changes these, the bookmarklet will need updating.
- Uses `navigator.clipboard.readText()`, which requires a secure context and clipboard-read permission for the site. Chrome/Edge typically prompt once and remember the grant; Firefox and Safari restrict programmatic clipboard reads more aggressively and may not work reliably.
- Overwrites whatever was previously on the clipboard, since it reads back what the Copy button just wrote there.
- Runs entirely client-side; no data leaves the browser.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
