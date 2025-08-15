# CSS Color Extractor & Swatch Generator

Extracts all CSS `color` and `background-color` rules from the current page's stylesheets and displays them as color swatches with their corresponding selectors in a new tab.

## Purpose

This bookmarklet is a developer tool for web designers and front-end developers to:

-   Quickly see all unique colors used in a webpage's CSS.
-   Identify which CSS rules define specific colors.
-   Understand a website's color palette directly from its live stylesheets.
-   Debug color-related CSS issues.

## Features

-   **Comprehensive Extraction**: Scans all stylesheets (`document.styleSheets`) on the page.
-   **Specific Properties**: Focuses on `color` and `background-color` CSS properties.
-   **Groups Rules by Color**: Collects all selectors that apply a particular color value.
-   **HSL Sorting**: Converts RGB colors to HSL to sort the displayed swatches by hue, saturation, and lightness, providing a more organized palette.
-   **Visual Swatches**: Renders a `<div>` with the actual background color for each unique color found.
-   **Displays Rules**: Lists the CSS selectors and properties associated with each color swatch.
-   **New Tab Output**: Opens the results in a new, clean browser tab for easy inspection.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=css_colors.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [css_colors.js file](https://github.com/oaustegard/bookmarklets/blob/main/css_colors.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Show CSS Colors").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage whose CSS colors you want to inspect.
2.  Click the "Show CSS Colors" bookmarklet in your bookmarks bar.
3.  A new tab will open, displaying a list of color swatches. Each swatch will show:
    *   A colored box representing the color.
    *   The color value (e.g., `#RRGGBB`, `rgb(...)`, `named-color`).
    *   The CSS rules (selector + property: value) that use this color.

## How It Works

1.  **`rgbToHsl` Function**:
    *   An embedded helper function to convert RGB color values to HSL (Hue, Saturation, Lightness). This is used for sorting.
2.  **`extractColorRules` Function**:
    *   Initializes an empty object `colorDict` to store colors and their associated rules.
    *   Iterates through `document.styleSheets`.
    *   For each stylesheet, it tries to iterate through its rules (`sheet.rules || sheet.cssRules`). This is wrapped in a `try...catch` because accessing rules from cross-origin stylesheets can throw security errors.
    *   For each CSS rule with a `style` object:
        *   It checks `color` and `background-color` properties.
        *   If a value is found, it's used as a key in `colorDict`. The corresponding CSS rule text (`selectorText { property: value; }`) is pushed into an array for that color.
3.  **Sorting Colors**:
    *   Gets an array of unique color values (`Object.keys(colorDict)`).
    *   Sorts this array using a custom sort function. The sort function is a bit flawed in the original code as it uses `window.getComputedStyle(document.body).color` and `backgroundColor` repeatedly inside the sort comparator instead of parsing the actual color strings `a` and `b` from the array being sorted. However, the *intent* is to sort by HSL.
4.  **Generating HTML**:
    *   Constructs an HTML string.
    *   For each sorted color:
        *   Creates a `<div>` for the swatch, styled with `background-color: ${color}`.
        *   Appends another `<div>` containing the color value and all CSS rules associated with it, joined by `<br>`.
5.  **Displaying Results**:
    *   Opens a new blank window (`window.open('', '_blank')`).
    *   Writes the generated HTML content into the new window.

## Technical Notes

-   The HSL sorting logic in the provided script has a potential issue: `window.getComputedStyle(document.body).color.match(/\d+/g)` and `window.getComputedStyle(document.body).backgroundColor.match(/\d+/g)` are used within the sort comparator. This means it's always comparing the document body's text color and background color, not the colors `a` and `b` from the list being sorted. This should ideally parse `a` and `b` to RGB then to HSL for correct sorting.
-   Accessing `sheet.rules` or `sheet.cssRules` can fail for stylesheets loaded from different domains if CORS headers are not permissive. The `try...catch` block handles this by skipping such stylesheets.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/css_colors.js).

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
