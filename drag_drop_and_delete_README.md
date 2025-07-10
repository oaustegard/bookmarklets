# Drag, Drop, and Delete Page Elements

A bookmarklet that allows you to interactively move elements around on any webpage by dragging and dropping them, or delete elements using the keyboard.

## Purpose

This tool is primarily for:

-   **Webpage Prototyping/Rearranging**: Quickly try out different layouts or element positions on a live page.
-   **Content Decluttering**: Temporarily remove distracting elements from a page for better focus or readability.
-   **Debugging Layouts**: Understand how elements are nested or how they behave when moved.

## Features

-   **Element Outlining**: Hovering over an element outlines it in blue so you know what you're about to interact with.
-   **Drag and Drop**: Click and drag an outlined element to reposition it anywhere on the page. The element's position will be fixed during and after dragging.
-   **Delete Element**: While an element is outlined (or being dragged), press the `Delete` or `Backspace` key to remove it from the page.
-   **Stop Interaction**: Press the `Escape` key to remove the current outline and deactivate the drag/delete listeners for that element, effectively ending the interaction mode.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=drag_drop_and_delete.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [drag_drop_and_delete.js file](https://github.com/oaustegard/bookmarklets/blob/main/drag_drop_and_delete.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Edit Page Layout").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage.
2.  Click the "Edit Page Layout" bookmarklet.
3.  **Hover**: Move your mouse over elements on the page. The element under your cursor will be outlined in blue.
4.  **Drag**:
    *   Press and hold the left mouse button on an outlined element.
    *   Move the mouse; the element will follow your cursor.
    *   Release the mouse button to drop the element in its new position.
5.  **Delete**:
    *   Ensure an element is outlined (by hovering or after dragging).
    *   Press the `Delete` or `Backspace` key on your keyboard. The element will be removed.
6.  **Stop/Deselect**:
    *   Press the `Escape` key. This will remove any current outline and stop the drag/delete listeners. You may need to click the bookmarklet again if you want to re-activate its full functionality on other elements (though hover outlining should persist).

## How It Works

1.  **`outlinedElement`**: A variable to keep track of the currently active (blue-outlined) element.
2.  **`outlineOnHover(e)`**:
    *   Attached to `mouseover`.
    *   Removes outline from previously outlined element (if any).
    *   Sets `outlinedElement` to `e.target` (the element being hovered over).
    *   Applies a `2px solid blue` outline to `outlinedElement`.
3.  **`mouseDown(e)`**:
    *   Attached to `mousedown`.
    *   If the click is on the `outlinedElement`, it calculates `offsetX` and `offsetY` (the mouse position relative to the element's top-left corner).
    *   Adds a `mousemove` listener (`mouseMove`).
4.  **`mouseMove(e)`**:
    *   If an element is being dragged (`outlinedElement` is set and mouse is down):
        *   Sets `outlinedElement.style.position = 'fixed'`.
        *   Updates `outlinedElement.style.left` and `outlinedElement.style.top` based on mouse position and the initial `offsetX/Y`, making the element follow the cursor.
5.  **`mouseUp(e)`**:
    *   Attached to `mouseup`.
    *   Removes the `mousemove` listener, effectively "dropping" the element.
6.  **`keyHandler(e)`**:
    *   Attached to `keydown`.
    *   If `Delete` or `Backspace` is pressed and an `outlinedElement` exists, it calls `outlinedElement.remove()` and clears `outlinedElement`.
    *   If `Escape` is pressed, it calls `cleanup()`.
7.  **`cleanup()`**:
    *   Removes outline from `outlinedElement`.
    *   Removes all event listeners (`mouseover`, `mousedown`, `mouseup`, `keydown`). This effectively deactivates the bookmarklet.
8.  **Initialization**: Adds all the event listeners when the bookmarklet is first run.

## Technical Notes

-   Changes made to the page are temporary and will be lost on page reload.
-   Moving elements with `position: fixed` can sometimes have unexpected interactions with other page styling, especially `z-index`.
-   The `cleanup()` function is intended to stop interactions, but to fully reset or interact with new elements after pressing Escape, you might need to re-run the bookmarklet.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/drag_drop_and_delete.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
