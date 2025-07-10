# arXiv Abstract/PDF Toggle

This bookmarklet allows you to quickly switch between the arXiv abstract page and its corresponding PDF view, or vice-versa. The new view is opened in a new browser tab.

## Purpose

Navigating between an arXiv paper's abstract page (e.g., `arxiv.org/abs/xxxx.xxxx`) and its PDF version (e.g., `arxiv.org/pdf/xxxx.xxxx.pdf`) is a common task for researchers. This bookmarklet streamlines that process with a single click.

## Features

-   **Context-aware:** Detects whether you are currently on an abstract page or a PDF page.
-   **Switches views:**
    -   If on an abstract page, opens the PDF version.
    -   If on a PDF page, opens the abstract page.
-   **New Tab:** Always opens the alternate view in a new browser tab, keeping your current page open.
-   **Handles different URL formats:** Works with both `abs/` and `pdf/` URL structures.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=arxiv_abstract.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "arXiv Toggle" or similar.
3. Set the URL to the JavaScript code found in [`arxiv_abstract.js`](https://github.com/oaustegard/bookmarklets/blob/main/arxiv_abstract.js).

## Usage

1.  Navigate to an arXiv paper's abstract page (e.g., `https://arxiv.org/abs/2303.08774`) or its PDF page (e.g., `https://arxiv.org/pdf/2303.08774.pdf`).
2.  Click the "arXiv Toggle" bookmarklet.
3.  A new tab will open with the other view:
    *   If you were on the abstract page, the PDF will open.
    *   If you were on the PDF page, the abstract page will open.

## How it Works

The bookmarklet inspects the current page's URL:
- If the URL contains `/pdf/`, it replaces `/pdf/` with `/abs/` and removes the `.pdf` suffix to construct the abstract page URL.
- If the URL contains `/abs/`, it replaces `/abs/` with `/pdf/` and adds `.pdf` at the end to construct the PDF page URL.
- It then uses `window.open()` to open the newly constructed URL in a new tab.
- If the URL does not appear to be an arXiv abstract or PDF page, it alerts the user.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
