# Jira Project Role Users Lister

Fetches and displays users and groups for each role in a specified Jira project, with an option to copy the output as Markdown.

## Purpose

This bookmarklet provides a convenient way to view the membership of all project roles for a given Jira project. It's useful for:

-   Auditing who has which roles in a project.
-   Quickly finding members of a specific project role.
-   Documenting project role memberships.

## Features

-   **Project Key Input**: Prompts for a project key if not automatically detected from a project configuration URL.
-   **Fetches Role Data**: Uses Jira's REST API (`/rest/projectconfig/latest/roles/{projectKey}`) to get role and membership information.
-   **Modal Display**: Shows the results in a styled, closable overlay.
-   **User and Group Display**: Lists both individual users (with display name, email, and avatar) and groups for each role.
-   **Filters Empty Roles**: Only displays roles that have members.
-   **Copy as Markdown**: A button in the modal allows copying the entire role membership list to the clipboard in Markdown format.
-   **Loading State**: Shows a "Loading roles..." message while fetching data.
-   **Error Handling**: Displays an error message in the modal if the API call fails.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=jira_project_role_users.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [jira_project_role_users.js file](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_users.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Jira Role Members").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any page in your Jira instance.
    *   If you are on a project configuration page (e.g., `.../project-config/YOUR_PROJECT_KEY/...`), the bookmarklet will try to auto-detect the project key.
2.  Click the "Jira Role Members" bookmarklet.
3.  If the project key wasn't auto-detected, a prompt will ask you to "Enter project key (e.g., AS):". Enter the desired project key.
4.  A modal overlay will appear:
    *   It will initially show "Loading roles...".
    *   Once data is fetched, it will list each project role that has members.
    *   Under each role, it will list assigned users (with avatars, names, emails) and groups.
5.  **Interact with the Modal**:
    *   **Copy as Markdown**: Click this button to copy the role and member list to your clipboard, formatted as Markdown. Shows "Copied!" on success.
    *   **Close (×)**: Click the '×' button in the header to close the modal.
    *   Clicking outside the modal content area also closes it.
6.  If there's an error fetching data, the modal will display an error message.

## How It Works

1.  **Project Key Detection/Prompt**:
    *   Tries to extract the project key from `window.location.pathname` using a regex for project configuration URLs.
    *   If not found, prompts the user. If no key is provided, it exits.
2.  **UI Creation**:
    *   Dynamically creates an overlay `div` and a modal `div` with inline CSS for styling.
    *   The modal includes a header with the project key, a "Copy as Markdown" button, a close button, and a content area.
    *   Appends the overlay to `document.body`.
3.  **API Call**:
    *   Constructs the API URL: `{jira_origin}/rest/projectconfig/latest/roles/{projectKey}?pageNumber=1&pageSize=50&query=`.
    *   Uses `fetch` to make a GET request to this endpoint.
        *   Includes `credentials: 'same-origin'` and standard headers.
4.  **Data Processing & Display (`displayRoles`)**:
    *   On successful API response:
        *   Parses the JSON.
        *   Filters the roles to include only those with `role.total > 0` (i.e., roles with members).
        *   Stores the filtered `rolesWithMembers` and `projectKey` on `window.jiraRolesData` for the copy function.
        *   Dynamically generates HTML to display each role, its member count, and lists of users (with avatars, names, emails) and groups.
        *   Sets this HTML as the `innerHTML` of the modal's content area.
    *   If the API call fails, displays an error message in the content area.
5.  **Copy as Markdown (`window.copyAsMarkdown`)**:
    *   This function is defined globally (on `window`) so it can be called by the button's `onclick`.
    *   Retrieves data from `window.jiraRolesData`.
    *   Constructs a Markdown string:
        *   Main header for the project.
        *   For each role: a sub-header with role name and member count.
        *   Under each role: "Users" and "Groups" sub-sub-headers with bulleted lists of members.
    *   Uses `navigator.clipboard.writeText()` to copy the Markdown.
    *   Provides visual feedback on the button ("Copied!").
6.  **Event Listeners**:
    *   The close button and overlay background click are set up to remove the overlay from the DOM.

## Technical Notes

-   Relies on Jira's specific REST API endpoint for project roles, which might vary between Jira versions or be different in Jira Cloud vs. Data Center.
-   The `pageSize=50` in the API URL implies it might not fetch all roles if a project has more than 50 (though this is rare for roles themselves, member listing might be paginated by the API for very large roles, which this script doesn't handle).
-   Uses modern JavaScript features like `fetch`, template literals, and arrow functions.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_users.js).
