# Claude.ai - Continue Chat Helper

This bookmarklet injects a pre-defined prompt into the Claude.ai chat input field. The prompt is designed to guide users on how to continue a previous conversation in a new chat, particularly when context (like messages and attached files/artifacts) needs to be transferred.

## Purpose

When a Claude.ai chat session becomes too long or hits context limits, users often need to start a new chat while preserving the essence of the previous one. This bookmarklet provides a standardized set of instructions to paste into the new chat, reminding the user (and instructing Claude) on how to best carry over relevant information, including text and any "artifacts" (like uploaded files or code blocks from the previous chat).

## Features

-   **Injects Prompt:** Automatically places a detailed instructional prompt into the Claude.ai chat input.
-   **Clipboard Fallback:** Copies the prompt to the clipboard in case direct injection fails due to browser security or site updates.
-   **Focuses Input:** Attempts to focus the chat input field after injecting the prompt.
-   **User Guidance:** The prompt itself guides the user on what to paste from their previous chat.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_continue_chat.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Claude Continue Chat" or similar.
3. Set the URL to the JavaScript code found in [`claude_continue_chat.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_continue_chat.js).

## Usage

1.  Open a new chat session on `https://claude.ai/chats`.
2.  Click the "Claude Continue Chat" bookmarklet.
3.  The following prompt will be injected into the chat input field (and copied to your clipboard):
    ```
    I'm starting a new chat to continue our previous conversation. I will paste the relevant parts of our last exchange below, including the text of any artifacts we were discussing. Please re-familiarize yourself with that context.

    [Paste your previous conversation excerpt and artifact text here]
    ```
4.  Replace the placeholder `[Paste your previous conversation excerpt and artifact text here]` with the actual content from your prior chat that you want to continue. This might involve using a tool like the "Claude Conversation Pruner" or manually copying sections.
5.  Send the message to Claude.

## How it Works

1.  **Prompt Definition:** The bookmarklet contains a hardcoded string which is the instructional prompt.
2.  **Input Field Targeting:** It attempts to find the main chat input field on the Claude.ai page. The current selector targets a `div` with the attribute `contenteditable="true"` within a specific structure, which is common for rich text editors.
3.  **Injection & Clipboard:**
    *   It tries to set the `innerText` of the found input field to the prompt.
    *   It also copies the prompt to the clipboard using `navigator.clipboard.writeText()` as a reliable fallback.
4.  **Focus:** If the input field is successfully found and populated, it attempts to focus on it.
5.  **Feedback:** An alert informs the user that the prompt has been injected and copied.

## Notes

-   The reliability of injecting text directly into Claude.ai's input field depends on Claude's website structure remaining consistent. If Claude.ai updates its interface, the selectors used to find the input field might need adjustment. The clipboard copy provides a more robust way to get the prompt.
-   This bookmarklet is best used in conjunction with tools or methods for exporting/pruning previous Claude conversations (e.g., the `claude_pruner` bookmarklet).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
