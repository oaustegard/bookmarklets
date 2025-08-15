# Jira Issue Link Copier

Copies a detailed, formatted link of the currently selected Jira issue to the clipboard, available in both Markdown and HTML. Works on Jira ticket pages and Kanban boards.

## Purpose

This bookmarklet simplifies sharing Jira issue details by providing a rich, formatted link that includes key information beyond just the title and URL. It's useful for:

-   Pasting Jira issue references into documents, emails, or chat messages.
-   Quickly sharing a summary of an issue's status and context.

## Features

-   **Context-Aware**: Works whether you are viewing a single Jira ticket or have a ticket selected/viewed in a Jira Kanban/board detail view.
-   **Rich Information**: The copied link text includes:
    -   Issue Key (e.g., "PROJ-123")
    -   Summary
    -   Status
    -   Assignee
    -   Priority
    -   Type
-   **Dual Format**: Copies both Markdown and HTML to the clipboard.
    -   Markdown: `_[KEY](URL) - Summary (Status/Assignee/Priority/Type)_`
    -   HTML: `<em><a href="URL">KEY</a> - Summary (Status/Assignee/Priority/Type)</em>`
-   **Uses Atlassian jQuery**: Leverages `AJS.$` if available for more robust element selection.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=jira_link.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [jira_link.js file](https://github.com/oaustegard/bookmarklets/blob/main/jira_link.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Copy Jira Issue Link").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Jira issue page directly.
    OR
    On a Jira Kanban board, click on an issue to bring up its detail view/panel.
2.  Click the "Copy Jira Issue Link" bookmarklet.
3.  The formatted link and details are now in your clipboard. Paste into a rich text editor for HTML or a plain text editor for Markdown.
4.  If no issue key can be found, an alert "Please select a ticket." will appear.

## How It Works

1.  **`copyToClip` Function**: An embedded utility to copy both HTML and plain text to the clipboard.
2.  **`getElementValue(selector)` Function**:
    *   Uses `AJS.$(selector).text().trim()` to get text content of elements. `AJS.$` is Jira's bundled jQuery.
3.  **Extract Issue Key**:
    *   Tries to get the issue key using the selector for the ticket page (`#key-val`).
    *   If that fails, it tries to get it from an attribute typically used in Kanban board detail views (`AJS$('#ghx-detail-issue').attr('data-issuekey')`).
    *   If no key is found, it alerts the user and exits.
4.  **Construct URL**: Forms the direct browse URL for the issue: `https://YOUR_JIRA_DOMAIN/browse/KEY`.
5.  **Extract Details**: Uses `getElementValue` with various Jira-specific selectors to get:
    *   Summary (`#summary-val`)
    *   Status (`#opsbar-transitions_more span` or `#status-val`)
    *   Priority (`#priority-val`)
    *   Type (`#type-val`)
    *   Assignee (`#assignee-val`)
6.  **Format Links**:
    *   Creates a Markdown link string.
    *   Creates an HTML link string.
    *   Both include the issue key as the link text and a description comprising the summary and other extracted details.
7.  **Copy to Clipboard**: Calls `copyToClip` with the HTML and Markdown strings.

## Technical Notes

-   The bookmarklet's reliability depends on Jira's HTML structure and CSS selectors/IDs remaining consistent. Changes by Atlassian to Jira's UI could break it.
-   It assumes `AJS.$` (Jira's jQuery) is available on the page.
-   The selectors for status are tried in two ways to cover different Jira contexts or versions.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_link.js).
