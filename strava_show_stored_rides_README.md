# Strava Show Stored Rides

## Purpose
This bookmarklet retrieves and displays Strava ride summaries that have been saved to the browser's local storage by other bookmarklets (like `strava_excerpt.js` or `strava_short_excerpt.js`).

## Features
- Retrieves ride data from local storage.
- Cleans the summary text by removing common boilerplate phrases from Strava.
- Formats the rides with metadata (timestamp, URL) for better context.
- Displays all stored rides in a new, clean, easy-to-read browser window.
- Provides controls to "Print", "Copy All", and "Clear Stored Rides".

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_show_stored_rides.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Show Stored Strava Rides".
3. Copy the code from `strava_show_stored_rides.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. After using another Strava bookmarklet to save ride summaries (e.g., `strava_excerpt.js`), click this "Show Stored Strava Rides" bookmarklet.
2. A new browser window or tab will open.
3. The new window will display all the ride summaries you have saved, along with the date they were saved and the original URL.
4. You can then use the buttons at the top to print the summaries, copy them to your clipboard, or clear them from your browser's storage.

## How It Works
The bookmarklet retrieves a JSON array of ride objects from `localStorage` using the key `stravaRideSummaries`. It then iterates through this array, cleaning up the summary text and formatting each ride's data into a string. This string is then written into the HTML of a new browser window. The new window also includes JavaScript for the control buttons (`Print`, `Copy`, `Clear`).

## Technical Notes
- This bookmarklet relies on data being present in `localStorage` under the key `stravaRideSummaries`. If no data is found, it will show an alert.
- The "Clear Stored Rides" button will permanently delete the `stravaRideSummaries` item from your local storage. This action is not reversible.

## License
MIT

## Author
[Your Name/Alias Here]
