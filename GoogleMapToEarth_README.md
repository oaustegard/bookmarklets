# GoogleMapToEarth - View Google Maps Location in Google Earth

This bookmarklet takes the current Google Maps view (location, search result, or coordinates) and opens it in Google Earth in a new browser tab.

## Purpose

For users who want to explore a location with the rich, 3D satellite imagery and terrain data of Google Earth, this bookmarklet provides a seamless transition from a Google Maps page. It simplifies the process of transferring your current map view to the Google Earth web application.

## Features

-   **Extracts Location Data**: Parses the Google Maps URL to extract coordinates (latitude, longitude), zoom level, and potentially other view parameters.
-   **Handles Different URL Formats**: Works with common Google Maps URL structures, including those for specific places, search results, and coordinate-based views.
-   **Constructs Google Earth URL**: Creates a valid Google Earth URL that attempts to replicate the view from Google Maps.
-   **Opens in New Tab**: Launches Google Earth in a new tab, keeping your Google Maps page open.

## Installation

### Easy Install
1. Visit the [GoogleMapToEarth Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=GoogleMapToEarth.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "GoogleMapToEarth" or "Open in Google Earth".
3. Set the URL to the JavaScript code found in [`GoogleMapToEarth.js`](https://github.com/oaustegard/bookmarklets/blob/main/GoogleMapToEarth.js).
4. Save the bookmark.

## Usage

1.  Navigate to Google Maps (`https://www.google.com/maps` or your local version).
2.  Find a location, perform a search, or adjust the map view to your desired perspective.
3.  Click the "GoogleMapToEarth" bookmarklet in your bookmarks bar.
4.  A new tab will open, loading Google Earth centered on the location from your Google Maps view.

## How It Works

The bookmarklet primarily functions by manipulating URLs:

1.  **Get Current URL**: It reads the current `window.location.href`.
2.  **URL Parsing**:
    *   It looks for patterns in the Google Maps URL that typically contain location data. Common patterns include `/maps/place/`, `/maps/search/`, or coordinates directly in the path like `/@lat,lng,zoomZ`.
    *   It uses regular expressions to extract latitude, longitude, and zoom level from the URL.
3.  **Construct Google Earth URL**:
    *   The standard Google Earth URL format is `https://earth.google.com/web/@lat,lng,altitudeA,distanceD,tiltT,headingH`.
    *   It uses the extracted latitude and longitude.
    *   The zoom level from Google Maps is converted into an approximate `distance` or `altitude` parameter for Google Earth. This conversion might be an estimation as the zoom paradigms differ.
    *   Other parameters like tilt and heading might be set to defaults or estimated if possible.
4.  **Open New Tab**: It uses `window.open()` to launch the constructed Google Earth URL in a new tab.
5.  **Error Handling**: If the current URL doesn't look like a recognizable Google Maps URL, it might alert the user or do nothing.

*(Note: The exact parsing logic can be complex due to the variety of Google Maps URL formats. The description above is a general approach.)*

## Technical Notes

-   The accuracy of the view replication in Google Earth (especially zoom/altitude) depends on how well the Google Maps URL parameters can be translated to Google Earth URL parameters.
-   Google frequently updates its URL structures, which might require the bookmarklet's parsing logic to be updated periodically.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
