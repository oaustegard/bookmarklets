# SharePoint URL to Windows Explorer Path Converter

Converts the current SharePoint document library or list URL into an equivalent Windows Explorer file path and copies it to the clipboard.

## Purpose

This bookmarklet helps users who need to access SharePoint files or folders directly in Windows File Explorer, often for tasks like bulk operations, offline access (if synced), or integration with local applications. It generates a `file://` path that *may* work if WebDAV access to SharePoint is configured and accessible.

## Features

-   **SharePoint Specific**: Checks for the presence of SharePoint's `SP` JavaScript object.
-   **Domain Validation**: Includes a function `isValidDomain` to check if the SharePoint server matches a list of predefined "local" domains (e.g., `.ACME.com`). This needs customization for other organizations.
-   **URL Parsing**: Handles different SharePoint URL formats, including those with `_layouts/15/start.aspx#/` or `RootFolder=`.
-   **Path Transformation**: Converts the web path to a `file://` path using `DavWWWRoot`.
-   **Dialog Display**: Shows the generated path in a temporary dialog box at the bottom-right of the page.
-   **Clipboard Integration**: Automatically copies the generated path to the clipboard.
-   **Auto-Close Dialog**: The dialog closes automatically after 10 seconds or when a "Close" button is clicked.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=sharepoint_file_path.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [sharepoint_file_path.js file](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path.js).
    *   **Important**: You may need to customize the `isValidDomain` function within the code to match your organization's SharePoint domains.
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the modified code into the installer.
    *   Name the bookmarklet (e.g., "SP to File Path").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a document library, folder, or file within your organization's SharePoint site.
2.  Click the "SP to File Path" bookmarklet.
3.  If the page is recognized as a valid SharePoint site and domain:
    *   A small dialog will appear in the bottom-right corner displaying the generated Windows Explorer path.
    *   This path will also be copied to your clipboard.
4.  You can then try pasting this path into the Windows File Explorer address bar.
5.  The dialog will close on its own after 10 seconds or if you click its "Close" button.
6.  Alerts will appear if it's not a SharePoint site, not a valid local domain, or if path extraction fails.

## How It Works

1.  **SharePoint Check**: Verifies `typeof SP !== 'undefined' && typeof SP.Site !== 'undefined'`.
2.  **`isValidDomain(server)` Function**:
    *   Checks if the server name ends with predefined domain suffixes (e.g., `.ACME.com`, `.AC-ME.com`) or has no dots (implying a local server name). **This function needs to be customized for your specific SharePoint environment.**
3.  **`extractPathInfo(url)` Function**:
    *   Parses `window.location.href` to get the server and path.
    *   Calls `isValidDomain`. If invalid, alerts and returns `null`.
    *   Handles different SharePoint URL structures:
        *   If URL contains `_layouts/15/start.aspx#/`, it takes the part after the `#`.
        *   If URL contains `RootFolder=`, it decodes and takes the value of `RootFolder`.
    *   Cleans the path by removing query parameters and common endings like `/Forms/AllItems.aspx` or `/SitePages/...` (replacing the latter with just `/SitePages`).
4.  **`createExplorerPath(pathInfo)` Function**:
    *   Prepends `file://` to the server name and inserts `/DavWWWRoot` before the path: `file://{server}/DavWWWRoot{path}`.
5.  **`copyToClipboard(text)` Function**: Standard textarea-based clipboard copying.
6.  **`showAndCopyPath(path)` Function**:
    *   Creates a styled `div` for the dialog.
    *   Sets its `innerHTML` with the path and a close button.
    *   Appends dialog to `document.body`.
    *   Calls `copyToClipboard`.
    *   Sets up the close button's `onclick` and a `setTimeout` to remove the dialog.
7.  **Main Execution**: Calls `extractPathInfo`, then `createExplorerPath`, then `showAndCopyPath`.

## Technical Notes

-   The reliability of `DavWWWRoot` paths depends on the client machine having the WebClient service running and proper authentication/network access to the SharePoint server.
-   The `isValidDomain` function is crucial and **must be configured** by the user for their specific SharePoint environment for the bookmarklet to work as intended.
-   The URL parsing logic is heuristic and might not cover all SharePoint URL variations or custom setups.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path.js). Remember to check and customize `isValidDomain` if needed.
