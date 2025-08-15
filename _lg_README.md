# _lg - Global Logger Utility

A utility bookmarklet that provides a global `_lg()` function for logging messages to the console. This is particularly useful because `console.log` may not work directly or reliably in all bookmarklet execution contexts or across different browsers.

## Purpose

The `_lg` bookmarklet ensures a consistent way to log messages from other bookmarklets. It acts as a wrapper around `console.log`, providing a global function `_lg(...args)` that can be called from any other bookmarklet or script on the page after `_lg` has been activated.

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=_lg.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "_lg" or "Global Logger".
3. Set the URL to the JavaScript code found in [`_lg.js`](https://github.com/oaustegard/bookmarklets/blob/main/_lg.js).

## Usage

1. **Activate `_lg`:** Click the "_lg" bookmarklet on any webpage. This will define the global `_lg()` function.
2. **Use in other bookmarklets or console:** Once activated, you can use `_lg()` in the developer console or in your other bookmarklets just like you would use `console.log()`.

   **Example:**
   ```javascript
   // In another bookmarklet, after _lg has been run:
   _lg("This is a test message.", { value: 123, status: "ok" });
   _lg("Another message with multiple arguments:", "arg2", "arg3");
   ```

   This will output the messages and objects to the browser's developer console.

## Benefits

- **Reliability:** Provides a dependable logging mechanism when direct `console.log` calls might be problematic within bookmarklets.
- **Simplicity:** Offers a short and easy-to-remember function name (`_lg`) for logging.
- **Global Scope:** Once run, `_lg` is available globally, making it accessible from other scripts or bookmarklets executed on the same page.

## How it Works

The bookmarklet defines a function `_lg` on the `window` object. This function takes any number of arguments (`...args`) and passes them directly to `console.log(...args)`.

```javascript
// Simplified version of the core logic:
window._lg = function(...args) {
  console.log(...args);
};
```

It also includes a check to prevent re-definition if `_lg` already exists and is a function.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
