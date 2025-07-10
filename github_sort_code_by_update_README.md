# GitHub File List Sorter (by Last Update)

Sorts the list of files and folders on a GitHub repository page by the date of their last commit, displaying the most recently updated items first.

## Purpose

When browsing files in a GitHub repository, the default sort order is usually alphabetical. This bookmarklet provides a way to quickly see which files or folders have been worked on most recently. This can be helpful for:

-   Understanding recent development activity in a project.
-   Finding recently changed configuration files or documentation.
-   Prioritizing code review or exploration based on recency.

## Features

-   **Targets GitHub**: Specifically designed for GitHub repository file listing pages.
-   **Date-Based Sorting**: Uses the commit date associated with each file/folder.
-   **Newest First**: Sorts in descending order of update time.
-   **DOM Manipulation**: Directly reorders the rows in the file table on the current page.
-   **Console Logging**: Outputs messages to the console about its progress.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=github_sort_code_by_update.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [github_sort_code_by_update.js file](https://github.com/oaustegard/bookmarklets/blob/main/github_sort_code_by_update.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "GitHub Sort by Update").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a GitHub repository page that lists files and folders (e.g., the root of a repo, or any subdirectory).
2.  Click the "GitHub Sort by Update" bookmarklet.
3.  The table listing files and folders will be reordered to show the most recently committed items at the top.
4.  If the table cannot be found, an alert will notify you.

## How It Works

1.  **Find Table**:
    *   Looks for a `<table>` element with the attribute `aria-labelledby="folders-and-files"`. This is a selector specific to GitHub's file listing table.
    *   If not found, logs an error, alerts the user, and exits.
2.  **Get Rows**:
    *   Selects the `<tbody>` within the found table.
    *   Gets all `<tr>` (row) elements from the `<tbody>` and converts them into an array.
3.  **Sort Rows**:
    *   Uses `Array.prototype.sort()` on the `rows` array.
    *   The custom sort comparator function:
        *   For each row (`a` and `b`), it finds the `<relative-time>` HTML element. This element on GitHub pages contains the commit date in its `datetime` attribute.
        *   Handles cases where a row might not have a `<relative-time>` element (e.g., parent directory links like "..").
        *   Extracts the `datetime` attribute and converts it to a `Date` object.
        *   Compares these dates (`dateB - dateA`) to sort in descending order (newest first).
4.  **Reorder Table**:
    *   Clears the existing content of the `<tbody>` (`tbody.innerHTML = '';`).
    *   Appends each sorted row back into the `<tbody>` in the new order.
5.  **Logging**: Logs various steps and findings to the console.

## Technical Notes

-   This bookmarklet is highly dependent on GitHub's current HTML structure and CSS class names/attributes (e.g., `aria-labelledby="folders-and-files"`, `<relative-time>` tag). If GitHub changes its page structure, the bookmarklet may break.
-   The sorting is done client-side and only affects the current view. Reloading the page or navigating away will revert to GitHub's default sort.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/github_sort_code_by_update.js).
