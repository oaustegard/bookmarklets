# Open in Microsoft Edge

Attempts to open the current webpage in the Microsoft Edge browser.

## Purpose

This bookmarklet provides a quick way to switch from your current browser to Microsoft Edge for viewing the same page. This can be useful for:

-   Testing website compatibility or rendering in Edge.
-   Accessing Edge-specific features or extensions.
-   Working with sites that are optimized or required to be used with Edge.

## Features

-   **Simple Redirect**: Prepends `microsoft-edge:` to the current URL.
-   **Protocol Handling**: Relies on the operating system's ability to handle the `microsoft-edge:` URL protocol.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=edge.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [edge.js file](https://github.com/oaustegard/bookmarklets/blob/main/edge.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Open in Edge").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage in a browser other than Edge.
2.  Click the "Open in Edge" bookmarklet.
3.  Your operating system should prompt you or automatically open the current URL in Microsoft Edge.

## How It Works

1.  It takes the current page's URL (`window.location.href`).
2.  It prepends the string `microsoft-edge:` to this URL.
3.  It then attempts to navigate to this new URL (e.g., `microsoft-edge:https://www.example.com`).
4.  If Microsoft Edge is installed and the `microsoft-edge:` protocol is correctly registered with the operating system, Edge will launch and open the original URL.

## Requirements

-   Microsoft Edge browser must be installed on your system.
-   The `microsoft-edge:` URL protocol handler must be correctly registered with your operating system. This is typically done automatically when Edge is installed.

## Technical Notes

-   This bookmarklet will only work if the `microsoft-edge:` protocol is recognized by the system. If not, it may do nothing or show an error.
-   Its effectiveness can vary depending on the operating system and browser from which it's launched.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/edge.js):
```javascript
javascript:(function() { window.location.href = "microsoft-edge:" + window.location.href; })();
```

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
