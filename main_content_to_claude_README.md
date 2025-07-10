# Send Main Page Content to Claude.ai

Extracts the main content of the current webpage, converts it to Markdown, and sends it as context to a new Claude.ai chat.

## Purpose

This bookmarklet helps you quickly use the content of a webpage as a starting point or context for a conversation with Claude.ai. It tries to:

-   Identify the primary content area of a page (e.g., an article body).
-   Clean up this content by removing common non-essential elements (like headers, footers, navbars, ads).
-   Convert the cleaned HTML to Markdown.
-   Truncate the Markdown if it's too long for Claude's context window.
-   Open a new Claude.ai chat with the extracted content and a default instruction.

## Features

-   **Main Content Detection**: Uses a series of selectors (`main`, `article`, `.post-content`, etc.) to find the main content container.
-   **HTML Cleaning (`rmEls`)**: Removes elements likely to be irrelevant (scripts, styles, SVGs, and elements with IDs/classes containing words like "footer", "social", "nav", "sidebar", "advertisement", "header").
-   **HTML to Markdown**: Includes and uses the Turndown library to convert the cleaned HTML to Markdown.
-   **Context Truncation**: Limits the Markdown sent to Claude to a `maxContextLength` (default 10,000 characters) to fit typical context window sizes.
-   **Claude.ai Integration**: Opens `https://claude.ai/new` with the Markdown content URL-encoded as part of the query string, prefixed with an instruction.
-   **Popup Blocker Handling**: Includes a basic alert if it detects the new window to Claude might have been blocked.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=main_content_to_claude.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [main_content_to_claude.js file](https://github.com/oaustegard/bookmarklets/blob/main/main_content_to_claude.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Page to Claude").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a webpage whose main content you want to discuss with Claude.
2.  Click the "Page to Claude" bookmarklet.
3.  A new tab should open, redirecting to Claude.ai with the extracted page content pre-filled in a new chat, along with the instruction: "The following is context for our conversation. Acknowledge with 'Ok'."
4.  If the main content cannot be identified, an alert "Unable to find main content." will appear.
5.  If the new window is blocked by a popup blocker, an alert "Pop-up blocked." may appear.

## How It Works

1.  **Turndown Library**: The entire TurndownService code is embedded in the bookmarklet. An instance is created: `var td = new TurndownService();`.
2.  **`mainEl()` Function**:
    *   Tries a list of common CSS selectors for main content areas (`main`, `article`, `.post-content`, `.main-content`, `.content`).
    *   Returns the first one found, or defaults to `document.body`.
3.  **`rmEls(root)` Function**:
    *   Takes a root DOM element.
    *   Selects all its descendants (`root.querySelectorAll('*')`).
    *   Iterates through them and removes elements if:
        *   They are `SCRIPT`, `STYLE`, or `SVG` tags.
        *   Their `innerHTML` starts with `data:image` (a heuristic for some embedded images/icons).
        *   Their `id` or `className` (converted to lowercase) includes common exclusionary keywords (e.g., "footer", "nav", "sidebar").
4.  **`truncateContext(context, maxLength)` Function**:
    *   If `context` length exceeds `maxLength`, it truncates it and appends "...".
5.  **Main Logic**:
    *   Calls `mainEl()` to get the main content DOM element.
    *   If found:
        *   Clones this element (`main.cloneNode(true)`) to avoid modifying the live page.
        *   Calls `rmEls()` on the clone to clean it.
        *   Converts the `innerHTML` of the cleaned clone to Markdown using `td.turndown(clone.innerHTML)`.
        *   Defines an `instruction` string for Claude.
        *   Calls `truncateContext()` to limit the Markdown length.
        *   Constructs the query string for Claude: `encodeURIComponent(instruction + "\n\n<context>\n" + truncatedMd + "\n</context>")`.
        *   Opens a new window (`window.open('', '_blank')`).
        *   If the window opens, it writes "Redirecting to Claude..." and then sets `newWindow.location.href` to the Claude URL with the query.
        *   If `window.open` fails (e.g., popup blocked), it alerts the user.
    *   If no main element is found, it alerts the user.

## Technical Notes

-   The effectiveness of main content extraction and cleaning heavily depends on the webpage's structure and the heuristics in `mainEl()` and `rmEls()`. It may not work perfectly on all sites.
-   Embedding Turndown makes the bookmarklet large but self-contained.
-   The `maxContextLength` of 10,000 characters is an approximation of LLM context limits and may need adjustment.
-   The instruction "Acknowledge with 'Ok'." is a simple way to ensure Claude processes the context before further interaction.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/main_content_to_claude.js).
