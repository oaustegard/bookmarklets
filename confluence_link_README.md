# Confluence Page Link Copier

Copies a richly formatted link to the current Confluence page to the clipboard, providing both Markdown and HTML versions.

## Purpose

When working with Confluence, it's often necessary to share links to pages. This bookmarklet simplifies that by:

-   Extracting the current page's title and space name from Confluence-specific meta tags.
-   Formatting this information into a clean link, removing common bracketed additions from titles (e.g., "[DO NOT EDIT]").
-   Providing both a Markdown-formatted link and an HTML `<a>` tag.
-   Copying these to the clipboard, with HTML as the primary format for rich pasting, and Markdown as plain text.

## Features

-   **Confluence Specific**: Designed to work on Confluence pages by reading `ajs-page-title` and `ajs-space-name` meta tags.
-   **Title Cleaning**: Removes bracketed text (e.g., `[INFO]`, `[DRAFT]`) from the page title for a cleaner link text.
-   **Dual Format**: Creates both Markdown `[Title @ Space](URL)` and HTML `<a href="URL">Title @ Space</a>` links.
-   **Clipboard Integration**: Uses a robust `copyToClip` function to put both formats onto the clipboard.
-   **Error Handling**: Alerts the user if not on a Confluence page or if copying fails.
-   **Console Logging**: Logs success or failure messages to the console (using an embedded `_c` console alias).

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=confluence_link.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [confluence_link.js file](https://github.com/oaustegard/bookmarklets/blob/main/confluence_link.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Copy Confluence Link").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any Confluence page.
2.  Click the "Copy Confluence Link" bookmarklet in your bookmarks bar.
3.  A formatted link is now in your clipboard. You can paste it into applications that support rich text (to get the HTML link) or plain text (to get the Markdown link).
4.  Check the console for a success message or error details.

## How It Works

1.  **Injects Utilities**: The bookmarklet code includes definitions for `_c` (console alias) and `copyToClip`.
2.  **Reads Meta Tags**:
    *   Finds `meta[name="ajs-page-title"]` and `meta[name="ajs-space-name"]` elements.
    *   If not found, alerts the user and exits.
3.  **Extracts Information**:
    *   Gets the page title and cleans it by removing any text within square brackets (`.replace(/ *\[[^\]]*]/g, "")`).
    *   Gets the space name.
    *   Gets the current page URL (`window.location.href`).
4.  **Formats Links**:
    *   Constructs the Markdown string: `[decodedTitle @ decodedSpaceName](URL)`
    *   Constructs the HTML string: `<a href="URL">decodedTitle @ decodedSpaceName</a>`
    *   Decodes URI components for title and space name in the link text.
5.  **Copies to Clipboard**: Calls `copyToClip(document, htmlLink, markdown)` to copy both versions.
6.  **Feedback**: Logs success or errors to the console. Alerts on critical errors.

## Technical Details

-   The `copyToClip` function creates a temporary event listener for the "copy" event, sets data for `text/html` and `text/plain` MIME types, and then programmatically triggers a copy command.
-   Relies on Confluence's specific meta tag names for page information.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/confluence_link.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
