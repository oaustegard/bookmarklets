# Discord Message Scraper Bookmarklet

A JavaScript bookmarklet that extracts and organizes Discord forum messages into downloadable threaded conversations.

## Features

- Captures the latest 50 messages on initial load
- Automatically captures new messages while scrolling
- Groups messages into conversation threads
- Preserves message timestamps and author information
- Provides real-time message counter
- Supports both downloading and copying to clipboard

## Purpose

This bookmarklet is designed to extract messages from Discord forum threads, including their replies, and organize them into a structured JSON format. This allows users to archive, analyze, or process Discord conversations outside of the Discord application. It's particularly useful for capturing the content of forum-style channels.

## Installation

### Easy Install
1. Visit the [Discord Message Scraper Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=discord_scraper.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. View the [source code](https://github.com/oaustegard/bookmarklets/blob/main/discord_scraper.js).
2. Copy the entire JavaScript code.
3. Visit the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
4. Paste the code into the installer's code area.
5. Name the bookmarklet (e.g., "Discord Scraper").
6. Drag the generated link from the installer to your bookmarks bar.

## Usage

1. Navigate to any Discord forum thread
2. Click the bookmarklet in your bookmarks bar
3. Scroll up to capture more messages
4. Use the floating control panel to:
   - View message count
   - Download JSON file
   - Copy data to clipboard
   - Close the scraper

## Output Format

The downloaded/copied data is a JSON array of threaded conversations:

```json
[
  {
    "root": {
      "author": "username",
      "content": "message text",
      "timestamp": "ISO-8601 timestamp"
    },
    "replies": [
      {
        "author": "username",
        "content": "reply text",
        "timestamp": "ISO-8601 timestamp"
      }
    ]
  }
]
```

## Technical Details

- Uses mutation observers and XHR/fetch interceptors to capture messages
- Maintains chronological order of messages
- Reconstructs conversation threads based on reply relationships
- Handles both API responses and DOM-extracted messages

## How It Works

The bookmarklet injects a script into the Discord page. This script:
- Creates a floating control panel with buttons for download, copy, and close, and a message counter.
- Intercepts network requests (XHR/fetch) related to messages to capture data directly from Discord's API responses.
- Uses a MutationObserver to detect new messages added to the DOM (e.g., through scrolling or live updates).
- Parses message elements to extract author, content, and timestamp.
- Identifies message relationships (e.g., replies to a root post in a thread) to group them.
- Stores the captured messages in a structured format, distinguishing between root messages and their replies.
- The "Download" button creates a JSON file of the captured threads.
- The "Copy" button places the JSON data onto the clipboard.

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE) file for details.

## Author

Created by [Oskar Austegard](https://austegard.com)
