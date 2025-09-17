# pastebin - Create Pastebin Pastes from Web Content

This bookmarklet allows you to quickly create a Pastebin paste from either the text you have selected on a webpage or the entire page's content.

## Purpose

This tool is for users who frequently share snippets of text, code, or whole articles and want a fast way to upload them to Pastebin without navigating to the site and manually copying and pasting the content.

## Features

-   **Context-Aware Pasting**: If you have text selected, the bookmarklet will use that. If not, it will grab the entire text content of the page.
-   **Private by Default**: Creates a private paste to ensure your content isn't publicly listed.
-   **One-Month Expiration**: Sets a default expiration time of one month for the paste.
-   **Automatic URL Handling**: Upon successful creation, the new Pastebin URL is copied to your clipboard and opened in a new tab for immediate access.
-   **Informative Alerts**: Provides clear feedback on success or failure, including API error messages from Pastebin.

## Important Configuration

Before this bookmarklet will work, you **must** edit the script and insert your own Pastebin API developer key.

1.  Get your key from the [Pastebin API Documentation page](https://pastebin.com/doc_api) (you must be logged in).
2.  Edit the bookmarklet's code.
3.  Replace the placeholder `YOUR_API_KEY_HERE` with your actual key.

```javascript
/* EDIT THIS: Replace with your actual Pastebin API developer key from https://pastebin.com/doc_api */
const API_DEV_KEY = 'YOUR_API_KEY_HERE';
```

## Installation

### Easy Install
1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=pastebin.js)
2. Drag the created bookmarklet link to your bookmarks bar.
3. **Remember to edit the bookmarklet and add your API key after installation.**

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Post to Pastebin".
3. Set the URL to the JavaScript code found in [`pastebin.js`](https://github.com/oaustegard/bookmarklets/blob/main/pastebin.js).
4. **Important**: Before saving, edit the code and replace `YOUR_API_KEY_HERE` with your Pastebin API developer key.
5. Save the bookmark.

## Usage

1.  Navigate to any webpage containing the text you want to share.
2.  (Optional) Select the specific portion of text you want to paste.
3.  Click the "Post to Pastebin" bookmarklet in your bookmarks bar.
4.  If successful, a new tab will open with the Pastebin paste, and the URL will be in your clipboard. An alert will confirm this.
5.  If there's an error, an alert will display the reason.

## How It Works

1.  **Get Text**: The script first checks for any selected text using `window.getSelection()`. If nothing is selected, it falls back to the `innerText` of the document's body.
2.  **API Key Check**: It relies on the `API_DEV_KEY` constant you configured.
3.  **CORS Proxy**: To bypass browser security restrictions that prevent direct calls to the Pastebin API from a bookmarklet, the script routes its request through `corsproxy.io`.
4.  **API Request**: It sends a `POST` request to the Pastebin API (`https://pastebin.com/api/api_post.php`) with the text content and parameters for a private, one-month paste.
5.  **Handle Response**:
    *   If the response is a valid Pastebin URL, it means success. The script copies the URL to the clipboard (`navigator.clipboard.writeText`) and opens it in a new tab (`window.open`).
    *   If the response indicates an error, it displays the error message in an alert.

## Technical Notes

-   This bookmarklet will not work without a valid Pastebin API developer key.
-   The use of the `corsproxy.io` public proxy is a dependency. If this service is down or changes, the bookmarklet may fail.
-   The bookmarklet sets the paste format to 'text'. This can be changed in the script if another format (like 'javascript', 'html4strict', etc.) is preferred.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
