# Claude Save Response

Saves Claude's most recent response as a `.md` file, named after the chat title.

## Purpose

Claude.ai has no built-in "export this response" action — the only path is the Copy button, followed by pasting into a text editor and saving by hand. This bookmarklet collapses that into one click: it triggers the page's own Copy button, intercepts the markdown it produces, and downloads it as a file named after the current chat.

## Features

- **One-click export**: Click the bookmarklet on any Claude.ai chat to download the last response.
- **Chat-title filename**: Reads the chat title from the page and sanitizes it into a safe filename (illegal characters stripped, truncated to 120 characters); falls back to `claude-response.md` if no title is found.
- **No clipboard round-trip**: Rather than reading back from the OS clipboard (unreliable without an explicit paste gesture), it intercepts `navigator.clipboard.writeText` and the `copy` event directly, so the captured content is exactly what the Copy button produced.
- **Console logging**: Logs each step (target filename, captured length, completion) to the console for troubleshooting.
- **User feedback**: Alerts on success (with filename and character count) or on failure (missing Copy button, no content captured).

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
3. The browser downloads a `.md` file named after the chat title (e.g. `My Chat Title.md`), containing the last response's markdown.
4. An alert confirms the filename and character count once the download starts.

## How It Works

1. **Finds the Copy button**: Queries `button[aria-label="Copy"]` and takes the last match on the page, which corresponds to the most recent assistant response.
2. **Derives the filename**: Reads `[data-testid="chat-title-split"]`, strips filesystem-illegal characters (`\ / : * ? " < > |`), collapses whitespace, trims trailing spaces/periods, and truncates to 120 characters.
3. **Intercepts the copy**: Temporarily wraps `navigator.clipboard.writeText` so any call captures its argument instead of touching the OS clipboard, and adds a `copy` event listener as a fallback for `document.execCommand`-based copying. Both are restored afterward.
4. **Triggers the app's copy action**: Calls `.click()` on the Copy button so Claude's own UI code produces the markdown, rather than re-deriving it from the DOM.
5. **Writes the file**: After a short delay (600ms) for the copy handler to run, wraps the captured text in a `Blob`, creates an object URL, and triggers a download via a temporary anchor element with a `download` attribute.

## Technical Notes

- Depends on Claude.ai's current DOM structure — specifically the `aria-label="Copy"` button and the `data-testid="chat-title-split"` title element. If Claude.ai changes these, the bookmarklet will need updating.
- The 600ms delay between clicking Copy and reading the captured value is a fixed wait, not an event-driven signal; on a slow page it's possible (though unobserved) for the capture to fire before the app's copy handler completes.
- Runs entirely client-side; no data leaves the browser.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
