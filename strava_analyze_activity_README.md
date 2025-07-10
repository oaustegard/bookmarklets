# Strava Activity Analyzer (to Claude.ai)

Extracts detailed data from a Strava activity page, including segments and "Sauce for Strava" info, formats it as JSON, and sends it to Claude.ai for analysis.

## Purpose

This bookmarklet allows for in-depth analysis of a Strava activity by leveraging the analytical capabilities of Claude.ai. It gathers a wide range of data points from the activity page, structures them, and provides them as context to Claude. Useful for:

-   Getting automated insights on performance, achievements, and interesting segments.
-   Identifying areas for improvement.
-   A detailed breakdown of an activity beyond what Strava's interface might immediately show.

## Features

-   **Comprehensive Data Extraction**:
    -   **Activity Info**: Title, type, athlete, date, time, location, description.
    -   **Primary Stats**: Distance, moving time, elevation gain, relative effort.
    -   **Secondary Stats**: Weighted average power, energy output.
    -   **Detailed Stats Table**: Average/max for speed, heart rate, cadence, power; calories.
    -   **Weather**: Condition, temperature, humidity, feels like, wind speed/direction.
    -   **Gear & Device**: Name of gear used, device recorded with.
    -   **Social**: Kudos, comments count.
    -   **Achievements**: Summary of achievements.
    -   **"Sauce for Strava" Integration**: Parses data from the Sauce for Strava extension's info panel if available (selected data view and table rows).
    -   **Segment Efforts**: Detailed data for each segment including name, distance, elevation, grade, time, speed, power, intensity, heart rate, achievement status, starred status, local legend status, and climb category.
-   **JSON Formatting**: Structures all extracted data into a JSON object.
-   **Claude.ai Integration**: Opens a new Claude.ai chat, pre-filling the JSON data along with a prompt asking for analysis, notable achievements, interesting segments, overall performance, and recommendations.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=strava_analyze_activity.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [strava_analyze_activity.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_activity.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Analyze Strava Activity w/ Claude").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Strava activity page you want to analyze.
2.  Ensure the page is fully loaded, including segment data and the Sauce for Strava panel (if you use that extension and want its data included).
3.  Click the "Analyze Strava Activity w/ Claude" bookmarklet.
4.  A new tab will open, redirecting to Claude.ai. The new chat will be pre-filled with the extracted JSON data and a prompt for analysis.

## How It Works

1.  **`extractData()` Function**:
    *   **`safeGet(selector, property, fallback, context)`**: Helper to safely query DOM elements and get properties, returning a fallback if not found.
    *   **`getTableData(selector)`**: Helper to parse data from HTML tables (specifically the "More Stats" table).
    *   **`parseSauceInfo()`**: Helper to extract data from the "Sauce for Strava" panel (`#sauce-infopanel`) if it exists.
    *   Uses these helpers and direct `document.querySelector` calls with Strava-specific selectors to gather all the data points listed in "Features".
    *   Segment data is extracted by iterating over rows in `#segments-container table.segments tbody tr`.
    *   Filters out segments with 'N/A' names.
    *   Returns all collected data as a JSON string (`JSON.stringify(data, null, 2)`).
2.  **`sendToClaudeForAnalysis(jsonData)` Function**:
    *   Defines a `prompt` for Claude.
    *   Constructs a URL for `https://claude.ai/new` with the prompt and `jsonData` URL-encoded in the query string.
    *   Opens this URL in a new tab.
3.  **Main Execution**: Calls `extractData()` then `sendToClaudeForAnalysis()`.

## Technical Notes

-   Highly dependent on Strava's HTML structure and CSS class names/IDs. Changes to Strava's UI will likely break this bookmarklet.
-   Assumes the "Sauce for Strava" extension, if used, injects an element with `id="sauce-infopanel"` and has a certain structure.
-   The amount of data sent to Claude can be large, especially with many segments. It might approach or exceed Claude's context window limits for very long activities.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_activity.js).
