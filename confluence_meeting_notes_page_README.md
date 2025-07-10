# Confluence Quick Meeting Notes Subpage

Creates a new "Meeting notes" page in Confluence as a child of the current page with a single click.

## Purpose

This bookmarklet streamlines the process of starting meeting notes in Confluence. Instead of manually clicking "Create", selecting the "Meeting notes" template, and ensuring it's a child of the correct page, this bookmarklet does it all in one go. It's particularly useful if you frequently create meeting notes related to specific project pages.

## Features

-   **One-Click Creation**: Instantly initiates the creation of a new meeting notes page.
-   **Automatic Parenting**: The new page is automatically set as a child of the current Confluence page.
-   **Uses "Meeting notes" Blueprint**: Leverages Confluence's built-in "Meeting notes" content blueprint (`c28532ce-03c1-4785-9710-640e7631e0f1`).
-   **Opens in New Tab**: The newly created draft page opens in a new browser tab, ready for editing.
-   **Error Handling**: Alerts the user if it fails to retrieve necessary information or if the API call fails.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=confluence_meeting_notes_page.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [confluence_meeting_notes_page.js file](https://github.com/oaustegard/bookmarklets/blob/main/confluence_meeting_notes_page.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "New Confluence Meeting Notes").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to the Confluence page that should be the parent of your new meeting notes.
2.  Click the "New Confluence Meeting Notes" bookmarklet in your bookmarks bar.
3.  A new tab will open with a draft of a "Meeting notes" page, pre-filled and parented under the page you were on.
4.  If there's an error, an alert will provide details.

## How It Works

1.  **Retrieves Page Info**:
    *   Scans `meta` tags on the current page to find `ajs-space-key` (the space key) and `ajs-page-id` (the ID of the current page, which will be the parent).
    *   If either is missing, it alerts the user and stops.
2.  **Constructs API Request**:
    *   Prepares a POST request to the Confluence REST API endpoint: `/rest/create-dialog/1.0/content-blueprint/create-draft`.
    *   The payload includes:
        *   `spaceKey`: The current space.
        *   `contentBlueprintId`: Specifically `c28532ce-03c1-4785-9710-640e7631e0f1` (the ID for the standard "Meeting notes" blueprint).
        *   `title`: An empty title (Confluence usually prompts for this or generates one).
        *   `context`: Specifies "Meeting notes".
        *   `parentPageId`: The ID of the current page.
3.  **Sends API Request**:
    *   Uses `XMLHttpRequest` to send the JSON payload to the Confluence API.
4.  **Handles Response**:
    *   If the API call is successful (status 200), it parses the JSON response.
    *   The response contains a `url` for the newly created draft page.
    *   It opens this URL in a new tab using `window.open(response.url, '_blank')`.
    *   If the API call fails, it alerts the user with the status and response text.

## Technical Details

-   Relies on specific Confluence meta tags (`ajs-space-key`, `ajs-page-id`) being present on the page.
-   Interacts with the Confluence REST API, requiring the user to be authenticated in their browser.
-   The `contentBlueprintId` for "Meeting notes" is hardcoded. If this ID changes in future Confluence versions, the bookmarklet may need updating.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/confluence_meeting_notes_page.js).
