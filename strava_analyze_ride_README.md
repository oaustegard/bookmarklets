# Enhanced Strava Analysis Bookmarklet

Extracts concise ride summaries from Strava activity pages and sends them to Claude.ai for analysis. Includes configurable thresholds for power, speed, and climb characteristics, optimized for URL length limits by focusing only on interesting segments.

## Purpose

This bookmarklet provides a curated, compact summary of a Strava ride to Claude.ai for focused analysis. It automatically filters segments based on configurable performance thresholds and sends only the most interesting segments and key ride data. Useful for:

- Getting Claude to focus on standout performances and achievements
- Generating insights about your most notable segments
- Quickly identifying which efforts exceeded your performance thresholds
- Analyzing power and climbing performances with customizable criteria

## Features

- **Configurable Thresholds**: Easy-to-modify parameters at the top of the script for power, speed, elevation, grade, and climb distance
- **Claude Project Support**: Optional project UUID parameter to send analysis to a specific Claude project
- **Smart Page Validation**: Ensures you're on a proper Strava activity page before running
- **Interesting Segment Filtering**: Identifies segments based on:
  - Starred segments
  - Achievements and Local Legends
  - Categorized climbs
  - Power threshold (default: 300W)
  - Speed threshold (default: 25 mph)
  - Elevation gain threshold (default: 200ft)
  - Grade threshold (default: 6.0%)
  - Long climb threshold (default: 0.5mi with >3% grade)
- **Sauce for Strava Integration**: Parses power curve data from the Sauce extension if available
- **Compact Output**: Uses emojis and concise formatting to fit within URL limits
- **Error Handling**: Validates page type and provides helpful error messages

## Configuration

### Basic Setup
The bookmarklet has a configuration section at the top with these easily editable parameters:

```javascript
/* ========== CONFIGURATION SECTION - Edit these values as needed ========== */
const CLAUDE_PROJECT = ""; /* Set to your project UUID, or leave empty for default workspace */
const POWER_THRESHOLD = 300; /* Minimum power (watts) to mark segment as interesting */
const SPEED_THRESHOLD = 25; /* Minimum speed (mph) to mark segment as interesting */
const ELEVATION_THRESHOLD = 200; /* Minimum elevation gain (ft) to mark climb as interesting */
const GRADE_THRESHOLD = 6.0; /* Minimum average grade (%) to mark climb as interesting */
const CLIMB_DISTANCE_THRESHOLD = 0.5; /* Minimum distance (mi) with >3% grade to mark as long climb */
const CLAUDE_PROMPT = "Analyze this Strava ride summary and highlight the most notable achievements, interesting segments, and overall performance. Focus on the segments that exceeded the filtering thresholds and any standout power/speed performances:";
/* ========================================================================== */
```

### Customization Options

**Power and Speed Thresholds:**
- `POWER_THRESHOLD`: Segments with power above this value will be marked as interesting
- `SPEED_THRESHOLD`: Segments with speed above this value will be marked as interesting

**Climb-Specific Thresholds:**
- `ELEVATION_THRESHOLD`: Climbs with elevation gain above this value will be marked as interesting
- `GRADE_THRESHOLD`: Climbs with average grade above this percentage will be marked as interesting  
- `CLIMB_DISTANCE_THRESHOLD`: Long climbs above this distance (with >3% grade) will be marked as interesting

**Claude Integration:**
- `CLAUDE_PROJECT`: Set to your Claude project UUID to send analysis to a specific project, or leave empty for default workspace
- `CLAUDE_PROMPT`: Customize the analysis instruction sent to Claude

### Finding Your Claude Project UUID
1. Go to your Claude project
2. Look at the URL: `https://claude.ai/project/your-project-uuid-here`
3. Copy the UUID and paste it into the `CLAUDE_PROJECT` field

## Installation

1. **Recommended Method**:
   - Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
   - Paste the bookmarklet code
   - Customize the configuration parameters in the code if desired
   - Generate and drag the link to your bookmarks bar

2. **Manual Method**:
   - Copy the JavaScript code
   - Edit the configuration section at the top to match your preferences
   - Create a new bookmark with the modified code as the URL

## Usage

1. Navigate to a Strava activity page (URLs like: `strava.com/activities/123456789`)
2. Click the bookmarklet
3. The bookmarklet will validate the page and extract interesting segments
4. A new Claude.ai tab will open with the ride summary and analysis prompt
5. If configured, the analysis will be sent to your specified Claude project

## How It Works

1. **Page Validation**: Confirms you're on a valid Strava activity page
2. **Data Extraction**: Gathers key ride information, stats, and achievements
3. **Segment Analysis**: Evaluates all segments against your configured thresholds
4. **Interest Filtering**: Only includes segments that meet criteria (starred, achievements, or exceed thresholds)
5. **Compact Formatting**: Creates a concise summary with emoji annotations:
   - ⭐ Starred segments
   - 🏆 Achievements  
   - 👑 Local Legends
   - 🗻 Categorized climbs
   - ⚡ Power above threshold
   - 💨 Speed above threshold
   - ⛰️ Elevation above threshold
   - 📈 Grade above threshold
   - 🚵 Long climb above threshold
6. **Claude Integration**: Opens Claude.ai with the formatted summary and your custom prompt

## Error Handling

The bookmarklet provides specific error messages for common issues:
- **Wrong website**: Prompts to navigate to Strava.com
- **Wrong page type**: Asks to go to an activity page (not segment, profile, etc.)
- **Page not loaded**: Suggests waiting for the page to finish loading
- **Missing elements**: Indicates the page may not be fully loaded

## Technical Notes

- Relies on Strava's HTML structure and CSS selectors
- URL length optimized by sending only interesting segments
- Uses OR logic for filtering (segments meeting any criteria are included)
- Compatible with Sauce for Strava extension for enhanced power data
- Requires no external dependencies beyond Strava's page content

## Output Format

The bookmarklet generates a compact JSON summary including:
- Ride details (athlete, date, title, location)
- Key statistics (distance, time, elevation, power, speed)
- Sauce for Strava power highlights (if available)
- Filtered list of interesting segments with emoji annotations
- Achievements and notable performances

This format provides Claude with focused, actionable data for meaningful analysis while staying within URL length limits.
