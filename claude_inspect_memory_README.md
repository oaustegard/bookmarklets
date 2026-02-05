# Claude.ai - Memory Viewer

This bookmarklet displays Claude's memory for the current context — either project-specific memory when viewing a project or chat within a project, or organization-level memory otherwise.

## Purpose

Claude.ai's memory system synthesizes information from past conversations to personalize responses. This bookmarklet provides a quick way to view what Claude "remembers" about you or your project, including both the synthesized memory and any pending user corrections that haven't yet been incorporated into the nightly synthesis.

## Features

- **Context-Aware:** Automatically detects whether you're in a project chat, on a project page, or elsewhere, and fetches the appropriate memory.
- **Clean Display:** Renders memory in a dark-themed modal with basic markdown support (bold text).
- **User Corrections:** Separately displays any explicit memory edits you've made that are pending synthesis.
- **Timestamp:** Shows when the memory was last updated.
- **Easy Dismiss:** Click the × button or anywhere outside the modal to close.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_memory_viewer.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Claude Memory Viewer" or similar.
3. Set the URL to the JavaScript code found in [`claude_memory_viewer.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_memory_viewer.js).

## Usage

1. Navigate to any page on `https://claude.ai` — a chat, a project, or the home page.
2. Click the "Claude Memory Viewer" bookmarklet.
3. A modal will appear displaying:
   - **Synthesized Memory:** Claude's consolidated understanding from past conversations.
   - **User Corrections:** Any explicit edits you've made (shown separately, pending nightly synthesis).
   - **Last Updated:** Timestamp of the most recent memory update.

## How it Works

1. **Organization ID Extraction:** Parses Next.js flight data (`self.__next_f`) to find the `lastActiveOrg` value.
2. **Context Detection:** Checks the URL to determine if you're in a chat or on a project page.
3. **Project Association:** If in a chat, fetches chat metadata from the API to retrieve the associated `project_uuid`.
4. **Memory Fetch:** Calls the appropriate memory endpoint:
   - Project memory: `/api/organizations/{org}/memory?project_uuid={project}`
   - Organization memory: `/api/organizations/{org}/memory`
5. **Rendering:** Displays the response in a styled modal overlay.

## Notes

- Memory is only available when logged into Claude.ai.
- Project memory is separate from organization memory — a project chat will show project-specific memory, not your overall organization memory.
- The "User Corrections" section only appears if you've made explicit memory edits that haven't been synthesized yet (synthesis occurs nightly).
- If no memory exists for the current context, the modal will indicate this.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
