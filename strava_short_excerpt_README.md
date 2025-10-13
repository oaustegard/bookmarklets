# Strava Short Excerpt

## Purpose
This bookmarklet captures the heading text from a Strava activity page and stores it in your browser's local storage. It is designed to be a quick way to save a summary of a ride.

## Features
- Extracts the text content of the main heading of a Strava activity.
- Appends the extracted text to a list of summaries in the browser's local storage under the key `rideSummaries`.
- Creates the `rideSummaries` list if it doesn't already exist.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_short_excerpt.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Short Excerpt".
3. Copy the code from `strava_short_excerpt.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a Strava activity page.
2. Click the "Strava Short Excerpt" bookmarklet.
3. The heading text of the activity will be silently saved to your browser's local storage.

## How It Works
The script selects the HTML element with the CSS selector `section#heading`, which typically contains the main summary of a Strava activity. It then retrieves the `innerText` of this element. The script retrieves an existing array of summaries from local storage or creates a new one. The new summary is then appended to this array, and the updated array is saved back to local storage.

## Technical Notes
- This bookmarklet does not provide any visual feedback when it runs. You can verify that it worked by inspecting your browser's local storage.
- The functionality depends on the HTML structure of the Strava activity page, specifically the existence of a `section` with the ID `heading`. If Strava changes its website design, this bookmarklet may no longer work.

## License
MIT

## Author
[Your Name/Alias Here]
