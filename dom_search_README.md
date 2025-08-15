# DOM Search

[dom_search_js](dom_search.js): A powerful debugging bookmarklet for front-end developers to search through JavaScript window properties and locate specific keys or values in the DOM.

## Features

- Deep search through window object properties
- Three search modes: key names, values, or both
- Intelligent filtering of standard window properties to reduce noise
- Interactive UI with modal dialogs
- Path visualization for found properties
- Detailed value inspection
- Protection against circular references
- Clean path formatting for better readability

## Purpose

This bookmarklet is a powerful debugging tool for front-end developers. It provides an interactive interface to search through the properties of the `window` object in the current webpage's Document Object Model (DOM). Users can search for specific key names, values, or both, helping to locate and inspect dynamic data, functions, or configurations within a live web application.

## Installation

### Easy Install
1. Visit the [DOM Search Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=dom_search.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Go to the [source code on GitHub](https://raw.githubusercontent.com/oaustegard/bookmarklets/refs/heads/main/dom_search.js).
2. Copy the entire JavaScript code.
3. Visit the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
4. Paste the copied code into the text area.
5. Name the bookmarklet (e.g., "DOM Search").
6. Drag the generated link from the installer to your bookmarks bar.

## Usage

1. Navigate to the webpage you want to debug
2. Click the bookmarklet in your bookmarks bar
3. In the search modal:
   - Enter your search string
   - Select search type:
     - **Key**: Search property names only
     - **Value**: Search property values only
     - **Both**: Search both names and values
4. Click "Search" to execute
5. Results will show:
   - Full property path
   - Value preview
   - "View Details" button for in-depth inspection

## Technical Details

- Performs a two-pass search:
  1. First pass marks objects containing matches
  2. Second pass collects leaf matches to avoid redundant results
- Handles circular references using WeakSets
- Limits display to 100 results for performance
- Cleans paths for readability (removes window/self prefixes)
- Safely handles errors during property access
- Uses native JavaScript DOM manipulation

## Browser Compatibility

Compatible with modern browsers that support:
- ES6+ features
- WeakSet
- CSS Flexbox
- Modern DOM APIs

## Limitations

- Cannot access certain protected properties
- Limited to window object properties
- Maximum display of 100 results

## Potential Improvements

1. DOM Search Extensions:
   - Add ability to search HTML elements by attribute names/values
   - Include search through element properties and event listeners
   - Search CSS rules and computed styles
   - Add XPath search capabilities

2. Search Enhancements:
   - Add regex search support
   - Implement fuzzy matching
   - Add type-specific search (e.g., only functions, only objects)
   - Filter by value type (string, number, function, etc.)
   - Add depth limit control to manage search scope

3. UI Improvements:
   - Add copy button for property paths
   - Export results to JSON/CSV
   - Add syntax highlighting for code values
   - Implement persistent search history
   - Add ability to favorite/bookmark specific paths
   - Add search within results

4. Technical Enhancements:
   - Add WebSocket/network request monitoring
   - Include localStorage/sessionStorage search
   - Add IndexedDB search capabilities
   - Include Cookie inspection
   - Add mutation observer for property changes
   - Implement value edit capabilities
   - Add performance metrics for searched properties

5. Visualization:
   - Add tree view for object relationships
   - Implement property dependency graph
   - Add visual diff between search results
   - Show property access patterns

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
