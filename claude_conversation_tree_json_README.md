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
- **Automatic ID Extraction**: Retrieves the necessary organization ID from `localStorage` and conversation ID from the current URL.
- **Full Tree Export**: Fetches the complete conversation tree, including all messages and tool usage, by setting appropriate URL parameters (`tree=True`, `rendering_mode=messages`, `render_all_tools=True`).
- **New Tab Output**: Opens the JSON data in a new browser tab for easy viewing or saving.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_conversation_tree_json.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [claude_conversation_tree_json.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Claude JSON Tree").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to an active Claude.ai conversation page (e.g., `https://claude.ai/chat/YOUR_CONVERSATION_ID`).
2.  Click the "Claude JSON Tree" bookmarklet in your bookmarks bar.
3.  A new tab will open displaying the JSON data of the conversation. You can then save this data (e.g., right-click -> Save As, or copy-paste).

## How It Works

The bookmarklet performs the following steps:

1.  **Checks Hostname**: (Implicitly, as it relies on Claude's `localStorage` and URL structure).
2.  **Retrieves Organization ID**: Reads `localStorage.getItem('lastActiveOrg')` to get the user's active organization ID.
3.  **Retrieves Conversation ID**: Parses `window.location.pathname` to extract the current conversation's unique ID.
4.  **Constructs API URL**: Builds a URL targeting Claude's internal API:
    `https://api.claude.ai/api/organizations/{orgId}/chat_conversations/{conversationId}?tree=True&rendering_mode=messages&render_all_tools=True`
    The parameters ensure the full message tree and tool details are included.
5.  **Opens URL**: Calls `window.open(apiUrl, '_blank')` to open the constructed URL in a new tab, which then displays the JSON response.

## Technical Details

-   Relies on the structure of Claude.ai's URLs and its use of `localStorage` for the organization ID. Changes to these by Anthropic could break the bookmarklet.
-   Directly accesses an API endpoint that may be internal and subject to change without notice.
-   The API provides a rich JSON object containing messages, roles, timestamps, and potentially other metadata related to the conversation.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json.js).
