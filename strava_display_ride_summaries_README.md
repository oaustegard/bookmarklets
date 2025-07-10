# Display Stored Strava Ride Summaries

Retrieves Strava ride summaries stored in `localStorage` (under the key `rideSummaries`) and displays them in a new browser window.

## Purpose

This bookmarklet is a companion to others that might store Strava ride summaries (like `strava_store_ride_summary.js`, though note the slight difference in the `localStorage` key name compared to `strava_clear_stored_rides.js`). It provides a way to view all collected ride summaries in a simple, consolidated format.

## Features

-   **Retrieves from localStorage**: Fetches data from `localStorage.getItem('rideSummaries')`.
-   **Data Formatting**:
    -   Joins multiple ride summaries with a separator (`\n\n-------------\n\n`).
    -   Removes a predefined list of common, often noisy phrases (e.g., "Embed on Blog", "Give kudos", "View Flybys") from the text.
-   **New Window Display**: Opens a new window and writes the formatted ride summaries into it, wrapped in `<pre>` tags to preserve formatting.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=strava_display_ride_summaries.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [strava_display_ride_summaries.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_display_ride_summaries.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Show Stored Strava Rides").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Ensure you have previously used a bookmarklet (like `strava_store_ride_summary.js`) that saves ride summaries to `localStorage` under the key `rideSummaries`.
2.  Run this "Show Stored Strava Rides" bookmarklet on any webpage.
3.  A new window will open, titled "Rides", displaying all the stored ride summaries, formatted and cleaned.
4.  If no summaries are stored, the new window will likely be blank or show an empty `<pre>` tag.

## How It Works

1.  **Retrieve Data**:
    *   Gets the `rideSummaries` item from `localStorage`: `JSON.parse(localStorage.getItem('rideSummaries')) || []`. It expects an array of strings.
2.  **Format Data**:
    *   Joins the array of summaries into a single string, with each summary separated by `\n\n-------------\n\n`.
    *   Defines an array `trimPhrases` containing strings to be removed.
    *   Iterates through `trimPhrases` and uses `formattedData.replace(phrase, '')` to remove each phrase from the combined string. Note: `replace` without a global flag will only replace the first occurrence of each phrase.
3.  **Display in New Window**:
    *   Opens a new blank window: `window.open('', '_blank')`.
    *   Writes basic HTML structure (html, head, title, body) to the new window.
    *   Writes the `formattedData` inside `<pre>` tags to preserve line breaks and spacing.
    *   Closes the document stream for the new window (`w.document.close()`).

## Technical Notes

-   This bookmarklet expects data to be stored under `localStorage.getItem('rideSummaries')`. The `strava_clear_stored_rides.js` bookmarklet targets `stravaRideSummaries` (plural S). This slight inconsistency in naming might mean they don't operate on the exact same data unless the storing bookmarklet is careful. The `strava_store_ride_summary.js` (which has a README) also uses `stravaRideSummaries`. This current bookmarklet `strava_display_ride_summaries.js` might be intended for a different/older storage key or has a typo.
-   The phrase removal `formattedData.replace(phrase, '')` will only remove the *first* instance of each `trimPhrase` found in the *entire* `formattedData` string, not every instance within each summary. For global replacement, a regex with the `g` flag would be needed for each phrase.
-   If `localStorage.getItem('rideSummaries')` is empty or not an array, `|| []` handles it gracefully.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_display_ride_summaries.js).
