# X.com Conversation Extractor

## Purpose
This bookmarklet automatically scrolls through an entire X.com (formerly Twitter) conversation thread, extracts all the tweets along with their engagement stats, and displays them in a new browser tab.

## Features
- **Automatic Scrolling**: Programmatically scrolls down the page to load all replies in a thread.
- **Data Extraction**: Captures the text of each tweet and its popularity data (replies, retweets, likes).
- **Deduplication**: Ensures that each tweet is only listed once, even if it's rendered multiple times during scrolling.
- **Clean Output**: Displays the full, extracted conversation in a new, easy-to-read browser tab.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=x_conversation_extractor.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "X Conversation Extractor".
3. Copy the code from `x_conversation_extractor.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a tweet page on X.com.
2. Click the "X Conversation Extractor" bookmarklet.
3. The page will begin to scroll down automatically. This may take some time for very long conversations.
4. Once the bottom of the page is reached, a new browser tab will open, displaying the full text of the conversation.

## How It Works
The bookmarklet works by repeatedly:
1. Scanning the current view for all tweet elements (`<article>`).
2. Extracting the tweet text and the accessibility label containing the engagement stats.
3. Storing this information in a `Set` to avoid duplicates.
4. Scrolling the window down to load more tweets.

This process continues in a loop until it detects it has reached the end of the scrollable content. Finally, it opens a new window and writes the collected data into it.

## Technical Notes
- This bookmarklet is highly dependent on the specific HTML structure and `data-testid` attributes used by X.com. If the site's code changes, this tool may break.
- The script uses a 200ms delay between scrolls to allow new content to load. On very slow connections, it might finish before all tweets have been loaded.

## License
MIT

## Author
[Your Name/Alias Here]
