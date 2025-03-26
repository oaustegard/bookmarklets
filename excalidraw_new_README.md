# [excalidraw_new.js](excalidraw_new.js)

A bookmarklet that instantly creates a new Excalidraw collaboration room with timestamp-based cache busting.

## Features

- Creates a random room ID and secret for secure collaboration
- Adds timestamp parameter to ensure fresh loading every time
- Compatible with all major browsers
- Works with bookmark management tools that don't differentiate based on URL fragments

## Installation

### Preferred Method
Use the Bookmarklet Installer by simply navigating to:

https://austegard.com/bookmarklet-installer.html?bookmark=excalidraw_new.js

### Manual Installation
1. Create a new bookmark in your browser
2. Name it "excalidraw_new"
3. Copy the following code into the URL/location field:

```js
javascript:(function(){function randomHex(length){return Array.from(crypto.getRandomValues(new Uint8Array(length))).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,length);}function randomBase64(length){return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(Math.ceil(length*3/4))))).replace(/[+/]/g,c=>c==='+'?'-':'_').substring(0,length);}const roomId=randomHex(16);const secret=randomBase64(22);const timestamp=Date.now();window.open(`https://excalidraw.com/?_=${timestamp}#room=${roomId},${secret}`,'_blank');})();
```

4. Save the bookmark

## Usage

Simply click the "excalidraw_new" bookmarklet in your bookmarks bar to:
1. Generate a new collaborative drawing room
2. Open it in a new tab
3. Share the URL with collaborators

## How It Works

The bookmarklet:
1. Generates a cryptographically random room ID (16 hex characters)
2. Creates a secure random secret (22 URL-safe base64 characters)
3. Adds a timestamp query parameter to prevent caching issues
4. Constructs and opens the Excalidraw URL with these parameters

## Security

- Room IDs and secrets are generated using the secure `crypto.getRandomValues()` API
- The collaboration room is only accessible to those with the exact URL
- No data is stored or transmitted except through the Excalidraw URL
