# _copyToClip - Clipboard Utility

A utility function to copy provided HTML (and optionally plain text) to the clipboard. This bookmarklet is designed to be included or used by other bookmarklets that require clipboard functionality.

## Purpose

`_copyToClip` provides a reusable and robust way to copy content to the user's clipboard. It handles both HTML and plain text, allowing for rich text copying where supported, with a fallback to plain text.

## Features

- Copies HTML content to the clipboard.
- Optionally copies a plain text version of the content.
- Provides user feedback via an alert on success or failure.
- Designed as a helper function for other bookmarklets.

## Installation

As this is a utility function intended to be used by other bookmarklets, direct installation as a standalone bookmarklet is not its primary purpose. However, if you wish to make it available globally for testing or development:

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "_copyToClip" or "Clipboard Utility".
3. Set the URL to the JavaScript code found in [`_copyToClip.js`](https://github.com/oaustegard/bookmarklets/blob/main/_copyToClip.js).

## Usage

This function is primarily meant to be called from other JavaScript code.

**Function Signature:**

`_copyToClip(html, text, msg = "Copied to clipboard!")`

- `html` (String): The HTML content to copy.
- `text` (String): The plain text content to copy. If not provided, the function will attempt to use the `html` content as plain text.
- `msg` (String, optional): A message to display to the user upon successful copying. Defaults to "Copied to clipboard!".

**Example (within another bookmarklet):**

```javascript
// Assuming _copyToClip.js has been loaded or its code is included
const myHtmlContent = "<h1>Hello</h1><p>World</p>";
const myTextContent = "Hello World";
_copyToClip(myHtmlContent, myTextContent, "Custom message: Content copied!");
```

If you install it as a standalone bookmarklet, clicking it will likely do nothing or cause an error, as it expects arguments to be passed to it.

## How it Works

1.  It creates a `ClipboardItem` with both `text/html` and `text/plain` representations if both are provided.
2.  It uses the `navigator.clipboard.write()` API to copy the content.
3.  If `html` is provided but `text` is not, it uses the `html` content for the `text/plain` type. This might not always be ideal, so providing a separate `text` version is recommended for complex HTML.
4.  It displays an alert to the user indicating the outcome of the operation.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
