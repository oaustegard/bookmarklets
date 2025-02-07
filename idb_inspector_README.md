# IndexedDB Inspector Bookmarklet

A lightweight tool for inspecting IndexedDB databases in any web page. Install it as a bookmarklet and click to analyze IndexedDB data without opening DevTools.

## Features

- View all IndexedDB databases and their stores
- Search and filter data using:
  - Simple text search
  - Exact key matching
  - Object path traversal (e.g., user.name)
  - Regular expressions
  - Numeric key ranges
- Draggable interface
- Works on any webpage

## Installation

1. Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=idb_inspector.js)
2. Drag the bookmarklet to your bookmarks bar

## Usage

1. Click the bookmarklet on any page using IndexedDB
2. Select a database and store from the dropdowns
3. Use the search tools to find specific data
4. Press Escape or click × to close

## Why It's Useful

- Quickly debug IndexedDB data without DevTools
- Filter and search large datasets easily
- Inspect web app state during development
- Verify data persistence in production

## Dependencies

Uses the `idb` library (loaded automatically) for reliable IndexedDB access.

## Notes

- Works in modern browsers that support IndexedDB
- More convenient than built-in browser tools for quick data inspection
- Loads external `idb` library from CDN​​​​​​​​​​​​​​​​