# Jira Project Permissions Reorganizer (by Role)

Scrapes a Jira Data Center Project Permissions page and displays the permissions reorganized by project role in a floating UI panel. Includes options to copy or export this view as Markdown.

## Purpose

Jira's Project Permissions page typically lists permissions and then shows which roles/groups are granted each one. This bookmarklet inverts that view, making it easier to see all permissions assigned to a specific role. This is useful for:

-   Auditing what permissions a particular project role has.
-   Comparing permissions across different roles.
-   Documenting role configurations.
-   Understanding the effective permissions for users in specific roles.

## Features

-   **Targets Jira Data Center**: Specifically designed for the Project Permissions page in Jira Data Center instances (looks for `jira-permissions-table` element).
-   **Data Reorganization**: Parses the standard permissions table and reconstructs the data grouped by project role.
-   **Floating UI Panel**: Displays the results in a draggable, closable modal dialog overlaid on the page.
-   **Categorized Permissions**: Within each role, permissions are further grouped by their original category (e.g., "Project permissions", "Issue permissions").
-   **Markdown Export**:
    -   "Copy MD" button: Copies the role-based permission list to the clipboard in Markdown format.
    -   "Export MD" button: Generates a Markdown file (`jira-permissions-by-role.md`) and initiates a download.
-   **Clear Presentation**: The UI panel and Markdown output are structured for readability.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=jira_permissions_by_role.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [jira_permissions_by_role.js file](https://github.com/oaustegard/bookmarklets/blob/main/jira_permissions_by_role.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Jira Perms by Role").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Project Settings -> Permissions page in your Jira Data Center instance.
2.  Click the "Jira Perms by Role" bookmarklet.
3.  A floating panel will appear on the right side of the page:
    *   It lists each project role.
    *   Under each role, it lists the permissions granted, grouped by category.
    *   The panel header shows "Permissions by Role".
4.  **Interact with the Panel**:
    *   **Drag**: Click and drag the panel's header to move it.
    *   **Copy MD**: Click to copy the entire role-permission structure as Markdown to your clipboard. Shows "Copied!" or "Copy Failed" feedback.
    *   **Export MD**: Click to download the data as a `.md` file.
    *   **Close (×)**: Click the '×' button in the header to close the panel.
5.  If the permissions table is not found, an alert will appear.

## How It Works

1.  **Find Table**: Locates the main permissions table using `document.querySelector('jira-permissions-table')`.
2.  **Extract Data**:
    *   Iterates through `.permissions-group` elements (categories like "Project Permissions").
    *   Within each group, iterates through `<tr>` (permission rows).
    *   For each permission, it extracts its title, description, and category.
    *   It then looks at the "Grants" cell (`td[data-headers="security-type"]`) and extracts all roles/groups (`dl.types dt` and `dd`) that have this permission.
    *   Stores this data in a `Map` called `rolePermissions`, where keys are role names and values are arrays of permission objects.
3.  **Create UI Panel**:
    *   Dynamically creates a `div` (`resultsDiv`) for the panel with extensive inline CSS for styling (position, size, colors, fonts, overflow, etc.).
    *   Creates a header for the panel with a title, Copy, Export, and Close buttons.
    *   Creates a scrollable content area.
4.  **Populate UI**:
    *   Sorts roles alphabetically.
    *   For each role:
        *   Creates a section with the role name and permission count.
        *   Groups the permissions for that role by their original category.
        *   Creates sub-sections for each category, listing the permissions.
    *   Appends this generated content to the panel's content area.
5.  **Markdown Generation (`generateMarkdown`)**:
    *   Creates a Markdown string with top-level headers for roles, sub-headers for categories, and bulleted lists for permissions.
6.  **Button Functionality**:
    *   **Copy**: Uses `navigator.clipboard.writeText()` with visual feedback.
    *   **Export**: Creates a Blob, object URL, and an `<a>` link to trigger download.
    *   **Close**: Removes the `resultsDiv` from the DOM.
7.  **Draggability**: Adds `mousedown`, `mousemove`, and `mouseup` listeners to the panel header to allow dragging.
8.  **Append to Body**: Adds the fully constructed `resultsDiv` to `document.body`.

## Technical Notes

-   Highly dependent on Jira Data Center's specific HTML structure and class names for its Project Permissions page. Unlikely to work on Jira Cloud without modification.
-   Uses modern JavaScript (Maps, `async/await` for clipboard, `forEach`, arrow functions).
-   Error handling for clipboard operations is included.
-   The UI is created entirely with JavaScript DOM manipulation and inline styles.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_permissions_by_role.js).
