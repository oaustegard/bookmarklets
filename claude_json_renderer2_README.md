# Claude JSON Renderer 2

Renders a Claude.ai conversation JSON export into a basic styled HTML page. This is an alternative/simplified version of `claude_json_renderer.js`.

## Purpose

Similar to `claude_json_renderer.js`, this bookmarklet is used on a page displaying raw JSON output of a Claude.ai conversation. It parses this JSON and generates an HTML representation in a new tab. This version is simpler and has fewer features than the main renderer.

## Features

- **HTML Rendering**: Converts JSON conversation data into a readable HTML format.
- **Message Path Reconstruction**: Orders messages based on the conversation tree.
- **Artifact Handling**: Formats `<antArtifact>` blocks.
- **Basic Code Block Formatting**: Converts triple-backtick code blocks into `<pre><code>` tags with HTML escaping.
- **Basic Styling**: Uses Pico.css for layout and minimal custom styles.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_json_renderer2.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [claude_json_renderer2.js file](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer2.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Render Claude JSON (Simple)").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Obtain the JSON export of a Claude.ai conversation (e.g., using "Claude Conversation Tree JSON Exporter").
2.  On the page displaying the raw JSON data, click the "Render Claude JSON (Simple)" bookmarklet.
3.  A new tab will open with the formatted HTML version of the conversation.

## How It Works

1.  **Parses JSON**: Assumes `document.body.textContent` is the JSON string and parses it.
2.  **Reconstructs Conversation Path**: Traverses the message tree.
3.  **Processes Messages**:
    *   Extracts text content.
    *   Formats `<antArtifact>` blocks.
    *   Uses a custom regex `formatCodeBlocks` function to convert text within triple backticks into `<pre><code>` HTML elements, escaping the inner content.
4.  **Generates HTML**: Constructs an HTML document string with:
    *   Pico.css link.
    *   Basic custom CSS.
    *   Conversation title.
    *   Messages styled based on sender.
5.  **Displays HTML**: Opens a new blank window and writes the HTML into it.

## Differences from `claude_json_renderer.js`

-   Does not use `marked.js`; relies on a simpler custom code block formatter.
-   Does not include `highlight.js` for syntax highlighting.
-   Does not have a "Download HTML" button.
-   Overall simpler styling and fewer presentation features.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer2.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
