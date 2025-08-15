# Bitbucket Terraform Highlighter

This bookmarklet applies JavaScript syntax highlighting to Terraform configuration files (`.tf`, `.tfvars`) when viewed in Bitbucket. Clicking the bookmarklet again will restore the original syntax highlighting provided by Bitbucket.

## Purpose

Bitbucket's default syntax highlighting for Terraform files can sometimes be suboptimal or not perfectly aligned with how developers are used to seeing JavaScript or similar languages. This bookmarklet offers an alternative by leveraging a JavaScript syntax highlighter (Prism.js, if available on the page, or a generic approach) to render Terraform code.

## Features

-   **Highlights Terraform:** Applies JavaScript-like syntax highlighting to code blocks recognized as Terraform files.
-   **Targets Bitbucket:** Specifically designed to work on Bitbucket file view pages.
-   **Toggle Functionality:**
    -   First click: Applies JavaScript highlighting.
    -   Second click: Restores Bitbucket's default highlighting.
-   **Visual Cue:** Changes the language label displayed by Bitbucket to "Terraform (JS Highlighted)" when active.
-   **Safe Fallback:** If Prism.js is not available, it attempts a simpler highlighting change.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bitbucket_tf_highlight.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Bitbucket TF Highlight" or similar.
3. Set the URL to the JavaScript code found in [`bitbucket_tf_highlight.js`](https://github.com/oaustegard/bookmarklets/blob/main/bitbucket_tf_highlight.js).

## Usage

1.  Navigate to a page on Bitbucket displaying a Terraform file (e.g., `my-repo/src/main.tf`).
2.  Click the "Bitbucket TF Highlight" bookmarklet. The syntax highlighting of the Terraform code should change. The language identifier (usually near the top of the file view) might also change to indicate that the highlighting is active.
3.  To revert to Bitbucket's default highlighting, click the bookmarklet again.

## How it Works

The bookmarklet performs the following actions:

1.  **Checks URL:** Verifies that the current page is on `bitbucket.org` and the file path ends with `.tf` or `.tfvars`.
2.  **Finds Code Blocks:** Locates the code containers (typically `<pre>`) used by Bitbucket.
3.  **Prism.js Detection:** It checks if `window.Prism` is available. Bitbucket often uses Prism.js for syntax highlighting.
4.  **Toggle State:** It uses a global variable (`window.terraformHighlightActive`) to keep track of whether the custom highlighting is active.
    *   **Applying Highlight:**
        *   If Prism.js is found, it changes the `className` of the code block and relevant parent elements to trick Prism into applying JavaScript highlighting (`language-javascript`).
        *   It updates the displayed language label.
        *   It then explicitly calls `Prism.highlightAll()` or `Prism.highlightElement()` to re-process the code.
    *   **Restoring Original:**
        *   It reverts the `className` changes.
        *   Restores the original language label.
        *   Calls Prism to re-highlight with the original language (usually `language-terraform` or `language-hcl`).
5.  **Error Handling:** If not on a Bitbucket Terraform page, it informs the user.

## Notes

-   The effectiveness of the JavaScript highlighting for Terraform code depends on the similarities in syntax (comments, strings, keywords). It's not a true Terraform parser but often provides a visually preferable result for some users.
-   This bookmarklet relies on the DOM structure and class names used by Bitbucket. Changes to Bitbucket's frontend could potentially break this bookmarklet.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
