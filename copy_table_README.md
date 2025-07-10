# Table to JSON Bookmarklet

A simple bookmarklet inspired by [Simon Willison's simple script](https://github.com/simonw/nicar-2025-scraping/blob/main/README.md) that converts HTML tables on any webpage to JSON copied to the clipboard, augmented with visual table selection. Vibe coded from the original with Claude 3.7 Sonnet (also the author of this README)

## Purpose

This bookmarklet solves the common challenge of extracting data from HTML tables on websites. When activated, it:

- Identifies all tables on the current webpage
- Provides a visual selection interface for pages with multiple tables
- Converts the selected table to a JSON array of objects
- Automatically copies the JSON data to your clipboard
- Uses table headers (or first row) as property names for the resulting objects

## Features

- **Table Detection**: Automatically finds all `<table>` elements on the current page.
- **Visual Table Selection**: If multiple tables are present, it highlights tables on hover and allows the user to click to select the desired one. A "Cancel" button is provided to exit selection mode.
- **JSON Conversion**: Converts the rows and cells of the selected HTML table into a JSON array of objects.
- **Header Detection**: Uses `<th>` elements in the `<thead>` as keys for the JSON objects. If no `<thead>` or `<th>` are found, it defaults to using the content of the first `<tr>` as keys.
- **Clipboard Integration**: Copies the generated JSON string to the clipboard.
- **User Feedback**: Provides alerts for success or if no tables are found.

## Installation

### Easy Install
1. Visit the [Table to JSON Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=copy_table.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Table to JSON" or similar.
3. Set the URL to the JavaScript code found in [`copy_table.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_table.js).

## Usage

1. Navigate to any webpage containing HTML tables
2. Click the bookmarklet in your bookmarks bar
3. For pages with multiple tables:
   - Tables will highlight when hovered over
   - Click the desired table to select it
   - A cancel button appears in the top-right if you want to exit
4. The JSON data is automatically copied to your clipboard
5. Paste the JSON into your desired application

## How It Works

The bookmarklet:
1. Locates all table elements on the current page
2. For multiple tables, enables visual selection with hover highlighting
3. Extracts the header row (th or td elements) for property names
4. Processes subsequent rows into JSON objects
5. Copies the formatted JSON to clipboard

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_table.js)

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com) with Claude 3.7 Sonnet, inspired by Simon Willison.
