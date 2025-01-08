# DOM Search

A powerful debugging bookmarklet for front-end developers to search through JavaScript window properties and locate specific keys or values in the DOM.

## Features

- Deep search through window object properties
- Three search modes: key names, values, or both
- Intelligent filtering of standard window properties to reduce noise
- Interactive UI with modal dialogs
- Path visualization for found properties
- Detailed value inspection
- Protection against circular references
- Clean path formatting for better readability

## Installation

1. Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
2. Either
  a. Select dom_search from the dropdown or 
  b. Paste the bookmarklet code from https://raw.githubusercontent.com/oaustegard/bookmarklets/refs/heads/main/dom_search.js, then name the bookmarklet
3. Drag the generated link to your bookmarks bar

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
