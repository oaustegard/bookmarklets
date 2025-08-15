# Claude Conversation Pruner/Selector

Provides an interactive interface to view, select, and export parts of a Claude.ai conversation from its JSON export.

## Purpose

This bookmarklet is used on a page displaying the raw JSON of a Claude.ai conversation. It renders the conversation in a new tab with checkboxes and controls, allowing the user to:

-   Select or deselect individual messages (human or assistant).
-   Select or deselect individual artifacts within messages.
-   View an estimated word and token count for the selected content.
-   Copy the selected content (formatted as a simple text dialogue) to the clipboard.
-   Download the selected content as a text file.

This is useful for curating parts of a conversation for context, summarization, or sharing.

## Features

-   **Interactive UI**: Renders the conversation with clickable elements to select/deselect messages and artifacts.
-   **Content Selection**: Allows fine-grained control over what parts of the conversation are included in the output.
-   **Dynamic Counters**: Displays real-time word count and estimated token count for the selected content.
-   **Toggle Controls**: Buttons to quickly toggle selection for all messages, human messages, assistant messages, or all artifacts.
-   **Formatted Output**: Generates a text representation of the selected conversation, including sender roles (`<Human>`, `<Assistant>`) and artifact details (`<Artifact title="...">`).
-   **Copy to Clipboard**: Button to copy the formatted selected content.
-   **Download as Text**: Button to download the formatted selected content as a `.txt` file.
-   **Timestamp Preservation**: Output is sorted chronologically based on original message/artifact timestamps.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_prune_json.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [claude_prune_json.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_prune_json.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Claude Pruner").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Obtain the JSON export of a Claude.ai conversation.
2.  On the page displaying the raw JSON data, click the "Claude Pruner" bookmarklet.
3.  A new tab will open with the interactive pruning interface.
    *   Click on messages or artifacts to toggle their selection (selected items have a green border, deselected red).
    *   Use the toggle buttons at the top to select/deselect groups of items.
    *   Observe the word/token count update in the top-right action buttons panel.
4.  Once desired content is selected:
    *   Click "Copy" to copy the formatted text to your clipboard.
    *   Click "Download" to save the formatted text as `selected-conversation.txt`.

## How It Works

1.  **Parses JSON**: Reads and parses the JSON from `document.body.textContent`.
2.  **Generates UI**:
    *   Constructs an HTML page with custom CSS for styling the interactive elements.
    *   Includes action buttons (Copy, Download, Token Counter) and control buttons (Toggle All, etc.).
    *   Renders each message and its artifacts, making them clickable.
    *   Initially, all messages and artifacts are selected.
3.  **Event Handling**:
    *   Attaches click listeners to messages and artifacts to toggle a `.selected` class.
    *   Control buttons toggle the `.selected` class on relevant groups of elements.
    *   Selection changes trigger `updateCounters()`.
4.  **Content Formatting (`formatSelectedContent`)**:
    *   Collects all `.selected` messages and artifacts.
    *   Extracts text content from messages and code from artifacts.
    *   Wraps message text with `<Human>` or `<Assistant>` tags.
    *   Wraps artifact content with `<Artifact title="...">` tags.
    *   Sorts all collected items by their original timestamp to maintain chronological order.
    *   Joins the sorted content into a single string.
5.  **Counters (`updateCounters`)**: Calculates words by splitting selected text; estimates tokens (words * 1.35).
6.  **Copy/Download**: Uses `navigator.clipboard.writeText()` for copying and creates a Blob/object URL for downloading.

## Technical Details

-   Relies on the JSON structure from Claude's API.
-   Uses modern JavaScript features and DOM manipulation.
-   Token estimation is a simple approximation.
-   The UI is self-contained within the generated HTML page.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_prune_json.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
