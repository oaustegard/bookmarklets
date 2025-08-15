# Find and Replace Text on Page

Prompts the user for text to find and text to replace it with, then performs a case-insensitive search and replace on all text content of the current page.

## Purpose

This bookmarklet allows for quick, client-side modification of text content on any webpage. It's useful for:

-   Correcting common typos or substituting terms for readability or analysis.
-   Temporarily altering text for screenshots or demonstrations.
-   Seeing how a page looks with different terminology.
-   A simple way to play with webpage content (changes are client-side only).

## Features

-   **User Prompts**: Uses `prompt()` to ask for the search term and the replacement term.
-   **Recursive DOM Traversal**: Searches through all text nodes within the `document.body`.
-   **Case-Insensitive Global Replace**: Uses a regular expression with `gi` flags to replace all occurrences, ignoring case.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=find_and_replace.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [find_and_replace.js file](https://github.com/oaustegard/bookmarklets/blob/main/find_and_replace.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Find/Replace Text").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage.
2.  Click the "Find/Replace Text" bookmarklet.
3.  A prompt will appear asking "Find:". Enter the text you want to search for.
4.  Another prompt will appear asking "Replace with:". Enter the text you want to use as a replacement.
5.  The bookmarklet will then iterate through the page content and replace all occurrences of the "find" text with the "replace" text.

## How It Works

1.  **`replaceTextInHtml(find, replace, element)` Function**:
    *   This is a recursive function. If `element` is not provided, it defaults to `document.body`.
    *   Creates a `RegExp` object from the `find` string with `gi` flags (global, case-insensitive).
    *   Iterates through `element.childNodes`:
        *   If a child node is a text node (`Node.TEXT_NODE`), it replaces its `textContent` using `node.textContent.replace(regex, replace)`.
        *   If a child node is an element node, it calls `replaceTextInHtml` recursively with that child element.
2.  **User Input**:
    *   Prompts the user for `textToFind` using `prompt("Find:")`.
    *   Prompts the user for `textToReplace` using `prompt("Replace with:")`.
3.  **Execution**:
    *   Calls `replaceTextInHtml(textToFind, textToReplace)` to start the process from `document.body`.

## Technical Notes

-   Changes are client-side and temporary; reloading the page will restore the original text.
-   The replacement affects only text nodes. It won't change text in attributes (like `alt` text for images or `title` attributes) unless those attributes are directly rendered as text nodes by the browser in some unusual way.
-   Special characters in the `find` string might be interpreted as regular expression metacharacters. For a literal search, these would need to be escaped (though the current script doesn't do this).
-   If the user cancels either prompt (or enters nothing for "Find:"), the behavior might be unexpected (e.g., replacing empty strings or errors if "Find:" is empty).

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/find_and_replace.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
