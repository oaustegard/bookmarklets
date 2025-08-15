# Copy URL as Link with Preview

This bookmarklet opens a popup window allowing you to edit the current page's URL and title, see a live preview of the HTML link and the generated Markdown, and then copy both formats to your clipboard.

## Purpose

Provides a way to copy the current page's URL and title as a formatted link (HTML and Markdown) while allowing for edits and providing a visual preview of the output before copying. This helps ensure the link text and URL are correct.

## Features

-   **Popup UI**: Opens a new, small browser window for interaction.
-   **Editable Fields**: Pre-fills input fields for the page URL and title, allowing modification.
-   **Live Preview**:
    *   Shows a rendered HTML `<a>` tag that updates as you type in the URL or title fields.
    *   Displays the generated Markdown link `[title](url)` in a read-only textarea, also updating live.
-   **Dual Format Copy**: Copies both the HTML link and the Markdown link to the clipboard when "Copy & Close" is clicked.
-   **CSP Compliant**: Builds its UI programmatically using `createElement`, `setAttribute`, etc., to avoid issues with Content Security Policy.
-   **Styled Interface**: Uses inline CSS for a clean and functional popup design.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=copy_url_with_preview.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [copy_url_with_preview.js file](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_with_preview.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Copy URL w/ Preview").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage.
2.  Click the "Copy URL w/ Preview" bookmarklet.
3.  A popup window appears with:
    *   The current page's URL in an input field.
    *   The current page's title in another input field.
    *   A preview section showing the HTML link and the Markdown code.
4.  Edit the URL or title if needed. The preview will update automatically.
5.  Click the "Copy & Close" button. The links are copied to your clipboard, and the popup closes.

## How It Works

1.  **Opens Popup**: Creates a new blank window (`window.open`) with specific dimensions.
2.  **Builds UI Programmatically**:
    *   Uses a helper function `createElem` to construct DOM elements (labels, inputs, button, preview area).
    *   Injects CSS inline for styling the popup.
    *   Populates URL and title inputs with `window.location.toString()` and `window.document.title`.
3.  **Live Preview (`updatePreview`)**:
    *   Attached to `input` events on the URL and title fields.
    *   Updates the `innerHTML` of an HTML preview element (an `<a>` tag).
    *   Updates the `value` of a textarea for the Markdown preview.
4.  **Copies to Clipboard**:
    *   The "Copy & Close" button's click handler:
        *   Creates an `<a>` element in memory with the current URL and title.
        *   Generates the Markdown link string.
        *   Uses the `copyToClip` utility function to place both `e.outerHTML` (for `text/html`) and `mdlink` (for `text/plain`) onto the clipboard.
        *   Closes the popup window (`w.close()`).
5.  **Focus**: Sets focus on the "Copy & Close" button initially.

## Technical Details

-   The `copyToClip` function is embedded and handles the clipboard interaction.
-   The UI is self-contained within the popup, created entirely with JavaScript DOM manipulation and inline CSS, making it robust against most CSP issues.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_with_preview.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
