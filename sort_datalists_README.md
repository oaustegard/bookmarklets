# Datalist Sorter

Finds all `<datalist>` elements on the current webpage and sorts their child `<option>` elements alphabetically by text content.

## Purpose

HTML `<datalist>` elements provide suggestions for input fields. Sometimes, these lists are long and unsorted, making them hard to use. This bookmarklet sorts the options within any datalists on a page, potentially improving their usability.

## Features

-   **Finds All Datalists**: Scans the document for all `<datalist>` elements.
-   **Alphabetical Sort**: Sorts the `<option>` elements within each datalist based on their visible text content, case-insensitively.
-   **Preserves Values**: If an `<option>` has a distinct `value` attribute different from its text content, this value is preserved with the sorted text.
-   **DOM Manipulation**: Directly reorders the `<option>` elements within each `<datalist>` in the live DOM.
-   **Console Logging**: Outputs information about found datalists, options, and sorting progress to the console.
-   **User Feedback**: Alerts the user if no datalists are found.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=sort_datalists.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [sort_datalists.js file](https://github.com/oaustegard/bookmarklets/blob/main/sort_datalists.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Sort Datalists").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a webpage that contains one or more `<datalist>` elements associated with input fields.
2.  Click the "Sort Datalists" bookmarklet.
3.  The options within any datalists on the page will be reordered alphabetically.
4.  If you then type in an input field associated with a sorted datalist, the suggestions should appear in alphabetical order.
5.  An alert "No datalist elements found on this page." will appear if no datalists are present.

## How It Works

1.  **Find Datalists**:
    *   Uses `document.querySelectorAll('datalist')` to get a NodeList of all datalist elements.
    *   If none are found, alerts the user and exits.
2.  **Iterate Through Datalists**:
    *   Loops through each found `datalist` element.
3.  **Extract Options**:
    *   For each `datalist`, gets all its child `<option>` elements using `datalist.querySelectorAll('option')`.
    *   If a datalist has no options, it's skipped.
4.  **Prepare for Sorting**:
    *   Maps the `options` NodeList to an array of objects (`optionData`). Each object stores:
        *   `text`: The `textContent` of the option (trimmed).
        *   `value`: The `value` attribute of the option, or its `textContent` if no `value` attribute exists.
        *   `element`: A reference to the original `<option>` DOM element (though this isn't used in the re-creation step).
5.  **Sort Options**:
    *   Sorts the `optionData` array using `localeCompare` on the lowercase `text` property for case-insensitive alphabetical sorting.
6.  **Rebuild Datalist**:
    *   Clears the current content of the `datalist` (`datalist.innerHTML = '';`).
    *   Iterates through the sorted `optionData` array.
    *   For each item in sorted `optionData`:
        *   Creates a new `<option>` element.
        *   Sets its `textContent` to `optData.text`.
        *   If `optData.value` is different from `optData.text`, sets its `value` attribute to `optData.value`.
        *   Appends the new, sorted `<option>` to the `datalist`.
7.  **Logging**: Logs counts and progress to the console.

## Technical Notes

-   The changes are made directly to the live DOM and are temporary (lost on page reload).
-   The script re-creates option elements rather than just reordering existing ones. This is a common and often simpler way to handle reordering in the DOM.
-   It assumes standard `<datalist>` and `<option>` structures.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/sort_datalists.js).
