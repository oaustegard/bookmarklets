# SharePoint URL to Windows Explorer Path Converter

Converts the current SharePoint document library or list URL into an equivalent Windows Explorer file path and copies it to the clipboard.

## Purpose

This bookmarklet helps users who need to access SharePoint files or folders directly in Windows File Explorer, often for tasks like bulk operations, offline access (if synced), or integration with local applications. It generates a `file://` path that *may* work if WebDAV access to SharePoint is configured and accessible.

## Features

-   **Domain Validation**: Includes a function `isValidDomain` to check if the SharePoint server matches a list of predefined "local" domains (e.g., `.ACME.com`). **This needs customization for your organization.**
-   **URL Parsing**: Handles different SharePoint URL formats, including those with `_layouts/15/start.aspx#/` or `RootFolder=`.
-   **Path Transformation**: Converts the web path to a `file://` path using `DavWWWRoot`.
-   **Form-Page Stripping**: Removes any trailing `/Forms/<page>.aspx` (e.g. `AllItems.aspx`, `DispForm.aspx`) and collapses `/SitePages/...` to `/SitePages`.
-   **Dialog Display**: Shows the generated path in a temporary dialog box at the bottom-right of the page.
-   **Clipboard Integration**: Automatically copies the generated path to the clipboard.
-   **Auto-Close Dialog**: The dialog closes automatically after 10 seconds or when a "Close" button is clicked.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=sharepoint_file_path.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [sharepoint_file_path.js file](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path.js).
    *   **Important**: You must customize the `isValidDomain` function within the code to match your organization's SharePoint domains (the published version uses `.ACME.com` / `.AC-ME.com` placeholders).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the modified code into the installer.
    *   Name the bookmarklet (e.g., "SP to File Path").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a document library, folder, or file within your organization's SharePoint site.
2.  Click the "SP to File Path" bookmarklet.
3.  If the page is on a valid (configured) domain:
    *   A small dialog will appear in the bottom-right corner displaying the generated Windows Explorer path.
    *   This path will also be copied to your clipboard.
4.  Paste this path into the Windows File Explorer address bar.
5.  The dialog will close on its own after 10 seconds or if you click its "Close" button.
6.  An alert appears if the current domain is not in the configured list, or if path extraction fails.

## How It Works

1.  **`isValidDomain(server)`**: Checks if the server name ends with predefined domain suffixes (e.g., `.ACME.com`, `.AC-ME.com`) or has no dots (implying a local server name). **Customize this for your specific SharePoint environment.**
2.  **`extractPathInfo(url)`**:
    *   Parses `window.location.href` into server and path.
    *   Calls `isValidDomain`. If invalid, alerts and returns `null`.
    *   Handles different SharePoint URL structures:
        *   If the URL contains `_layouts/15/start.aspx#/`, it takes the part after the `#`.
        *   If the URL contains `RootFolder=`, it decodes and takes the value of `RootFolder`.
    *   Cleans the path by removing query parameters and trailing `/Forms/<page>.aspx`, and collapsing `/SitePages/...` to `/SitePages`.
3.  **`createExplorerPath(pathInfo)`**: Builds `file://{server}/DavWWWRoot{path}`.
4.  **`copyToClipboard(text)`**: Textarea-based clipboard copy via `execCommand('copy')`.
5.  **`showAndCopyPath(path)`**: Creates a styled dialog with the path and a close button, copies the path, and auto-removes the dialog after 10 seconds.
6.  **Main Execution**: `extractPathInfo` → `createExplorerPath` → `showAndCopyPath`.

## Technical Notes

-   The reliability of `DavWWWRoot` paths depends on the client machine running the WebClient service with proper authentication and network access to the SharePoint server.
-   The `isValidDomain` function is the only piece that **must** be configured for your environment.
-   The URL parsing logic is heuristic and might not cover all SharePoint URL variations or custom setups.
-   Unlike an earlier variant, this version does not gate on the legacy `SP` JavaScript global, so it also runs on pages where that object is not present.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path.js). Remember to set `isValidDomain` to your own domains.
