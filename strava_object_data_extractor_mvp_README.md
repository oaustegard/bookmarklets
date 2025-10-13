# Strava Segment Data Extractor

## Purpose
This bookmarklet extracts detailed performance data for every segment in a Strava activity and displays it in a convenient table. It is designed for athletes and coaches who want to perform a quick, detailed analysis without manually clicking through each segment.

## Features
- Extracts key performance metrics including power, heart rate, cadence, speed, and elevation gain.
- Presents the data in a clean, easy-to-read HTML table.
- Displays the data in a popup modal on the activity page.
- Includes a "Close" button to dismiss the table.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_object_data_extractor_mvp.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Segment Extractor".
3. Copy the code from `strava_object_data_extractor_mvp.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to any Strava activity page.
2. Scroll down to the "Segments" section to ensure the data is loaded.
3. Click the "Strava Segment Extractor" bookmarklet.
4. A popup will appear on the top left of the page containing a table with detailed data for each segment in the activity.
5. Click the "Close" button to dismiss the popup.

## How It Works
The bookmarklet accesses a global JavaScript object, `pageView._segmentEffortsTableContext`, which Strava uses to manage the data for the segments table on an activity page. It then iterates through the `segmentEfforts.models` array within that object, extracting the relevant performance attributes for each segment. Finally, it constructs an HTML table with this data and displays it in a simple popup `div` injected into the page.

## Technical Notes
- This tool is highly dependent on Strava's internal JavaScript object structure (`pageView._segmentEffortsTableContext`). If Strava updates its website, this bookmarklet is likely to break.
- It uses an inline `onclick` event handler for the "Close" button, which may be blocked by strict Content Security Policies (CSP), although this is unlikely to be an issue on Strava's own pages.

## License
MIT

## Author
[Your Name/Alias Here]
