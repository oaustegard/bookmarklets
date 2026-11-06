# Export Claude Transcript

Downloads the conversation on the current claude.ai page as a JSON file. It handles regular chats, shared chat snapshots, and Claude Code / Cowork sessions.

## Purpose

The claude.ai web app loads every conversation from a JSON API, and that API returns more than the page shows: tool inputs and outputs, thinking blocks, the branch tree of edited messages, session cost. This bookmarklet calls the same endpoints with your logged-in cookies and saves the result, after stripping UI state and empty fields.

Use it to archive a chat, feed a transcript to another model, compare two runs of a task, or read tool calls the UI collapses. For Claude Code sessions, the compact and outline modes produce a transcript small enough to paste into a new conversation.

## Features

- **Three page types from one bookmarklet**: chats (`/chat/<id>`) come from `chat_conversations` with `tree=True`, so edited-message branches are included. Shared links (`/share/<id>`) come from `chat_snapshots`. Claude Code and Cowork sessions (`/code/…`, `/cowork/…`, or an ID starting with `session_` or `cse_`) come from the `/v1/code/sessions` events API.
- **Tries every organization**: the chat endpoints are scoped to an organization, so the bookmarklet reads your memberships from `/api/bootstrap` and tries each one until a request succeeds.
- **Pruned chat JSON**: drops UI flags (`is_starred`, `settings`, `platform` and the like), per-message `index` and `updated_at`, per-block timestamps, `display_content` and integration icons. Fields such as `attachments`, `files`, `citations` and `thinking` are removed only when they are empty.
- **Session events rebuilt into messages**: events are deduplicated by `event_id` and sorted by `sequence_num`. Streamed assistant chunks that share a message ID merge into one entry. Synthetic user turns and injected `<system-reminder>` prompts are dropped. Tool results are kept as their own `tool_result` entries, and the last `total_cost_usd` and model are recorded in the session header.
- **Three detail levels for sessions**:
  - `full` keeps every block, with tool inputs and results intact.
  - `compact` (the default) merges consecutive assistant messages into one turn of plain-text lines. Each tool call becomes a one-line summary (`▸ Bash ls -la`) followed by up to 300 characters of its result, and errors are marked `[error]`.
  - `outline` keeps the same tool-call lines with inputs capped at 160 characters and drops the results.
- **Readable tool summaries**: `mcp__server__` prefixes are stripped. Bash commands and JavaScript have their whitespace collapsed, browser `computer` actions show their action or typed text, and `browser_batch` lists each action it contains. Other tools show their input as JSON without `tabId` and `description`. Results that only acknowledge an action ("Clicked at…", "Navigated to…", "Message delivered") are omitted.
- **Follows pagination**: reads up to 200 pages of 100 events. It recognizes `next_cursor`, `next_page`, and `has_more` with `last_id`. If the API reports more events but gives no cursor it recognizes, an alert says the export is partial.
- **Readable filenames**: `<title-slug>-<first 12 chars of ID>.json`, with the title cut to 60 characters. The fallback names are `claude-chat` and `cowork-session`.

## Installation

### Easy Install
1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_export_transcript.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Export Claude Transcript".
3. Set the URL to the JavaScript code found in [`claude_export_transcript.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_export_transcript.js).
4. Save the bookmark.

## Usage

1. Open a chat, a shared chat, or a Claude Code / Cowork session on claude.ai.
2. Click the bookmarklet.
3. For a session, a prompt asks for the detail level. Type `full`, `compact`, or `outline` and press OK. Pressing Cancel or entering an empty value gives `compact`, and any other value gives `full`.
4. The JSON file downloads. The browser console logs each request's status, the page count and the file size, all prefixed `Chat Export:`.

An alert reports a failure: the page is not on claude.ai, the URL has no ID, no organization was found, or a fetch returned an error. The console holds the HTTP status and the first 500 characters of the response body.

## How It Works

1. **Routing**: takes the last path segment as the ID. Session URLs and IDs go to the session exporter, and everything else goes to the chat exporter, with `/share/` selecting the snapshot endpoint.
2. **Fetching**: every request goes out with `credentials: 'include'` and the headers the web app sends (`anthropic-client-platform: web_claude_ai`, `anthropic-version: 2023-06-01`), so it runs as you.
3. **Chats**: fetches `/api/bootstrap`, collects organization UUIDs, requests the conversation from each organization in turn, then prunes the conversation, each message and each content block in place.
4. **Sessions**: fetches the session record (unwrapping `response_shape` when present), pages through `/events`, and builds `{ session, messages }` from the `user`, `assistant` and `result` events. For `compact` and `outline`, it indexes tool results by `tool_use_id` and rewrites each message into text lines, setting `session.detail` to the level used.
5. **Download**: serializes with two-space indentation, wraps the result in a `Blob`, clicks a temporary anchor with a `download` attribute, and revokes the object URL after five seconds.

## Technical Notes

- The endpoints, the event payload shapes and the request headers are internals of the claude.ai web app, not a public API. When they change, this bookmarklet needs updating.
- `full` session exports include complete tool outputs, so a session that reads many files can produce a file several megabytes in size.
- Thinking blocks are kept in all three detail levels. In `compact` and `outline` they appear as `[thinking] …` lines.
- Everything runs in the page. The only requests go to claude.ai, and nothing is sent anywhere else.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
