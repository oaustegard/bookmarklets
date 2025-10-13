# Strava Year-over-Year Performance

## Purpose
This bookmarklet provides a detailed year-over-year (YoY) performance analysis for segments on the current Strava activity page. It compares your power and time for each significant segment against your average for the same segments over the last 365 days.

## Features
- **YoY Comparison**: Analyzes your performance on the current ride versus your average for the past year.
- **Dual Metric Analysis**: Compares both average power and elapsed time.
- **Percentage Improvement**: Calculates and displays the percentage difference from your yearly average for both power and time.
- **Positional Ranking**: Shows where your current effort ranks among all your efforts on that segment in the last year (e.g., "1st", "3rd", "10th").
- **Clear UI**: Displays the results in a clean, easy-to-read table inside a popup on the activity page.
- **Direct Links**: Provides a direct link to the full effort history for each analyzed segment.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_yoy_performance.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava YoY Performance".
3. Copy the code from `strava_yoy_performance.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Log in to your Strava account.
2. Navigate to one of your activity pages that contains segment efforts.
3. Click the "Strava YoY Performance" bookmarklet from your bookmarks bar.
4. A popup will appear on the top-right of the page with a detailed breakdown of your performance on key segments from that ride compared to your history.

## How It Works
The bookmarklet first identifies all the eligible segments from the current activity. For each of these segments, it uses Strava's internal API to fetch your entire effort history. It then filters this history to include only the efforts from the last 365 days. It calculates your average power and time over that period and compares it to the power and time from your current effort, showing the difference as a percentage. It also determines the rank of your current effort for a final comparison.

## Technical Notes
- **Login Required**: You must be logged into Strava for the bookmarklet to be able to fetch your segment history.
- **API Dependency**: This tool relies on Strava's internal, undocumented API. If Strava changes its API, this bookmarklet may break.
- **FTP Estimation**: The script attempts to calculate your FTP from the data available on the page to filter relevant segments. If it cannot, it falls back to a default value of `270W`. You can change this default value by editing the script.

## License
MIT

## Author
[Your Name/Alias Here]
