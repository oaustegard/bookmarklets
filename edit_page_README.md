# Toggle Page Editability

Toggles the entire current webpage between an editable and non-editable state.

## Purpose

This bookmarklet allows you to directly edit the text and sometimes the structure of any webpage, right in your browser. This is useful for:

-   Quickly trying out text changes or corrections on a live page.
-   Temporarily removing or modifying content for screenshots or presentations.
-   Understanding how content flows or reflows when text is changed.
-   A simple way to "deface" a page for fun (changes are client-side only and temporary).

## Features

-   **Toggle Functionality**: Clicking the bookmarklet once makes the page editable. Clicking it again makes it non-editable.
-   **Full Page Editing**: Affects the entire `document.body`.
-   **Standard Browser Feature**: Utilizes the browser's built-in `contentEditable` and `designMode` features.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=edit_page.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [edit_page.js file](https://github.com/oaustegard/bookmarklets/blob/main/edit_page.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Edit Page").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage.
2.  Click the "Edit Page" bookmarklet.
    *   The page content should now be editable. You can click on text and type, delete, or sometimes even drag and drop elements (depending on the browser).
3.  Click the "Edit Page" bookmarklet again.
    *   The page should return to its normal, non-editable state.

## How It Works

1.  **Check Current State**: It checks if `document.body.contentEditable` is currently `'true'`.
2.  **Toggle `contentEditable`**:
    *   If it was `'true'`, it sets `document.body.contentEditable = 'false'`.
    *   If it was not `'true'` (i.e., `'false'` or unset), it sets `document.body.contentEditable = 'true'`.
3.  **Toggle `designMode`**:
    *   Similarly, it toggles `document.designMode` between `'on'` and `'off'` based on the new state of `contentEditable`. If `contentEditable` was just set to `'true'`, `designMode` is set to `'on'`, and vice-versa.

## Technical Notes

-   Changes made are purely client-side and temporary. Reloading the page will revert all edits.
-   `contentEditable` is an HTML attribute that makes an element editable.
-   `document.designMode` can be used to make the entire document editable. Setting it to `'on'` is similar to setting `contentEditable='true'` on the `<body>` element.
-   The editing experience can vary between browsers and depending on the complexity of the webpage's HTML and CSS.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/edit_page.js):
```javascript
javascript:(function() {
    const toggle = document.body.contentEditable === 'true' ? 'false' : 'true';
    document.body.contentEditable = toggle;
    document.designMode = toggle === 'true' ? 'on' : 'off';
  })();
```

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
