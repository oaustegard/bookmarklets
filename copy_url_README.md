# Copy URL (Deprecated)

**This bookmarklet is deprecated due to Content Security Policy (CSP) issues on modern websites.**

It was designed to open a small popup window allowing you to edit the current page's URL and title, and then copy a formatted HTML and Markdown link to the clipboard.

## Alternatives

Please use the newer, CSP-compliant versions:

-   [**copy_url_as_link_light.js**](copy_url_as_link_light.js) (Light theme popup)
-   [**copy_url_as_link_dark.js**](copy_url_as_link_dark.js) (Dark theme popup)

For more details on why this version was deprecated and how the new versions were developed, please see [Overcoming Content Security Policy Challenges in Bookmarklet Development](copy_url_as_link_README.md).

## Original Functionality (Legacy)

The bookmarklet would:
1.  Open a new, small browser window.
2.  Populate input fields with the current page's URL and title.
3.  Allow the user to modify these fields.
4.  Upon clicking "Copy & Close":
    *   Construct an HTML `<a>` link and a Markdown link `[title](url)`.
    *   Copy both to the clipboard (HTML for rich text, Markdown for plain text).
    *   Close the popup window.

This approach often fails now because `document.write()` (used to create the popup's content) is restricted by CSP on many sites.

## Source Code (Legacy)

The original source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_url.js) for historical purposes.
