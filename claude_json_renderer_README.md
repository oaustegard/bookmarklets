# Claude JSON Renderer

Renders a Claude.ai conversation JSON export into a styled HTML page for easy reading and sharing.

## Purpose

This bookmarklet is designed to be used on a page displaying the raw JSON output of a Claude.ai conversation (e.g., after using the "Claude Conversation Tree JSON Exporter" bookmarklet). It parses this JSON and generates a user-friendly HTML representation of the conversation in a new browser tab.

## Features

- **HTML Rendering**: Converts the JSON conversation data into a clean, readable HTML format.
- **Dynamic Library Loading**: Loads `marked.js` for Markdown parsing and `highlight.js` for syntax highlighting dynamically.
- **Message Path Reconstruction**: Correctly orders messages based on the conversation tree.
- **Artifact Handling**: Identifies and specially formats `<antArtifact>` blocks, including syntax highlighting for their content.
- **Markdown Support**: Parses Markdown within messages for proper formatting (bold, italics, lists, etc.).
- **Syntax Highlighting**: Applies syntax highlighting to code blocks within messages and artifacts.
- **Styling**: Uses Pico.css for a clean, responsive layout and custom styles for messages, sender differentiation, and artifacts.
- **Downloadable HTML**: Includes a "Download HTML" button on the rendered page to save the conversation locally.
- **Metadata Display**: Shows conversation title, creation date (linking to the original chat), and project name if available.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_json_renderer.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [claude_json_renderer.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Render Claude JSON").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  First, obtain the JSON export of a Claude.ai conversation. You can use the "Claude Conversation Tree JSON Exporter" bookmarklet for this. This will typically open the JSON data in a new tab.
2.  On the page displaying the raw JSON data (it should just be plain text starting with `{...}`), click the "Render Claude JSON" bookmarklet.
3.  A new tab will open, displaying the formatted HTML version of the conversation.
4.  You can use the "Download HTML" button on this new page to save the rendered conversation.

## How It Works

1.  **Loads Dependencies**: Dynamically loads `marked.js` (for Markdown to HTML) and sets its options. `highlight.js` is linked in the generated HTML for syntax highlighting.
2.  **Parses JSON**: Assumes the current page's `document.body.textContent` is the JSON string and parses it.
3.  **Reconstructs Conversation Path**: Traverses the message tree from the `current_leaf_message_uuid` to the root to get messages in chronological order.
4.  **Processes Messages**:
    *   Extracts text content from message parts.
    *   Identifies and formats `<antArtifact>` blocks, attempting to detect language (JSX/JavaScript) for syntax highlighting.
    *   Converts the message text (including formatted artifacts) from Markdown to HTML using `marked.parse()`.
5.  **Generates HTML**: Constructs a complete HTML document string with:
    *   Pico.css and highlight.js CSS links.
    *   Custom CSS for styling conversation elements.
    *   Conversation metadata (title, created date, project).
    *   A download button.
    *   Each message styled based on sender (human/assistant).
    *   JavaScript for `hljs.highlightAll()` and the `downloadHTML()` function.
6.  **Displays HTML**: Opens a new blank window (`window.open('', '_blank')`) and writes the generated HTML string into it using `newWindow.document.write()`.

## Technical Details

-   Depends on external CDNs for `marked.js`, `highlight.js`, and `Pico.css`.
-   The artifact parsing specifically looks for `<antArtifact>` tags and extracts `identifier`, `title`, and content.
-   The download function temporarily hides the download button itself from the saved HTML.
-   Designed to work with the JSON structure provided by the Claude API endpoint used by the "Claude Conversation Tree JSON Exporter" bookmarklet.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
