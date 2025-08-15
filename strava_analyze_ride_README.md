# Strava Ride Analyzer (Highlights to Claude.ai)

Extracts highlights, "Sauce for Strava" information, and interesting segments (based on power/speed thresholds) from a Strava activity page, then sends this summary to Claude.ai for analysis.

## Purpose

This bookmarklet provides a curated summary of a Strava ride to Claude.ai for focused analysis. Instead of sending raw JSON, it compiles key highlights and noteworthy segments into a more readable text format. Useful for:

-   Getting Claude to focus on specific aspects of a ride.
-   Generating a narrative or summary of a ride's key moments.
-   Quickly identifying segments that meet certain performance criteria.

## Features

-   **Highlight Extraction**: Gathers rider name, date/time, location, activity title, overall stats, and top achievements.
-   **"Sauce for Strava" Integration**: Parses data from the Sauce for Strava extension's info panel if available.
-   **Interesting Segment Filtering**:
    -   Identifies segments that are starred, have achievements, are Local Legends, are categorized climbs, or exceed user-defined power and speed thresholds (default: 300W, 25mi/h).
    -   Annotates segments with reasons for their "interest."
-   **Text Formatting**: Combines highlights into a summary block and formats interesting segments as a bulleted list.
-   **Claude.ai Integration**: Opens a new Claude.ai chat, pre-filling the formatted text summary along with a prompt asking Claude to review and highlight notable aspects.
-   **Error Handling**: Includes a `try...catch` block for the main execution to alert on errors.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_analyze_ride.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [strava_analyze_ride.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_ride.js).
    *   You can modify the default `powerThreshold` (300) and `speedThreshold` (25) in the `displayRideSummary` call at the end of the script if desired.
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Analyze Strava Ride Highlights").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Strava activity page.
2.  Click the "Analyze Strava Ride Highlights" bookmarklet.
3.  A new tab will open, redirecting to Claude.ai. The new chat will be pre-filled with the formatted ride summary and a prompt.
4.  If an error occurs, an alert will be shown.

## How It Works

1.  **Helper Functions**:
    *   `getTextFromSelector(selector, parent)`: Safely gets text content.
    *   `hasContent(selector, parent)`: Checks if an element exists and has non-empty content.
2.  **`getHighlights()`**: Extracts general ride information (title, stats, achievements, rider name, date/time, location) and calls `parseSauceInfo()`.
3.  **`parseSauceInfo()`**: Extracts data from the "Sauce for Strava" panel (`#sauce-infopanel`).
4.  **`getInterestingSegments(powerThreshold, speedThreshold)`**:
    *   Maps over all segment rows in the segments table.
    *   For each segment, extracts name, stats, speed, power, time, achievement title, and boolean flags for starred, hasAchievement, isLocalLegend, and isCategorized (including climb category).
    *   Filters these segments based on:
        *   Being starred.
        *   Having an achievement.
        *   Being a Local Legend.
        *   Being a categorized climb.
        *   Exceeding `speedThreshold`.
        *   Exceeding `powerThreshold`.
    *   Adds an `interest` property to matching segments, listing the reasons.
5.  **`combineHighlights(highlights)`**: Formats the general highlights into a newline-separated string.
6.  **`formatInterestingSegments(parsedSegments)`**: Formats the filtered interesting segments into a bulleted list string.
7.  **`displayRideSummary(powerThreshold, speedThreshold)`**:
    *   Calls `getHighlights()` and `getInterestingSegments()`.
    *   Calls `combineHighlights()` and `formatInterestingSegments()`.
    *   Combines these into a single `rideSummary` string.
    *   Defines a `prompt` for Claude.
    *   Constructs the Claude.ai URL and opens it in a new tab.
8.  **`executeWithErrorHandling()`**: Wraps the call to `displayRideSummary` in a `try...catch` block to handle potential errors during execution.
9.  **Main Execution**: Calls `executeWithErrorHandling()`. Default thresholds are 300W and 25 mi/h.

## Differences from `strava_analyze_activity.js`

-   **Output Format**: Sends a formatted text summary to Claude, not raw JSON.
-   **Segment Filtering**: Focuses on "interesting" segments based on criteria, rather than all segments.
-   **Prompt**: Uses a slightly different prompt for Claude, asking it to "highlight the most notable achievements and interesting segments."

## Technical Notes

-   Relies on Strava's HTML structure and CSS selectors. UI changes by Strava can break it.
-   The definition of "interesting" segments is based on hardcoded criteria and thresholds (which can be modified in the script).

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_ride.js).
