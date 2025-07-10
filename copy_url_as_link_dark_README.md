# Copy URL as Link (Dark Theme)

This bookmarklet opens a small, dark-themed popup window allowing you to edit the current page's URL and title, then copies a formatted HTML and Markdown link to your clipboard. It is designed to be compliant with modern Content Security Policy (CSP) restrictions.

## Features

-   Dark themed UI for the popup.
-   Pre-fills URL and page title.
-   Allows editing of URL and title before copying.
-   Copies both HTML (`<a href="...">...</a>`) and Markdown (`[title](url)`) links.
-   CSP-compliant: Builds its UI programmatically using `createElement`, `setAttribute`, etc.

## Detailed Information, Installation, and Usage

For detailed information about this bookmarklet, its light-themed counterpart, the development process, installation instructions, and usage, please see the main README:

➡️ **[Overcoming Content Security Policy Challenges in Bookmarklet Development (copy_url_as_link_README.md)](copy_url_as_link_README.md)**

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_dark.js). The main README linked above also contains the code.
