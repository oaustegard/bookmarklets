# Clear Stored Strava Ride Summaries

Clears Strava ride summary data that may have been stored in the browser's `localStorage` by other Strava-related bookmarklets.

## Purpose

Some bookmarklets (like `strava_store_ride_summary.js`) may save Strava ride data to `localStorage` for later use (e.g., by `strava_show_stored_rides.js` or `strava_display_ride_summaries.js`). This utility bookmarklet provides a way to delete this stored data.

## Features

-   **Targeted Deletion**: Specifically removes the `localStorage` item named `stravaRideSummaries`.
-   **User Confirmation**: Prompts the user with a confirmation dialog before deleting, showing how many rides are currently stored.
-   **Feedback**: Alerts the user if no data was found or if data was successfully cleared.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_clear_stored_rides.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [strava_clear_stored_rides.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_clear_stored_rides.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Clear Stored Strava Rides").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Run this bookmarklet on any webpage (its function is not page-specific, but it's thematically related to Strava).
2.  **If stored ride data exists**:
    *   An alert will ask: "Are you sure you want to delete all X stored ride summaries?" (where X is the count).
    *   Click "OK" to delete, or "Cancel" to abort.
    *   If "OK" is clicked, another alert confirms: "Successfully cleared X stored ride summaries."
3.  **If no stored ride data exists**:
    *   An alert will state: "No stored ride data found."

## How It Works

1.  **`clearStoredRides()` Function**:
    *   Retrieves the `stravaRideSummaries` item from `localStorage`. It parses it as JSON to count the number of stored rides (`JSON.parse(localStorage.getItem('stravaRideSummaries')) || []`).
    *   Gets the `rideCount`.
    *   If `rideCount` is 0, alerts "No stored ride data found." and exits.
    *   Constructs a confirmation message and uses `confirm()` to ask the user.
    *   If the user confirms:
        *   Removes the `stravaRideSummaries` item using `localStorage.removeItem('stravaRideSummaries')`.
        *   Alerts the user about successful deletion.
2.  **Main Execution**: Calls `clearStoredRides()`.

## Technical Notes

-   This bookmarklet interacts with `localStorage`, which is domain-specific. This means it will only clear data stored by bookmarklets run on the *same domain* where this clearing bookmarklet is run. For `localStorage` used by bookmarklets, this usually means it can be run on any domain as bookmarklets often operate in the context of the current page.
-   The key `stravaRideSummaries` is hardcoded.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_clear_stored_rides.js).
