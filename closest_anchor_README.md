# Closest Anchor Link

Updates the browser's URL hash to point to the nearest anchor (`id` attribute or `a[name]`) of the currently selected text.

## Purpose

This bookmarklet helps you quickly obtain a direct link to a specific section of a webpage. If you select some text within a section that has an ID, or is near a named anchor, running this bookmarklet will change the URL in your address bar to include the hash for that section (e.g., `page.html#section-id`). You can then copy this URL to share or bookmark a link directly to that part of the page.

## Features

-   **Selection-Based**: Uses the current text selection to find the relevant part of the page.
-   **Finds IDs and Named Anchors**: Looks for the closest parent element with an `id` attribute or an `<a>` tag with a `name` attribute.
-   **URL Update**: Modifies `location.hash` to scroll to and highlight the identified section, and updates the address bar.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=closest_anchor.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [closest_anchor.js file](https://github.com/oaustegard/bookmarklets/blob/main/closest_anchor.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Link to Section").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Select any piece of text on a webpage near the section you want to link to.
2.  Click the "Link to Section" bookmarklet in your bookmarks bar.
3.  The page will scroll to the identified anchor (if not already visible), and the URL in your address bar will update to include the `#anchor-name`.
4.  You can now copy the URL from the address bar. If no suitable anchor is found, the hash might be cleared or remain unchanged.

## How It Works

1.  **Get Selection**: Accesses `window.getSelection().anchorNode.parentNode` to get the DOM element containing the start of the current text selection.
2.  **Find Closest Anchor**: Uses `elem.closest('*[id], a[name]')` to find the nearest ancestor element that either has an `id` attribute or is an `<a>` tag with a `name` attribute.
3.  **Update Hash**:
    *   If a target anchor is found, it sets `location.hash` to `#` followed by the `id` or `name` of the target.
    *   If no target is found, it sets `location.hash` to `''` (empty string), effectively removing any existing hash.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/closest_anchor.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
