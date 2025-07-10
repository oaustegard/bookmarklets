# Strava Ride Excerpt (Development Version)

Extracts highlights and "interesting" segments from a Strava activity page and displays them in a new window. This script appears to be a development or earlier version, intended to be converted into a bookmarklet using a tool.

## Purpose

This script aims to provide a summarized textual excerpt of a Strava ride, focusing on key highlights and segments that meet certain criteria (e.g., starred, achievements, high power/speed). The output is displayed in a new window.

**Note**: This script as-is includes multi-line comments and `_lg` logging calls that would typically be stripped or handled by a bookmarklet creation tool. It is presented here as a functional script that would be processed by a tool like `https://caiorss.github.io/bookmarklet-maker/`.

## Features

-   **Highlight Extraction**: Gathers rider name, date/time, location, activity title, overall stats, and top achievements.
-   **Interesting Segment Filtering**:
    -   Identifies segments that are starred, have achievements, are Local Legends, are categorized climbs, or exceed user-defined power and speed thresholds (default: 300W, 25mi/h in the example call).
    -   Annotates segments with reasons for their "interest."
-   **Text Formatting**: Combines highlights into a summary block and formats interesting segments as a bulleted list.
-   **New Window Output**: Displays the combined summary in a new browser window, wrapped in `<pre>` tags.
-   **Logging**: Uses `_lg` for console logging throughout its execution (requires `_lg` to be defined, e.g., by injecting the `_lg.js` utility).

## Installation

This script is not a ready-to-use bookmarklet.
1.  Copy the JavaScript code from the [strava_excerpt.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_excerpt.js).
2.  To make it a bookmarklet:
    *   You would typically first ensure `_lg` is defined or remove/comment out `_lg` calls.
    *   Then, use a tool like [Bookmarklet Maker by caiorss](https://caiorss.github.io/bookmarklet-maker/) to convert the JavaScript into a `javascript:` URL.
    *   Drag the generated link to your bookmarks bar.
    *   Alternatively, manually create the `javascript:(function(){...})();` wrapper.

## Usage

(Assuming it has been converted into a functional bookmarklet and `_lg` is handled)
1.  Navigate to a Strava activity page.
2.  Click the generated bookmarklet.
3.  A new window will open, titled "Strava Highlights and Segments", displaying the extracted information.
4.  Check the console for detailed logs if `_lg` was included.

## How It Works

(Similar to `strava_analyze_ride.js`)
1.  **`_lg` Dependency**: The script starts by attempting to inject `_lg.js` utility if not present, but this injection method itself is commented out in the provided file and relies on `_lg` being globally available.
2.  **`getHighlights()`**: Extracts general ride information using `document.querySelector`.
3.  **`getInterestingSegments(powerThreshold, speedThreshold)`**:
    *   Maps over all segment rows.
    *   Extracts details for each segment.
    *   Filters segments based on being starred, having achievements, Local Legend status, being a categorized climb, or exceeding `speedThreshold` / `powerThreshold`.
    *   Adds an `interest` property listing reasons.
4.  **`combineHighlights(highlights)`**: Formats general highlights into a string.
5.  **`formatInterestingSegments(parsedSegments)`**: Formats interesting segments into a bulleted string.
6.  **`displayRideSummary(powerThreshold, speedThreshold)`**:
    *   Calls the above functions to get and format data.
    *   Combines them into a `rideSummary`.
    *   Opens a new window and writes the `rideSummary` into a `<pre>` tag.
7.  **Main Execution**: Calls `displayRideSummary(300, 25)` with default thresholds.

## Relationship to Other Strava Bookmarklets

This script shares significant logic with `strava_analyze_ride.js`. `strava_excerpt.js` seems like a version focused on direct display in a new window, while `strava_analyze_ride.js` is geared towards sending the data to Claude.ai. The `_lg` calls and the initial comment suggest this was more for development and debugging.

## Technical Notes

-   Relies heavily on Strava's HTML structure and CSS selectors.
-   The `_lg` calls would need to be removed or `_lg` defined for it to run without errors if not processed by a bookmarklet tool that handles it.
-   The thresholds for "interesting" segments (300W, 25 mi/h) are hardcoded in the final call.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_excerpt.js).
