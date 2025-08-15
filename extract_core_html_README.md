# Extract Core HTML Bookmarklet

## Overview

The [Extract Core HTML](extract_core_html.js) bookmarklet processes the current webpage, removes a predefined set of tags and attributes (including many common styling and scripting elements like `<img>`, `<style>`, `<script>`, and Tailwind CSS classes), and copies the cleaned HTML structure of the `<body>` to the clipboard.

## Purpose

This bookmarklet is designed to help users and developers quickly obtain a simplified or "core" version of a webpage's HTML content. This can be useful for:

-   **Content Analysis**: Focusing on the textual content and basic structure without visual clutter or scripts.
-   **Data Extraction**: Preparing HTML for further processing or data extraction by removing irrelevant parts.
-   **Debugging**: Isolating structural issues by removing potentially interfering styles and scripts.
-   **Creating Simplified Views**: Generating a barebones version of a page for specific needs.

## Features

-   **Tag Removal**: Removes a list of common tags that are often non-essential for core content (e.g., `img`, `style`, `script`, `svg`, `video`, `iframe`, `nav`, `aside`).
-   **Attribute Stripping**:
    -   Removes `style` and `script` attributes from all elements.
    -   Removes most Tailwind CSS class names using a comprehensive regex pattern.
    -   Removes `data-*` attributes, with exceptions for `data-id` and `data-class` to preserve essential identifiers.
-   **Comment Removal**: Strips HTML comments.
-   **Whitespace Normalization**: Reduces multiple consecutive line breaks to single line breaks.
-   **Clipboard Integration**: Copies the cleaned HTML of the document's body to the clipboard.

## Installation

### Easy Install
1. Visit the [Extract Core HTML Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=extract_core_html.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to something meaningful like "Extract Core HTML".
3. Copy the JavaScript code from [`extract_core_html.js`](https://github.com/oaustegard/bookmarklets/blob/main/extract_core_html.js) and paste it into the URL or location field of the bookmark.
4. Save the bookmark.

## Usage

1.  Navigate to the webpage from which you want to extract cleaned HTML.
2.  Click the "Extract Core HTML" bookmarklet in your bookmarks bar.
3.  The cleaned HTML content of the page's body will be copied to your clipboard.
4.  You can then paste this HTML into a text editor or any other application.
5.  Check the browser's developer console for any error messages if copying fails.

## How It Works

1.  **Clone Body**: Creates a deep clone of `document.body` to avoid modifying the live page.
2.  **Remove Specified Tags**: Iterates through a predefined list of tags (e.g., `img`, `style`, `script`) and removes all instances of these tags from the cloned body.
3.  **Process All Elements**: Gets a collection of all elements (`*`) within the cloned body.
4.  **Attribute Cleaning (Loop through elements)**:
    *   Removes `style` and `script` attributes.
    *   Removes Tailwind CSS classes: Splits `className`, filters out classes matching a Tailwind pattern, and reassembles the class string. If no classes remain, the `class` attribute is removed.
    *   Removes `data-*` attributes, except for `data-id` and `data-class`.
5.  **Generate HTML String**: Serializes the modified cloned body to an HTML string using `clonedBody.outerHTML`.
6.  **Final Cleanup**:
    *   Removes HTML comments (`<!-- ... -->`) using a regular expression.
    *   Normalizes multiple line breaks into single line breaks.
7.  **Copy to Clipboard**: Uses `navigator.clipboard.writeText()` to copy the final cleaned HTML string. Errors during copying are logged to the console.

## Bookmarklet Code
The source code is also available in the [`extract_core_html.js`](https://github.com/oaustegard/bookmarklets/blob/main/extract_core_html.js) file.
```javascript
javascript:(function() {
  function extractHTML() {
    let clonedBody = document.body.cloneNode(true);
    const tagsToRemove = ['img', 'style', 'script', 'svg', 'video', 'iframe', 'object', 'embed', 'link', 'nav', 'menu', 'aside'];
    tagsToRemove.forEach(tag => {
      const elements = clonedBody.getElementsByTagName(tag);
      while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    });
    const allElements = clonedBody.getElementsByTagName('*');
    const tailwindClassPattern = /\b(?:sm:|md:|lg:|xl:|2xl:)?(?:m|p|mt|mr|mb|ml|mx|my|pt|pr|pb|pl|px|py|w|h|min-w|min-h|max-w|max-h|flex|grid|col|row|items|justify|gap|space|bg|text|font|leading|tracking|rounded|border|shadow|overflow|z|opacity|transition|duration|ease|delay|animate|pointer-events|select|align|order|inset|top|right|bottom|left|visible|invisible|hidden|block|inline|inline-block|inline-flex|table|table-row|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|table-caption|sticky|relative|absolute|fixed|float|clear|object|overflow|scroll|scrollbar|snap|touch|resize|list|outline|decoration|appearance|cursor|pointer|caret|will-change|scale|rotate|translate|skew|origin|filter|backdrop-filter|mix-blend|bg-blend|isolation|content|sr-only|not-sr-only|aspect|space-y|space-x|space-reverse|divide-y|divide-x|divide-reverse|place-content|place-items|place-self|whitespace|break|hyphens|capitalize|lowercase|uppercase|first|last|even|odd|resize|grid-cols|grid-rows|col-span|row-span|auto-cols|auto-rows|gap|content|justify|grid-flow|col-start|col-end|row-start|row-end|sm|md|lg|xl|2xl|group|hover|focus|focus-within|focus-visible|active|visited|disabled|checked|required|aria|data|dark|motion|portrait|landscape|peer|empty|autoplay|controls|muted|loop|preload|data-([a-z]+))\b/g;

    for (let i = 0; i < allElements.length; i++) {
      allElements[i].removeAttribute('style');
      allElements[i].removeAttribute('script');
      
      if (allElements[i].className) {
        let classNames = allElements[i].className.split(' ').filter(className => !tailwindClassPattern.test(className));
        if (classNames.length > 0) {
          allElements[i].className = classNames.join(' ');
        } else {
          allElements[i].removeAttribute('class');
        }
      }

      Array.from(allElements[i].attributes).forEach(attr => {
        if (attr.name.startsWith('data-') && attr.name !== 'data-id' && attr.name !== 'data-class') {
          allElements[i].removeAttribute(attr.name);
        }
      });
    }

    let html = clonedBody.outerHTML;
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(/\n\s*\n/g, '\n');
    return html;
  }

  async function copyToClipboard(html) {
    try {
      await navigator.clipboard.writeText(html);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  const extractedHTML = extractHTML();
  copyToClipboard(extractedHTML);
})();
```

## License
This project is licensed under the MIT License.

## Author
Created by [Oskar Austegard](https://austegard.com)
