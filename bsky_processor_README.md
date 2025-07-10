# Bluesky Post Processor Launcher

This bookmarklet opens the current BlueSky post in a dedicated BlueSky Processor tool (hosted on `austegard.com`) in a new browser tab. It is intended for use when viewing a specific post on `bsky.app`.

## Purpose

The primary purpose of this bookmarklet is to provide a quick way to analyze or process a BlueSky post using an external tool. It constructs a URL for `austegard.com/bsky-processor` that includes the handle of the post's author and the post's ID, allowing the external tool to fetch and display information about that specific post.

## Features

-   **Redirects to Processor Tool:** Opens a new tab pointing to `https://austegard.com/bsky-processor/`.
-   **Extracts Post Details:** Parses the current BlueSky post URL to get the author's handle and the post ID.
-   **Passes Details as Parameters:** Appends the extracted handle and post ID to the processor tool's URL.
-   **Error Handling:** Alerts the user if they are not on a valid BlueSky post page.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=bsky_processor.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Bsky Processor" or similar.
3. Set the URL to the JavaScript code found in [`bsky_processor.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_processor.js).

## Usage

1.  Navigate to a specific post on BlueSky (e.g., `https://bsky.app/profile/username.bsky.social/post/123abc456def`).
2.  Click the "Bsky Processor" bookmarklet.
3.  A new tab will open with a URL similar to `https://austegard.com/bsky-processor/?handle=username.bsky.social&post=123abc456def`, loading the post in the external processor tool.

## How it Works

The bookmarklet executes the following steps:

1.  It checks if the current URL matches the pattern of a BlueSky post: `https://bsky.app/profile/{handle}/post/{postId}`.
2.  If it matches, it extracts the `{handle}` and `{postId}` from the URL using a regular expression.
3.  It then constructs a new URL for the processor tool: `https://austegard.com/bsky-processor/?handle={handle}&post={postId}`.
4.  Finally, it uses `window.open()` to open this new URL in a new tab.
5.  If the current URL does not match the expected BlueSky post format, it displays an alert message: "This bookmarklet only works on a bsky.app post page."

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
