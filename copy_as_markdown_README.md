# Copy as Markdown

Converts the currently selected HTML content on a page to Markdown and copies it to the clipboard. Also displays the Markdown in a new window.

## Purpose

This bookmarklet allows users to quickly grab a portion of a webpage and get its Markdown equivalent. This is useful for:

-   Quoting web content in Markdown-based systems (like forums, issue trackers, or note-taking apps).
-   Archiving or transforming web content into a more portable format.
-   Quickly converting rich text selections to plain text with Markdown structure.

## Features

-   **HTML to Markdown Conversion**: Uses the Turndown library (included inline) to convert selected HTML to Markdown.
-   **Selection-Based**: Operates on the user's current text/HTML selection on the page.
-   **Clipboard Integration**: Copies the generated Markdown to the clipboard as plain text.
-   **Preview Window**: Opens a new browser window/tab displaying the raw Markdown generated, wrapped in `<pre>` tags for easy viewing.
-   **Utility Functions**: Includes inline versions of `_lg` (for console logging) and `copyToClip`.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=copy_as_markdown.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [copy_as_markdown.js file](https://github.com/oaustegard/bookmarklets/blob/main/copy_as_markdown.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Copy as MD").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Select some content on any webpage.
2.  Click the "Copy as MD" bookmarklet in your bookmarks bar.
3.  The Markdown version of your selection is now in your clipboard.
4.  A new window will also open showing the generated Markdown. You can close this window.
5.  If no content is selected, the bookmarklet will do nothing (or log 'No selection found' to the console).

## How It Works

1.  **Injects Utilities**: The bookmarklet code includes definitions for `_lg` (console alias), the TurndownService, `getSelectionHtml`, and `copyToClip`.
2.  **Initializes Turndown**: Creates an instance of `TurndownService()`.
3.  **Gets Selected HTML**:
    *   The `getSelectionHtml()` function retrieves the HTML content of the current selection. It does this by creating a temporary `div`, appending cloned contents of all selection ranges to it, and then taking its `innerHTML`.
4.  **Converts to Markdown**:
    *   If HTML content was selected, it calls `td.turndown(selectedHtml)` to convert it to Markdown.
5.  **Copies to Clipboard**:
    *   Calls `copyToClip(document, '', md)` to copy the Markdown (`md`) as plain text. The HTML part of the clipboard is set to an empty string.
6.  **Displays in New Window**:
    *   Opens a new blank window (`window.open("", "_blank")`).
    *   Writes the Markdown into this new window, wrapped in `<pre>` tags.
7.  **Logging**: Uses `_lg` to log steps like 'Turndown loaded', 'Selection found', etc., to the console.

## Technical Details

-   The entire Turndown library (version used at the time of bookmarklet creation) is embedded within the bookmarklet code. This makes the bookmarklet self-contained but also quite large.
-   `copyToClip` function handles setting both `text/html` and `text/plain` clipboard data. For this bookmarklet, `text/html` is intentionally set to empty to prioritize the plain text Markdown.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_as_markdown.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
