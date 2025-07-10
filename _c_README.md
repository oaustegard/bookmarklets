# _c - Console Alias

Utility bookmarklet that aliases the `console` object to `_c` for more concise logging in other bookmarklets.

## Purpose

This bookmarklet is a developer utility designed to shorten calls to the `console` object. By aliasing `console` to `_c`, developers can write shorter, cleaner code when logging information from other bookmarklets. For example, `console.log()` becomes `_c.log()`.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=_c.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "_c" or "Console Alias".
3. Set the URL to the JavaScript code found in [`_c.js`](https://github.com/oaustegard/bookmarklets/blob/main/_c.js).

## Usage

1. Click the "_c" bookmarklet on any webpage.
2. Open your browser's developer console.
3. You can now use `_c` as an alias for the `console` object (e.g., `_c.log('Hello');`, `_c.error('An error occurred');`).

## Benefits

- **Conciseness:** Reduces the amount of code needed for logging.
- **Convenience:** Useful when frequently working with the console in bookmarklet development.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
