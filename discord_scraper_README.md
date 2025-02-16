# Discord Message Scraper Bookmarklet

A JavaScript bookmarklet that extracts and organizes Discord forum messages into downloadable threaded conversations.

## Features

- Captures the latest 50 messages on initial load
- Automatically captures new messages while scrolling
- Groups messages into conversation threads
- Preserves message timestamps and author information
- Provides real-time message counter
- Supports both downloading and copying to clipboard

## Installation

Two options:

1. Direct install: Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=discord_scraper.js)
2. Manual install:
   - View the [source code](https://github.com/oaustegard/bookmarklets/blob/main/discord_scraper.js)
   - Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
   - Paste the code and follow the instructions

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

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE) file for details.
