# _turndown_min - HTML to Markdown Conversion Utility

This script provides a minified version of the Turndown library (v7.1.2). Turndown is a JavaScript library that converts HTML content into Markdown. This script is intended as a utility to be used by other bookmarklets that require HTML-to-Markdown conversion.

## Purpose

`_turndown_min.js` makes the Turndown library available for use in bookmarklets. By running this bookmarklet, a `TurndownService` object becomes available on the `window` global object, allowing other scripts or bookmarklets to convert HTML strings or DOM elements directly to Markdown.

## Original Library

- **Name:** Turndown
- **Version:** 7.1.2
- **Website:** [https://github.com/mixmark-io/turndown](https://github.com/mixmark-io/turndown)

## Installation

As this is a utility script providing a library, direct installation as a standalone, clickable bookmarklet is primarily for making the `TurndownService` available for other bookmarklets or for development/testing purposes.

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=_turndown_min.js)
2. Drag the created bookmarklet to your bookmarks bar. Clicking this bookmarklet will load the Turndown library onto the current page.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "_turndown_min" or "Load Turndown Library".
3. Set the URL to the JavaScript code found in [`_turndown_min.js`](https://github.com/oaustegard/bookmarklets/blob/main/_turndown_min.js).

## Usage

1.  **Load the library:** Click the "_turndown_min" bookmarklet on a webpage. This will execute the script and make `window.TurndownService` available.
2.  **Use in your own scripts/bookmarklets:**

    ```javascript
    // Ensure _turndown_min.js has been loaded first.
    if (typeof window.TurndownService === 'function') {
      const turndownService = new window.TurndownService();
      const htmlContent = "<h1>Hello World</h1><p>Convert me to Markdown.</p>";
      const markdown = turndownService.turndown(htmlContent);
      console.log(markdown);
      // Output:
      // # Hello World
      //
      // Convert me to Markdown.

      // You can also convert DOM elements:
      // const markdownFromElement = turndownService.turndown(document.getElementById('myElement'));
      // console.log(markdownFromElement);
    } else {
      alert("Turndown library not loaded. Please click the '_turndown_min' bookmarklet first.");
    }
    ```

## Benefits

-   **HTML to Markdown:** Enables easy conversion of HTML to Markdown within the browser.
-   **Dependency for other bookmarklets:** Provides a core functionality that other bookmarklets (e.g., "Copy as Markdown") can rely on.
-   **Minified:** The library is minified to reduce its size, making it more suitable for bookmarklet use.

## How it Works

The [`_turndown_min.js`](https://github.com/oaustegard/bookmarklets/blob/main/_turndown_min.js) file contains the complete, minified source code of the Turndown library (v7.1.2). When executed, it defines `TurndownService` in the global scope (`window`). An instance of `TurndownService` can then be created and its `turndown()` method used to perform conversions.

## License

The Turndown library is typically licensed under the MIT License. Please refer to the original library's license for full details.
This bookmarklet, as part of this repository, is also covered by the [MIT License](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE).

## Author

-   **Turndown Library:** Mixmark
-   **This Bookmarklet Wrapper:** [Oskar Austegard](https://austegard.com)
