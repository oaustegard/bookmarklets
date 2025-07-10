# Jira PR Link Augmenter (with Repo Name)

Enhances Jira's display of pull request (PR) links by prepending the repository name to each PR title. Also widens the PR detail dialog if open.

## Purpose

When a Jira issue has pull requests from multiple different repositories, the default list of PRs might only show titles, making it hard to distinguish which PR belongs to which repository without hovering or clicking. This bookmarklet adds the repository name directly to the link text for immediate clarity.

## Features

-   **Repo Prefix**: Modifies PR links in Jira's development status panel to include the source repository name, e.g., `[repository-name] Original PR Title`.
-   **Dialog Widening**: If the Jira pull request detail dialog (`devstatus-pullrequest-detail-dialog`) is open, it attempts to widen it to 1200px to better accommodate longer titles.
-   **Targets Specific Links**: Selects links with class `pullrequest-link ellipsis`.
-   **URL Parsing**: Extracts the repository name from the PR link's `href` attribute.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=jira_prefix_prs_with_repo.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [jira_prefix_prs_with_repo.js file](https://github.com/oaustegard/bookmarklets/blob/main/jira_prefix_prs_with_repo.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Jira PR Repo Names").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Jira issue page that has a "Development" panel displaying pull requests.
    Or, open the pull request detail dialog from such a panel.
2.  Click the "Jira PR Repo Names" bookmarklet.
3.  Pull request links in the development panel will be updated to show `[repo-name] PR Title`.
4.  If the PR detail dialog was open, it will be widened.

## How It Works

1.  **Widen Dialog (Attempt)**:
    *   Tries to find an element with `id="devstatus-pullrequest-detail-dialog"`.
    *   If found, sets its `style.width` to `1200px`.
2.  **Select PR Links**:
    *   Finds all `<a>` elements with the classes `pullrequest-link` and `ellipsis` using `document.querySelectorAll`. These are typically how Jira styles these links.
3.  **Iterate and Modify Links**:
    *   For each `link` found:
        *   Gets the original `title` attribute (which usually holds the full PR title).
        *   Gets the `href` attribute.
        *   Uses a regular expression (`/projects\/[^\/]+\/repos\/([^\/]+)\/pull-requests\/\d+/`) to parse the repository name from the `href`. The first capture group `([^\/]+)` after `/repos/` is the repository name.
        *   If a repository name is successfully extracted:
            *   Sets the `link.textContent` to `[repoName] originalTitle`.

## Technical Notes

-   This bookmarklet's effectiveness depends on Jira's HTML structure and CSS class names for the development panel and PR links. Changes by Atlassian to Jira's UI could break it.
-   The regex for extracting the repository name is specific to a common URL structure for Bitbucket Server/Data Center or similar Git integration links in Jira. It might not work for all Git hosting platforms linked to Jira.
-   The modification is purely client-side and temporary.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_prefix_prs_with_repo.js).
