# Strava Efforts Fit Curve

## Purpose
This bookmarklet enhances the "My Efforts" chart on a Strava segment page by adding a trend line. This visualizes your performance over time and calculates your approximate rate of improvement.

## Features
- Overlays a linear regression (line of best fit) trend line on the segment efforts chart.
- Calculates and displays your rate of improvement in "seconds per month".
- Adds a legend for the new trend line directly onto the chart.
- Helps you quickly visualize if you are getting faster or slower on a segment over time.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_recent_efforts_fit_curve.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Fit Curve".
3. Copy the code from `strava_recent_efforts_fit_curve.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a Strava segment page where you have at least two recorded efforts.
2. Scroll down to the "My Efforts" chart.
3. Click the "Strava Fit Curve" bookmarklet.
4. A red, dashed trend line and text describing your improvement rate will appear on the chart.

## How It Works
The bookmarklet scans the "My Efforts" chart for the SVG element it's drawn in. It then finds all the `<circle>` elements that represent your individual efforts and extracts their coordinates. Using this data, it performs a simple linear regression to calculate a line of best fit. Finally, it injects new SVG elements (`<path>` and `<text>`) into the chart to draw the trend line and display the calculated improvement rate.

## Technical Notes
- This bookmarklet is highly dependent on the specific HTML structure and class names of the Strava website, particularly the SVG chart. If Strava updates its design, the bookmarklet may break.
- It requires at least two efforts on a segment to calculate a trend line.
- The "improvement" calculation is a simple linear projection and may not be statistically rigorous, but it serves as a good visual indicator.

## License
MIT

## Author
[Your Name/Alias Here]
