# Copy URL as Link (Light Theme)

This bookmarklet opens a small, light-themed popup window that allows you to easily copy the current page's URL and title as a formatted HTML link and a Markdown link. It is designed to be compliant with modern Content Security Policy (CSP) restrictions.

## Purpose

The primary purpose of this bookmarklet is to provide a quick and convenient way to grab the current page's link in both HTML and Markdown formats, suitable for pasting into various applications. Users can also edit the title and URL in the popup before copying. This light-themed version is offered for users who prefer lighter interfaces or work in environments where it's more suitable.

## Features

-   **Light Themed UI**: Aesthetically designed popup with a light color scheme.
-   **Editable Fields**: Pre-fills with the current page's URL and title, which can be edited.
-   **Dual Format Copy**: Copies both an HTML link (`<a href="URL">Title</a>`) and a Markdown link (`[Title](URL)`) to the clipboard simultaneously.
-   **CSP Compliant**: Built using DOM manipulation methods that are generally allowed under Content Security Policies, avoiding `document.write()` or direct `innerHTML` assignments for its structure.
-   **Self-Contained**: The popup is generated and styled using inline JavaScript and CSS.

## Installation

### Easy Install
1. Visit the [Bookmarklet Installer for Light Theme](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=copy_url_as_link_light.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Copy URL as Link (Light)" or similar.
3. Set the URL to the JavaScript code found in [`copy_url_as_link_light.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_light.js).

## Usage

1.  Navigate to the webpage whose link you want to copy.
2.  Click the "Copy URL as Link (Light)" bookmarklet.
3.  A small light-themed popup window will appear, pre-filled with the page's URL and title.
4.  You can edit the URL or title in the input fields if needed.
5.  Click the "Copy & Close" button.
6.  The link (in both HTML and Markdown formats) is now on your clipboard. The popup window will close automatically.
7.  Paste into your desired application. If the application supports rich text, the HTML link will likely be used; otherwise, the Markdown link will be pasted.

## How It Works

The bookmarklet opens a new small window (`about:blank`). It then programmatically creates DOM elements (labels, inputs, button) and styles them using inline CSS to build the popup's interface. When the "Copy & Close" button is clicked, it constructs an HTML `<a>` tag and a Markdown link from the (potentially edited) URL and title values. It uses the `navigator.clipboard.write()` API (via a helper function) to copy both formats to the clipboard.

For a more detailed explanation of the development process and the CSP considerations, please refer to:
➡️ **[Overcoming Content Security Policy Challenges in Bookmarklet Development](copy_url_as_link_README.md)**

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_light.js). The main article linked above also contains the code.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
