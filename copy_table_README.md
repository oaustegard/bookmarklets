# Table to JSON Bookmarklet

A simple bookmarklet inspired by [Simon Willison's simple script](https://github.com/simonw/nicar-2025-scraping/blob/main/README.md) that converts HTML tables on any webpage to JSON copied to the clipboard, augmented with visual table selection. Vibe coded from the original with Claude 3.7 Sonnet (also the author of this README)

## Purpose

This bookmarklet solves the common challenge of extracting data from HTML tables on websites. When activated, it:

- Identifies all tables on the current webpage
- Provides a visual selection interface for pages with multiple tables
- Converts the selected table to a JSON array of objects
- Automatically copies the JSON data to your clipboard
- Uses table headers (or first row) as property names for the resulting objects

## Installation

1. Visit the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=copy_table.js)
2. Drag the bookmarklet to your bookmarks bar
3. Alternatively, create a new bookmark and paste the code manually

## Usage

1. Navigate to any webpage containing HTML tables
2. Click the bookmarklet in your bookmarks bar
3. For pages with multiple tables:
   - Tables will highlight when hovered over
   - Click the desired table to select it
   - A cancel button appears in the top-right if you want to exit
4. The JSON data is automatically copied to your clipboard
5. Paste the JSON into your desired application

## How It Works

The bookmarklet:
1. Locates all table elements on the current page
2. For multiple tables, enables visual selection with hover highlighting
3. Extracts the header row (th or td elements) for property names
4. Processes subsequent rows into JSON objects
5. Copies the formatted JSON to clipboard

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/copy_table.js)
