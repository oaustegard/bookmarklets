# Strava Sortable Segments

## Purpose
This bookmarklet makes the segments table on a Strava activity page fully interactive and sortable. By default, Strava's segment list is static. This tool allows you to click on any column header to sort the segments by that metric.

## Features
- Makes the entire segments table sortable.
- Click any column header to sort in ascending order. Click again to sort in descending order.
- Supports sorting by:
  - Starred Segments (⭐️)
  - Achievements (KOM/QOM, Top 10, PRs) (🎖️)
  - Local Legend Status (🦸🏻)
  - Segment Name
  - Time
  - Speed, Power, Heart Rate, Cadence, and more.
- Cleans up the table header with emojis for better readability.
- May integrate with data from other browser extensions like "Sauce for Strava" for sorting by metrics like "Intensity".

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_sort_segments.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Sort Segments".
3. Copy the code from `strava_sort_segments.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to any Strava activity page.
2. Scroll down to the "Segments" section.
3. Click the "Strava Sort Segments" bookmarklet.
4. The headers in the segments table will become clickable.
5. Click any header to sort by that column. Click it again to reverse the sort order.

## How It Works
The bookmarklet finds the segments table on the page and dynamically modifies its headers to make them clickable. It attaches event listeners to each header. When a header is clicked, the script runs a custom sorting function based on the data type of that column. It then re-orders the rows in the table and updates the display.

## Technical Notes
- This bookmarklet is highly dependent on the HTML structure and CSS class names of the Strava activity page. If Strava updates its design, the bookmarklet may break.
- The sorting for "Intensity" and "Score" may only work if you have another browser extension, like "Sauce for Strava", that adds this data to the page.

## License
MIT

## Author
[Your Name/Alias Here]
