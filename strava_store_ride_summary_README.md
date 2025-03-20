# Strava Ride Summary Tools

A collection of bookmarklets to extract, store, and analyze ride data from Strava activity pages without requiring API access.

## Purpose

These bookmarklets solve common challenges for cyclists and runners who want to:

- Extract key data from Strava ride/activity pages
- Store this information locally for later reference
- Compare multiple activities over time
- Generate data for analysis or AI-assisted comparison
- Track progress without premium subscriptions

The tools work directly in your browser and store data locally, with no external dependencies or data sharing.

## Features

- **Extract** ride summary data with a single click
- **Store** information in your browser's localStorage
- **View** all stored ride summaries in a formatted display
- **Clear** stored data when no longer needed
- Works across login sessions
- No API key or authentication required
- Preserves original URLs for easy reference
- Timestamps each extraction for chronological tracking

## Bookmarklets

### 1. Store Ride Summary

Extracts the key data from a Strava ride and appends it to localStorage for subsequent display.

[Code](https://github.com/oaustegard/bookmarklets/blob/main/strava_store_ride_summary.js) | [Install Bookmarklet](https://austegard.com/bookmarklet-installer.html?bookmarklet=strava_store_ride_summary.js)

### 2. Display Ride Summaries

Retrieves all stored ride summaries and displays them in a formatted window with options to print or copy.

[Code](https://github.com/oaustegard/bookmarklets/blob/main/strava_display_ride_summaries.js) | [Install Bookmarklet](https://austegard.com/bookmarklet-installer.html?bookmarklet=strava_display_ride_summaries.js)

### 3. Clear Stored Rides

Removes all stored ride summaries from localStorage.

[Code](https://github.com/oaustegard/bookmarklets/blob/main/strava_clear_stored_rides.js) | [Install Bookmarklet](https://austegard.com/bookmarklet-installer.html?bookmarklet=strava_clear_stored_rides.js)

## Installation

### Simple Installation (Recommended)

Use the "Install Bookmarklet" links above to quickly install each bookmarklet.

### Manual Install (Alternative)

1. Create a new bookmark in your browser
2. Name it appropriately (e.g., "Store Strava Ride")
3. Copy the entire code from the corresponding JavaScript file
4. Paste it as the URL/location of the bookmark
5. Save the bookmark

## Usage

### Storing Ride Data

1. Navigate to any Strava activity page
2. Click the "Store Ride Summary" bookmarklet
3. You'll receive confirmation that the ride data was stored
4. Continue browsing to other ride pages and repeat as needed

### Viewing Stored Rides

1. From any page, click the "Display Ride Summaries" bookmarklet
2. A new window opens showing all stored ride data
3. Use the provided buttons to print or copy the data
4. Each ride includes its extraction timestamp and original URL

### Clearing Stored Data

1. Click the "Clear Stored Rides" bookmarklet
2. Confirm the deletion when prompted
3. All stored ride data will be removed from localStorage

## How It Works

The bookmarklets operate using standard browser features:

### Store Ride Summary
1. Extracts text content from the Strava page's heading section
2. Creates a structured data object with the content, URL, and timestamp
3. Stores this in the browser's localStorage under the key 'stravaRideSummaries'

### Display Ride Summaries
1. Retrieves the stored data from localStorage
2. Cleans the text by removing unnecessary phrases and formatting
3. Displays the formatted data in a new window with controls
4. Provides options to print or copy the full dataset

### Clear Stored Rides
1. Safely removes the 'stravaRideSummaries' key from localStorage
2. Confirms the action with the user to prevent accidental data loss

## Technical Details

- Uses browser localStorage for persistent storage across sessions
- Runs entirely in-browser with no server dependencies
- Creates structured JSON data for potential export to analysis tools
- Preserves original URLs and adds timestamps for reference
- Includes user feedback and error handling

## Privacy & Security

These bookmarklets:
1. Run entirely in your browser - no data is sent to any server
2. Store data only in your browser's localStorage
3. Add no tracking or analytics
4. Require no login or authentication to use

## License

Licensed under the MIT License
