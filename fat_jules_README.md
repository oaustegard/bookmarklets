# Fat Jules

A bookmarklet to widen the chat input area on jules.google.com.

## Purpose

This bookmarklet addresses the issue of the default chat width on jules.google.com being too narrow, which can cause excessive vertical scrolling when working with large blocks of text.

When activated, this bookmarklet:

-   Increases the maximum width of the chat container.

## Installation

### Easy Install
1.  Visit the [Fat Jules Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=fat_jules.js)
2.  Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1.  Create a new bookmark in your browser.
2.  Set the name to "Fat Jules" or similar.
3.  Set the URL to the JavaScript code found in [`fat_jules.js`](https://github.com/oaustegard/bookmarklets/blob/main/fat_jules.js).

## Usage

1.  Navigate to `jules.google.com`.
2.  Click the "Fat Jules" bookmarklet in your bookmarks bar.
3.  The chat interface will widen.

## How It Works

The bookmarklet checks if the current page is `jules.google.com`. If it is, the script injects a new `<style>` element into the document's `<head>`. This style overrides the `max-width` property of the chat container, making it wider.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/fat_jules.js)

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
