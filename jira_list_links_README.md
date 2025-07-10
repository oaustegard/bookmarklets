# Jira Issue List to Formatted Links

Extracts all issues from a Jira list view (e.g., search results) and copies them to the clipboard as a formatted list, available in both Markdown and HTML.

## Purpose

When viewing a list of Jira issues (like the result of a JQL search), this bookmarklet allows you to quickly copy a summary of all those issues. This is useful for:

-   Sharing a list of relevant issues with a team.
-   Creating a quick report or checklist from a Jira query.
-   Pasting a set of issues into documentation or meeting notes.

## Features

-   **Processes Issue Lists**: Designed to work on Jira pages that display multiple issues in a table/list format.
-   **Extracts Key Details**: For each issue in the list, it gathers:
    -   Issue Key (e.g., "PROJ-123") and its direct link.
    -   Summary.
    -   Status.
    -   Priority (from image alt text).
    -   Type (from image alt text).
    -   Assignee (or "Unassigned").
-   **Dual Format List**: Copies a bulleted list in both Markdown and HTML.
    -   Markdown: A list of `* _[KEY](URL) - Summary (Status/Priority/Type/Assignee)_`
    -   HTML: An unordered list `<ul>` with list items `<li><em><a href="URL">KEY</a> - Summary (Status/Priority/Type/Assignee)</em></li>`
-   **Clipboard Integration**: Copies the generated lists to the clipboard.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=jira_list_links.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [jira_list_links.js file](https://github.com/oaustegard/bookmarklets/blob/main/jira_list_links.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Copy Jira List").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Jira page that displays a list of issues (e.g., after performing a search).
2.  Click the "Copy Jira List" bookmarklet.
3.  A formatted list of all issues from the current view is now in your clipboard. Paste into a rich text editor for HTML or a plain text editor for Markdown.

## How It Works

1.  **Helper Functions**:
    *   `getTextContent(selector, parent)`: Gets text content from an element.
    *   `getAttribute(selector, attribute, parent)`: Gets an attribute value from an element.
    *   `copyToClip(doc, html, text)`: Embedded utility for clipboard copying.
2.  **Select Issue Rows**:
    *   Finds all table rows representing issues using `document.querySelectorAll('tr.issuerow')`.
3.  **Iterate and Extract**:
    *   For each `row`:
        *   Uses helper functions with specific CSS selectors (e.g., `.issuekey a`, `.summary a`, `.status span`) to extract the key, link, summary, status, priority (from `img` alt text), type (from `img` alt text), and assignee.
        *   Constructs the full URL for the issue using `window.location.origin` and the relative link.
        *   Formats a Markdown list item string and an HTML list item string, similar in structure to the `jira_link.js` bookmarklet but as part of a list.
        *   Appends these to `markdownList` and `htmlList` strings.
4.  **Finalize and Copy**:
    *   Wraps the `htmlList` in `<ul>...</ul>` tags.
    *   Calls `copyToClip` with the complete HTML list and Markdown list.

## Technical Notes

-   The bookmarklet's effectiveness relies on the consistency of Jira's HTML structure and CSS class names for issue lists (e.g., `tr.issuerow`, `.issuekey`, `.summary`). Changes by Atlassian to Jira's UI could break these selectors.
-   It processes only the issues currently rendered on the page. If the Jira list is paginated, it will only copy issues from the visible page.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_list_links.js).
