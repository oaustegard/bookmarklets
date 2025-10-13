# Claude Recent Conversation Summaries

A bookmarklet to fetch and display summaries for the most recent conversations listed on the claude.ai homepage.

## Purpose

This bookmarklet enhances the claude.ai user experience by injecting conversation summaries directly into the list of recent chats. Instead of clicking into each conversation to recall its content, users can see a brief, AI-generated summary at a glance.

## Features

- **Automatic Summary Injection**: Fetches conversation data via an internal API and displays the summary beneath each conversation title.
- **Efficient Batch Fetching**: Retrieves conversation data in batches to quickly cover all visible chats on the page.
- **Status Indicator**: Provides real-time feedback on the fetching and injection process through a temporary on-screen notification.
- **Smart Updates**: Checks if summaries are already displayed and only fetches data for conversations that need it.
- **Preserves Layout**: Adjusts container heights to ensure the injected summaries fit neatly without breaking the page layout.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_recent_summaries.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Manual Install**:
    *   Copy the entire JavaScript code from the [claude_recent_summaries.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_recent_summaries.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Claude Summaries").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to the claude.ai chat homepage (`https://claude.ai/chats`).
2.  Click the "Claude Summaries" bookmarklet in your bookmarks bar.
3.  A status indicator will appear at the bottom-right of the screen. Wait for it to complete.
4.  Summaries will appear under the title of each recent conversation.

## How It Works

1.  **Gets Organization ID**: The script retrieves the active organization ID from Claude's page data.
2.  **Identifies Visible Chats**: It scans the page for all visible chat links and extracts their unique conversation UUIDs.
3.  **Fetches Conversation Data**: The bookmarklet calls an internal Claude API endpoint (`/api/organizations/{orgId}/chat_conversations`) in batches to retrieve data for all visible chats. This data includes the AI-generated summary for each conversation.
4.  **Maps Data**: It creates a quick-lookup map of conversation UUIDs to their corresponding data.
5.  **Injects Summaries**: For each visible chat, it finds the corresponding data and injects the summary text into the chat card's HTML, adjusting styles to ensure it fits.

## Technical Details

-   The bookmarklet relies on Claude.ai's internal API structure and DOM layout, which could change at any time.
-   It uses a polite fetch interval to avoid overwhelming the Claude API.
-   A simple markdown-to-HTML converter handles basic formatting (bolding, line breaks) in the summaries.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_recent_summaries.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](httpshttps://austegard.com)
