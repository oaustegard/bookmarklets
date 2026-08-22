# Claude Code Transcript Exporter

Exports a complete Claude Code (web) session transcript as Markdown or JSON.

## Purpose

Claude Code session pages render the transcript in a virtualized list — only the entries near the viewport exist in the DOM, so scraping the page gives you a slice of the conversation rather than the whole thing, and "select all, copy" loses everything that scrolled out. This bookmarklet reads the entry array straight off the React fiber backing the transcript component, which holds every entry regardless of what is on screen, and hands it back as Markdown or raw JSON.

Useful for archiving a session, feeding a transcript to another model, diffing two runs of the same task, or reviewing tool inputs and outputs that the UI collapses.

## Features

- **Nothing lost to windowing**: Reads `entries` (or `baseEntries`) from the component's `memoizedProps`, walking up to 80 fiber parents from each `[data-testid="epitaxy-virtual-transcript"]` host, so the export covers the full session rather than the rendered window.
- **One session per export**: Claude Code can keep more than one transcript mounted at a time: a session you navigated away from stays in the React tree. Each mounted transcript is matched against the session ID in the URL, and only the matching one is exported. Earlier versions concatenated every array they found, so an export could carry a session you had merely visited earlier alongside the one you asked for.
- **Says when it is unsure**: When no mounted transcript reports a session ID, the bookmarklet picks the largest visible one and writes a warning into the panel, the Markdown header, and the JSON `warnings` field. An **Include all** button switches the export back to every transcript on the page.
- **Flags mixed timelines**: Timestamps that jump backwards mean entries from two sessions ended up in one list, so the export carries a warning naming how many jumps it found.
- **Three outputs**: Copy Markdown to the clipboard, download Markdown, or download the raw JSON entry array.
- **Tool calls rendered in full**: Each tool gets a heading with its status (`done`, `ERROR`, or the reported `status`), its input as fenced JSON, and its output — falling back through `output`, `toolUseResult`, and `rawResultContent` — with policy-denied calls marked.
- **Thinking blocks, task events, and errors preserved**: Extended thinking is fenced under a blockquote label; sub-agent task events render as a line with type, status, and duration in seconds; turn errors dump their error array as JSON.
- **Unknown entry kinds dumped, not dropped**: Any item type the renderer does not recognize is written out verbatim as JSON under its kind name, so a UI change degrades the export instead of silently truncating it.
- **Safe serialization**: A `WeakSet`-based replacer marks circular references as `[Circular]` and functions as `[Function]`, so React's cyclic prop graph does not throw on stringify.
- **Adaptive code fences**: Fence length is computed from the longest backtick run in the content, so output containing Markdown code blocks does not break the surrounding fence.
- **Clipboard fallback**: Uses `navigator.clipboard.writeText()` and falls back to a hidden textarea with `document.execCommand('copy')` when the async clipboard API is blocked; the panel says which happened.
- **Filenames carry the session ID**: Downloads are named `claude-code-<session_id>-<YYYY-MM-DD>.md` / `.json`, with the session ID parsed from the URL path; an unscoped export gets an `-all` suffix.

## Installation

### Easy Install
1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_code_transcript.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Claude Code Transcript".
3. Set the URL to the JavaScript code found in [`claude_code_transcript.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_code_transcript.js).
4. Save the bookmark.

## Usage

1. Open a Claude Code session page (`claude.ai/code/session_...`) and let it finish loading.
2. Click the "Claude Code Transcript" bookmarklet.
3. A panel appears in the top right showing the entry count, the Markdown size in KB, and the session being exported.
4. Click **Copy MD**, **Download MD**, or **Download JSON**. The status line under the buttons reports the result — the copied confirmation, or the filename written.
5. An amber line above the buttons reports anything the export is unsure about: other transcripts skipped, a session ID that does not match the URL, or backwards timestamps. When other transcripts were skipped, an **Include all** button exports every one of them instead; click it again to go back.
6. Click **×** to dismiss the panel. Re-running the bookmarklet replaces any panel already on the page.

If no transcript data is found, an alert says so; the usual cause is running it before the session has loaded, or on a page that is not a session page.

## How It Works

1. **Finds the transcript hosts**: Queries every `[data-testid="epitaxy-virtual-transcript"]` element on the page.
2. **Walks the fiber tree**: For each host, reads the `__reactFiber$...` key, then climbs `node.return` up to 80 levels looking for a `memoizedProps` carrying a non-empty `entries` or `baseEntries` array, and for the nearest prop holding a `session_...` ID. Arrays already seen are skipped by identity, so multiple hosts sharing one array do not duplicate entries.
3. **Picks the right transcript**: Keeps the candidates whose session ID equals the one in `location.pathname`. If none of them reports an ID, it sorts by visibility, then on-screen area, then fiber distance, and takes the first; the stale transcript a router leaves mounted is hidden or collapsed. Everything it did not pick is listed in the console and in the export's warnings, and remains reachable through **Include all**.
4. **Renders each entry**: Emits a numbered `##` heading with the author, the model when present, and an ISO timestamp; the `sourceUuid` goes in an HTML comment. Items dispatch by `kind` (or `type`) to per-kind renderers for text, thinking, tools, task events, errors, and turn errors, with the unknown-kind path dumping raw JSON.
5. **Assembles the document**: Prepends a header block with the session ID, page URL, export timestamp, entry count, and any warnings, then joins entries with `---` separators. The JSON build wraps the same metadata — plus `scope`, `urlSession`, `skippedTranscripts`, and `warnings` — around the untouched entry array.
6. **Delivers**: Downloads go through a `Blob`, an object URL, and a temporary anchor with a `download` attribute, revoking the URL after four seconds. Copying tries the async clipboard API first and the `execCommand` textarea second.

## Technical Notes

- Depends on Claude Code's internal structure — the `epitaxy-virtual-transcript` test ID, the React fiber property naming, and the `entries` prop shape. All three are implementation details of the app, not a public API, so this will need updating when they change.
- Session scoping depends on the app exposing a `session_...` ID in the props above the transcript. It does not always, which is why the visibility fallback and the warnings exist. Read the amber line before trusting an export.
- React fiber keys are only exposed in development-style builds and in production builds that have not stripped them; if `__reactFiber$` is absent the bookmarklet reports no transcript data.
- The Markdown output includes full tool inputs and outputs, which for file-reading or search-heavy sessions can run to megabytes. The panel shows the size before you commit to copying.
- Extended thinking blocks are included in the export.
- Runs entirely client-side; nothing is sent anywhere.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
