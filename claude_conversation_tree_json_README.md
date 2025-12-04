# Claude Conversation Tree JSON Exporter

A bookmarklet to export the current Claude.ai conversation tree as a JSON object by opening a direct API link.

## Purpose

This bookmarklet allows users to easily access the raw JSON data of their current Claude.ai chat conversation. This can be useful for:

- Archiving conversations.
- Programmatic analysis of chat content.
- Debugging or understanding the structure of Claude's responses.
- Migrating or transforming conversation data for other uses.

## Features

- **Direct API Access**: Constructs and opens the specific API endpoint URL that returns the conversation tree.
- **Automatic ID Extraction**: Retrieves the necessary organization ID from page scripts and conversation ID from the current URL.
- **Shared Conversation Support**: Automatically detects shared conversations and uses the appropriate API endpoint.
- **Full Tree Export**: Fetches the complete conversation tree, including all messages and tool usage, by setting appropriate URL parameters (`tree=True`, `rendering_mode=messages`, `render_all_tools=True`).
- **Error Handling**: Displays an alert if the organization ID cannot be found.
- **New Tab Output**: Opens the JSON data in a new browser tab for easy viewing or saving.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_conversation_tree_json.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [claude_conversation_tree_json.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Claude JSON Tree").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to an active Claude.ai conversation page (e.g., `https://claude.ai/chat/YOUR_CONVERSATION_ID`) or a shared conversation (e.g., `https://claude.ai/share/YOUR_SHARE_ID`).
2.  Click the "Claude JSON Tree" bookmarklet in your bookmarks bar.
3.  A new tab will open displaying the JSON data of the conversation. You can then save this data (e.g., right-click -> Save As, or copy-paste).

## How It Works

The bookmarklet performs the following steps:

1.  **Retrieves Organization ID**: Searches inline script tags for the `lastActiveOrg` preference in escaped JSON format to get the user's active organization ID. If not found, displays an error alert.
2.  **Detects Conversation Type**: Checks if the URL path contains `/share/` to determine if this is a shared conversation or a regular chat.
3.  **Retrieves Conversation/Share ID**: Parses `window.location.pathname` to extract the last segment (conversation ID or share ID).
4.  **Constructs API URL**: Builds a URL targeting Claude's internal API:
    - For shared conversations: `https://claude.ai/api/organizations/{orgId}/chat_snapshots/{shareId}?rendering_mode=messages&render_all_tools=true`
    - For regular conversations: `https://claude.ai/api/organizations/{orgId}/chat_conversations/{conversationId}?tree=True&rendering_mode=messages&render_all_tools=True`

    The parameters ensure the full message tree and tool details are included.
5.  **Opens URL**: Calls `window.open(apiUrl, '_blank')` to open the constructed URL in a new tab, which then displays the JSON response.

## Technical Details

-   Uses a sophisticated organization ID detection method that searches for `lastActiveOrg` in inline script tags with escaped JSON.
-   Supports both regular conversations (`/chat/`) and shared conversations (`/share/`).
-   Uses different API endpoints depending on conversation type:
    - `chat_conversations` for regular chats (includes full tree)
    - `chat_snapshots` for shared conversations
-   Relies on the structure of Claude.ai's URLs and page scripts. Changes to these by Anthropic could break the bookmarklet.
-   Directly accesses an API endpoint that may be internal and subject to change without notice.
-   The API provides a rich JSON object containing messages, roles, timestamps, and potentially other metadata related to the conversation.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
