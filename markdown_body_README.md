# Page Body to Markdown

Extracts the main content (or entire body) of the current webpage, cleans it, converts it to Markdown, copies it to the clipboard, and displays it in a new window.

## Purpose

This bookmarklet provides a way to get a Markdown representation of the significant content of a webpage. It's useful for:

-   Archiving or converting articles or blog posts to Markdown.
-   Getting a clean, text-based version of a page.
-   Using web content in Markdown-based workflows.

## Features

-   **Main Content Detection**: Attempts to identify the main content area of a page using selectors like `main`, `article`, etc. Defaults to `document.body` if specific main content isn't found.
-   **HTML Cleaning (`rmEls`)**: Removes common non-content elements (scripts, styles, SVGs, and elements with IDs/classes matching keywords like "footer", "nav", "sidebar", "advertisement", "header") from a clone of the content before conversion.
-   **HTML to Markdown**: Uses the embedded Turndown library to convert the cleaned HTML to Markdown.
-   **Clipboard Integration**: Copies the generated Markdown to the clipboard as plain text.
-   **Preview Window**: Opens a new browser window/tab displaying the raw Markdown generated, wrapped in `<pre>` tags.
-   **Logging**: Includes `_lg` for console logging of steps.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=markdown_body.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [markdown_body.js file](https://github.com/oaustegard/bookmarklets/blob/main/markdown_body.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Body to MD").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a webpage whose content you want to convert to Markdown.
2.  Click the "Body to MD" bookmarklet.
3.  The Markdown version of the page's main content (or whole body) is now in your clipboard.
4.  A new window will also open showing the generated Markdown.
5.  If no main content element is identified (should default to body), it will still proceed. Console logs provide more detail.

## How It Works

1.  **Injects Utilities**: Embeds `_lg` (console alias), TurndownService, and `copyToClip`.
2.  **`mainEl()` Function**: Tries to find the main content element using a list of selectors. Logs the found element.
3.  **`rmEls(root)` Function**:
    *   Takes a DOM element `root`.
    *   Queries all its descendants.
    *   Identifies elements to remove based on tag name (`SCRIPT`, `STYLE`, `SVG`), `innerHTML` starting with `data:image`, or if their `id` or `className` (lowercase) contains words from an `excludeWords` list.
    *   Removes these identified elements from `root`.
4.  **Main Logic**:
    *   Initializes Turndown: `var td = new TurndownService();`.
    *   Calls `mainEl()` to get the main DOM element.
    *   If an element is found (or defaults to body):
        *   Clones the element (`main.cloneNode(true)`).
        *   Calls `rmEls()` on the clone to clean it.
        *   Converts the `innerHTML` of the cleaned clone to Markdown using `td.turndown(clone.innerHTML)`.
        *   Logs the length of the generated Markdown.
        *   Calls `copyToClip(document, '', md)` to copy the Markdown to the clipboard (HTML part is empty).
        *   Opens a new window and writes the Markdown into it, wrapped in `<pre>` tags.
    *   Logs to console if `main` element was not found (though it should default to body).

## Technical Notes

-   Similar to `main_content_to_claude.js` and `copy_as_markdown.js` in its use of Turndown and content extraction/cleaning logic.
-   The cleaning process in `rmEls` is heuristic and might not be perfect for all websites. It checks for `typeof el.id === 'string'` and `typeof el.className === 'string'` before calling `.toLowerCase().includes()` to prevent errors on elements that might have non-string `id` or `className` properties (like SVGs).
-   Embedding Turndown makes the bookmarklet large but self-contained.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/markdown_body.js).
