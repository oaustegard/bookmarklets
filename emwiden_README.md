# Emwiden - Expand Elements to Prevent Horizontal Scroll

A bookmarklet that allows users to select an element on a webpage, identify its nearest ancestor causing horizontal overflow, and expand that ancestor to fit its content, thereby eliminating unwanted horizontal scrollbars.

## Purpose

Horizontal scrollbars on webpages can disrupt user experience and indicate layout issues. The "Emwiden" bookmarklet provides a quick way to address this by allowing users to click on an element within an overflowing area. The script then attempts to find the parent element responsible for the horizontal scroll and widens it to accommodate its content. This is useful for developers debugging layouts, or for users who want to improve readability on pages with poorly constrained content (e.g., wide tables or code blocks).

## Features

-   **Element Highlighting**: Highlights elements on hover with a semi-transparent overlay for easy identification.
-   **Overflow Detection**: When an element is clicked, traverses up the DOM tree to find the nearest ancestor where `scrollWidth` is greater than `clientWidth`.
-   **Automatic Expansion**: Sets the `width` and `minWidth` of the identified overflowing ancestor to its `scrollWidth`, effectively making it wide enough for its content.
-   **Console Feedback**: Logs actions and status to the browser's developer console instead of using disruptive alerts.
-   **Deactivation**: Pressing the `Escape` key deactivates the bookmarklet mode, removing overlays and event listeners.

## Installation

### Easy Install
1.  Navigate to the [Bookmarklet Installer for emwiden.js](https://austegard.com/bookmarklet-installer.html?bookmarklet=emwiden.js).
2.  Drag the "Emwiden" link to your bookmarks bar.

### Manual Install
1.  Create a new bookmark in your browser.
2.  Set the name to "Emwiden" or "Expand Overflowing Element".
3.  Set the URL to the JavaScript code found in [`emwiden.js`](https://github.com/oaustegard/bookmarklets/blob/main/emwiden.js).
4.  Save the bookmark.

## Usage

1.  **Activate**: Navigate to a webpage with horizontal scrolling issues and click the "Emwiden" bookmarklet.
    *   A message "Bookmarklet activated..." will appear in the browser's developer console.
2.  **Interact**:
    *   Hover over elements on the page; they will be highlighted with a blue overlay.
    *   Click on an element that is part of, or contained within, an area causing horizontal scroll.
3.  **Result**:
    *   The script will attempt to find the overflowing parent and expand it. A message like "Expanded element: <div id="example">...</div>" will be logged to the console.
    *   If no overflowing ancestor is found for the clicked element, it logs "No overflowing element found...".
4.  **Deactivate**: Press the `Escape` key to exit the bookmarklet mode. A "Bookmarklet mode deactivated." message will appear in the console.

### Example Use Cases
-   **Wide Code Blocks**: On sites like ChatGPT, code blocks can sometimes cause horizontal scrolling. Use Emwiden to expand the code block container.
-   **Data Tables**: For wide tables that are constrained by a narrower parent container, clicking within the table can expand the container to show the full table width (e.g., historical crime tables from the FBI like [Table 4](https://ucr.fbi.gov/crime-in-the-u.s/2019/crime-in-the-u.s.-2019/topic-pages/tables/table-4)).

## How It Works

1.  **Activation**:
    *   Creates a hover overlay `div` and appends it to the body.
    *   Sets up event listeners for `mouseover` (to position the overlay), `mouseout` (to hide the overlay), `click` (to select an element), and `keydown` (for Escape key).
2.  **Hovering (`mouseover`, `mouseout`)**:
    *   When hovering over an element, the overlay `div` is positioned and sized to match the hovered element, providing a visual highlight.
3.  **Clicking an Element**:
    *   When an element is clicked:
        *   It starts with the clicked element and traverses up its parent chain (`element.parentElement`).
        *   For each ancestor, it checks if `element.scrollWidth > element.clientWidth`.
        *   If such an ancestor is found, its `width` and `minWidth` styles are set to `element.scrollWidth + 'px'`. The process stops, and the element is logged.
        *   If the loop completes without finding an overflowing ancestor, a "No overflowing element found" message is logged.
4.  **Deactivation (`keydown` for `Escape` key)**:
    *   Removes all event listeners.
    *   Removes the hover overlay `div` from the DOM.
    *   Logs "Bookmarklet mode deactivated."

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
