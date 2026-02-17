# Observer

A lightweight bookmarklet that toggles an event observer on the current page and logs user interactions to the browser console.

## Purpose

This bookmarklet helps you inspect how a webpage responds to real user interactions by logging key mouse and keyboard activity. It is especially useful when debugging automations, reproducing UI behavior, or pairing with browser-based AI assistants to provide structured interaction traces. Because it runs in-page, it captures events in the same context as the site itself.

## Features

- One-click toggle: run once to enable observer mode, run again to disable it
- Logs key interaction events: `click`, `change`, `input`, `submit`, `scroll`, and `keydown`
- Captures meaningful target details (`tag`, `id`, `role`, filtered classes, text snippet, URL)
- Debounces high-frequency events (`input`/`keydown` and `scroll`) to reduce noise
- Emits clear on/off status messages (`OBSERVER_ON` / `OBSERVER_OFF`) in the console

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=observer.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Observer".
3. Set the URL to the JavaScript code found in [`observer.js`](https://github.com/oaustegard/bookmarklets/blob/main/observer.js).
4. Save the bookmark.

## Usage

1. Open the webpage you want to observe.
2. Open DevTools Console so you can view event logs.
3. Click the **Observer** bookmarklet once to enable logging.
4. Interact with the page (click, type, submit forms, scroll).
5. Review console entries prefixed with `__OBS__` and the JSON payload.
6. Click the bookmarklet again to disable observer mode.

## How It Works

The bookmarklet stores its active state on `window.__obsActive` and tracks attached listeners in `window.__obsListeners`.  
When enabled, it registers capture-phase listeners on the document for interaction events and computes a "best target" element by walking up the DOM for a more meaningful node.  
Each event is transformed into structured JSON and logged to the console, with debounce timers used for typing and scroll events to avoid excessive output.

## Technical Notes

- Works in modern Chromium/Firefox/Safari/Edge browsers with standard DOM event APIs.
- Logs are local to your browser console; the bookmarklet itself does not send data to external services.
- Event logs can include visible text snippets and element identifiers from the current page, so use caution on sensitive pages.
- Uses global `window.__obsActive` / `window.__obsListeners` names; avoid conflicts if your page/app already uses the same globals.
- Best suited for debugging and diagnostics rather than production analytics.

## License

MIT License - See <a href="https://github.com/oaustegard/bookmarklets/blob/main/LICENSE">LICENSE</a>

## Author

Created by <a href="https://austegard.com">Oskar Austegard</a>
