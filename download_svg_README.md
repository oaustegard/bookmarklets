# Download SVG Bookmarklet

This bookmarklet allows users to easily download SVG (Scalable Vector Graphics) elements from a webpage by selecting part of the SVG and clicking the bookmarklet.

## Purpose

SVG is a popular vector image format used on the web. However, downloading SVGs embedded in web pages isn't always straightforward. This bookmarklet aims to simplify this process, providing a one-click solution to find the nearest SVG element to the user's selection, convert it to a downloadable format, and trigger the download. It's particularly useful for developers and designers who frequently need to extract SVGs for documentation, presentations, or design work.

## Features

-   **Selection-Based**: Identifies the SVG to download based on the user's current text/element selection on the page.
-   **Nearest SVG Detection**: Traverses up the DOM tree from the selected element to find the closest parent SVG element.
-   **SVG Serialization**: Converts the live SVG DOM element into an XML string.
-   **File Download**: Creates a Blob from the SVG content and initiates a download with the filename `downloaded_svg.svg`.
-   **User Feedback**: Alerts the user if no SVG is found near the selection or if no selection is made.

## Installation

### Easy Install
1. Visit the [SVG Download Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=download_svg.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1.  Create a new bookmark in your browser.
2.  Set the name to "Download SVG" or similar.
3.  In the URL/Location field, paste the following JavaScript code:
    ```javascript
    javascript:(function() {
        /* Function to find the nearest SVG element */
        function findNearestSVG(element) {
            while (element && element.tagName.toLowerCase() !== 'svg') {
                element = element.parentElement;
            }
            return element;
        }

        /* Function to download the SVG */
        function downloadSVG(svgElement) {
            /* Get the SVG content */
            var svgContent = new XMLSerializer().serializeToString(svgElement);

            /* Create a Blob with the SVG content */
            var blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-f8' });

            /* Create a download link */
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded_svg.svg';

            /* Append the link to the body, click it, and remove it */
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /* Main execution */
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
            var selectedElement = selection.getRangeAt(0).commonAncestorContainer;
            if (selectedElement.nodeType === Node.TEXT_NODE) {
                selectedElement = selectedElement.parentElement;
            }

            var svgElement = findNearestSVG(selectedElement);

            if (svgElement) {
                downloadSVG(svgElement);
            } else {
                alert('No SVG found in or around the selected element.');
            }
        } else {
            alert('Please select part of an SVG before using this bookmarklet.');
        }
    })();
    ```
4.  Save the bookmark.

Alternatively, the raw code can be found in [`download_svg.js`](https://github.com/oaustegard/bookmarklets/blob/main/download_svg.js).

## Usage

1.  Navigate to a webpage containing an SVG element you wish to download.
2.  Select any part of the SVG element on the page (e.g., click and drag over a piece of the graphic).
3.  Click the "Download SVG" bookmarklet from your bookmarks bar.
4.  The browser will initiate a download for a file named `downloaded_svg.svg`.

### Example Use Case
This bookmarklet is useful on documentation sites like the [Microsoft GraphRAG Documentation](https://microsoft.github.io/graphrag/posts/index/1-default_dataflow/), which uses SVG diagrams. Developers can use this tool to download these diagrams for their own documentation or presentations.

## How It Works

1.  **Get Selection**: The bookmarklet first gets the current user selection (`window.getSelection()`).
2.  **Find Starting Element**: It determines the common ancestor container of the selection. If it's a text node, it uses its parent element.
3.  **Locate SVG (`findNearestSVG` function)**: Starting from the selected element, it traverses up the DOM tree (`element.parentElement`) until an element with the tag name `svg` is found.
4.  **Serialize SVG (`downloadSVG` function)**:
    *   If an SVG element is found, its content is serialized into an XML string using `new XMLSerializer().serializeToString(svgElement)`.
    *   A `Blob` is created from this string with the MIME type `image/svg+xml;charset=utf-8`.
5.  **Trigger Download**:
    *   A temporary `<a>` (anchor) element is created.
    *   Its `href` is set to an object URL created from the Blob (`URL.createObjectURL(blob)`).
    *   Its `download` attribute is set to "downloaded_svg.svg".
    *   The anchor is appended to the document body, programmatically clicked (`link.click()`), and then removed.
6.  **Error Handling**: If no selection is made, or if no SVG element is found in the ancestry of the selected element, an alert message is displayed.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
