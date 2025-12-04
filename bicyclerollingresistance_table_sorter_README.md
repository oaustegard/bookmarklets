# Bicycle Rolling Resistance Table Sorter

This bookmarklet enhances the data tables on `bicyclerollingresistance.com` by making them interactive and sortable.

## Purpose

The website `bicyclerollingresistance.com` provides valuable data on bicycle tire performance but presents it in static HTML tables. This bookmarklet adds client-side sorting functionality to these tables, allowing users to easily compare different tires by various metrics like width, weight, and rolling resistance at different pressures.

## Features

-   **Interactive Sorting**: Click on any column header in the main data table to sort the data.
-   **Multi-directional Sorting**: Click a header once to sort in ascending order, and again to sort in descending order.
-   **Visual Indicators**: Adds arrows to column headers to indicate the current sort column and direction.
-   **Smart Value Parsing**: Correctly sorts numerical, textual, and special data formats found in the tables (e.g., handling 'N/A' or '--' values).
-   **Non-intrusive**: The bookmarklet is lightweight and only affects the presentation of data on the current page without modifying the source.

## Installation

### Easy Install
1. Visit the [Bicycle Rolling Resistance Table Sorter Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bicyclerollingresistance_table_sorter.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Sort BRR Tables".
3. Set the URL to the JavaScript code found in [`bicyclerollingresistance_table_sorter.js`](https://github.com/oaustegard/bookmarklets/blob/main/bicyclerollingresistance_table_sorter.js).
4. Save the bookmark.

## Usage

1.  Navigate to a page on `https://www.bicyclerollingresistance.com` that contains a data table (e.g., the CX/Gravel, Road Bike, or MTB sections).
2.  Click the "Sort BRR Tables" bookmarklet in your bookmarks bar.
3.  The table headers will become clickable and will display sort indicators.
4.  Click on any header (e.g., "Weight", "Width", or one of the "RR" columns) to sort the table accordingly.

## How It Works

The bookmarklet injects JavaScript that:

1.  **Identifies Tables**: It locates the main header table (`#tableTirePagesID`) and the data table (`#tableData`).
2.  **Attaches Event Listeners**: It adds `click` event listeners to the header cells (`<th>`) of the header table.
3.  **Sorts Data**: When a header is clicked, it:
    *   Reads the data from the corresponding column in the data table.
    *   Converts cell contents to a comparable format (numbers or lowercase strings).
    *   Sorts the rows (`<tr>`) of the data table based on the selected column and direction (ascending/descending).
4.  **Updates DOM**: It re-orders the rows in the data table's `<tbody>` to reflect the sorted order.
5.  **Visual Feedback**: It injects `<span>` elements with arrows into the headers to show the active sort column and direction.

## Technical Notes

-   The script is specifically tailored to the HTML structure and CSS classes used by `bicyclerollingresistance.com`. Changes to the website's structure may break the bookmarklet's functionality.
-   The sorting is done entirely in the browser and does not require any server-side interaction.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Concept and edits by [Oskar Austegard](https://austegard.com) Code and Readme by Claude
