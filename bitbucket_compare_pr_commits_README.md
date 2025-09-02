# Bitbucket Compare Commits Helper

This bookmarklet provides a user-friendly interface on Bitbucket's commit list page to select and compare any two commits.

## Purpose

Bitbucket's default interface for comparing commits requires manually copying and pasting commit hashes into a URL or navigating through pull requests. This bookmarklet simplifies the process by allowing you to visually select two commits directly from the commits list and open the comparison view in a new tab.

## Features

-   **Visual Commit Selection:** Adds "Select" buttons next to each commit on the commit list page.
-   **Floating Toolbar:** Displays a convenient toolbar to manage the comparison.
-   **Two-Commit Comparison:** Allows you to select exactly two commits to compare.
-   **Direct Diff View:** Opens the standard Bitbucket diff view for the selected commits in a new tab.
-   **Clear and Close:** Easily clear your selection or close the tool to restore the original page view.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bitbucket_compare_pr_commits.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Bitbucket Compare Commits" or similar.
3. Set the URL to the JavaScript code found in [`bitbucket_compare_pr_commits.js`](https://github.com/oaustegard/bookmarklets/blob/main/bitbucket_compare_pr_commits.js).

## Usage

1.  Navigate to a commit list page in a Bitbucket repository (e.g., `https://bitbucket.org/your-project/your-repo/commits/`).
2.  Click the "Bitbucket Compare Commits" bookmarklet.
3.  A floating toolbar will appear, and "Select" buttons will be added to each commit row.
4.  Click "Select" for the two commits you want to compare. The buttons will show "#1" and "#2" to indicate the selection order.
5.  Once two commits are selected, the "Compare Commits" button in the toolbar will become active.
6.  Click "Compare Commits" to open a new tab showing the diff between the two commits. The first commit you selected will be the target, and the second will be the source.
7.  Use the "Clear Selection" button to deselect all commits, or "Close" to remove the tool from the page.

## How it Works

The bookmarklet performs the following actions:

1.  **Checks Page:** Verifies that it's on a Bitbucket commit page by looking for the `.commits-table` element.
2.  **Injects UI:** Adds custom CSS for styling and injects an HTML toolbar into the page.
3.  **Adds Selectors:** Iterates through each commit row in the table, extracts the commit hash, and appends a "Select" button.
4.  **Manages State:** Keeps track of selected commits in an array.
5.  **Handles Clicks:**
    *   **Select:** Adds or removes commits from the selection array and updates the UI.
    *   **Compare:** Constructs the appropriate Bitbucket compare URL from the selected commit hashes and opens it in a new tab.
    *   **Clear:** Empties the selection array and resets the UI.
    *   **Close:** Removes all injected UI elements (toolbar, buttons, styles) from the page.

## Notes

-   This bookmarklet is designed for the standard Bitbucket Cloud commit list view. Changes to Bitbucket's frontend could potentially break this bookmarklet.
-   The first commit selected is treated as the "target" (older commit), and the second is the "source" (newer commit) in the comparison.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
