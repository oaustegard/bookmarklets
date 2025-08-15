# Instacart Cart Categorizer for Claude.ai

This bookmarklet extracts all item names from your current Instacart cart, formats them, and then opens a new Claude.ai window with a pre-filled prompt asking Claude to categorize these items.

## Purpose

The goal of this bookmarklet is to help users quickly understand the composition of their Instacart shopping cart by leveraging Claude.ai's ability to categorize items. This can be useful for budgeting, nutritional analysis, or simply organizing a large shopping list.

## Features

-   **Extracts Cart Items:** Automatically scrapes item names from your Instacart cart page.
-   **Formats for Claude.ai:** Prepares the list of items and a specific prompt for Claude.ai.
-   **Opens Claude.ai:** Redirects to Claude.ai in a new tab with the prompt and item list ready for processing.
-   **Handles Multiple Stores:** If items are from multiple stores in the cart, it includes all of them.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=categorize_instacart.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Categorize Instacart Cart" or similar.
3. Set the URL to the JavaScript code found in [`categorize_instacart.js`](https://github.com/oaustegard/bookmarklets/blob/main/categorize_instacart.js).

## Usage

1.  Navigate to your Instacart cart page (usually `https://www.instacart.com/store/cart`).
2.  Ensure your cart has items you wish to categorize.
3.  Click the "Categorize Instacart Cart" bookmarklet.
4.  A new tab will open, navigating to `https://claude.ai/chats`. The bookmarklet will attempt to paste a prompt and your list of cart items into the chat input.
    *   **Note:** Due to browser security restrictions, automatically pasting into Claude.ai's input field might not always work. The content is, however, copied to your clipboard.
5.  If the content was not auto-pasted, manually paste (Ctrl+V or Cmd+V) the content from your clipboard into the Claude.ai chat input.
6.  Submit the prompt to Claude.ai and wait for it to categorize your items.

**Example of the prompt sent to Claude.ai:**

```
Please categorize the following Instacart grocery items:

[Item 1 Name]
[Item 2 Name]
[Item 3 Name]
...
```

## How it Works

1.  **URL Check:** Verifies that you are on an Instacart cart page.
2.  **Item Extraction:**
    *   It looks for elements with the class `cart-item-name` (this class name might change if Instacart updates their website).
    *   It iterates through these elements and extracts the text content (the item names).
3.  **Prompt Creation:** It constructs a string containing the introductory prompt followed by each extracted item name on a new line.
4.  **Clipboard and Claude.ai:**
    *   The generated prompt and item list are copied to the clipboard using `navigator.clipboard.writeText()`.
    *   A new window is opened to `https://claude.ai/chats`.
    *   An attempt is made to find Claude.ai's chat input field and set its value. This part is experimental and may not always succeed due to cross-origin security policies.
5.  **User Feedback:** Alerts are used to inform the user if they are not on the correct page or if items have been copied.

## Notes

-   This bookmarklet's item extraction logic depends on the specific HTML structure and class names used by Instacart on their cart page. If Instacart changes its website design, the bookmarklet may need to be updated.
-   The automatic pasting into Claude.ai is a best-effort attempt and might be blocked by browser security. The primary mechanism for transferring the data is via the clipboard.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
