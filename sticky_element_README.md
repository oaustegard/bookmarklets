# Sticky Element Bookmarklet

A bookmarklet that allows you to keep any webpage element visible while scrolling, perfect for videos, images, or text you want to reference as you explore a page.

## Purpose

This bookmarklet solves a common frustration when browsing content-rich websites: losing sight of important elements as you scroll. For example:

- Watching a video while reading comments below it
- Keeping an image visible while reading its description
- Referencing a code snippet or table while reading documentation
- Keeping navigation or controls in view on long pages

When activated, this bookmarklet lets you select any element on the page and pins it in place, so it remains visible regardless of how you scroll through the rest of the content.

## Features

- Interactive element selection with visual feedback
- Smart highlighting of nested elements for precise selection
- Automatic background color detection that preserves text legibility
- Intelligent positioning that keeps elements visible without disrupting layout
- Seamless toggling between original and sticky versions
- Top/bottom positioning based on scroll direction
- Simple Esc key cancellation
- No external dependencies
- Works across a wide variety of websites

## Installation

### Simple Installation (Recommended)

Visit [austegard.com/bookmarklet-installer.html?bookmarklet=sticky_element.js](https://austegard.com/bookmarklet-installer.html?bookmarklet=sticky_element.js) and drag the bookmarklet to your bookmarks bar.

### Manual Install (Alternative)

1. Create a new bookmark in your browser
2. Name it "Sticky Element" (or any name you prefer)
3. Copy the entire code from [sticky_element.js](https://github.com/oaustegard/bookmarklets/blob/main/sticky_element.js)
4. Paste it as the URL/location of the bookmark
5. Save the bookmark

## Usage

1. Navigate to any webpage with content you want to keep visible
2. Click the "Sticky Element" bookmarklet in your bookmarks bar
3. A selection mode activates with the message "Hover over an element and click to make it sticky"
4. As you move your mouse, elements will be highlighted with colored outlines
5. Click on the element you want to keep visible
6. The element becomes "sticky" and will remain visible as you scroll
7. Press Esc at any time to return to normal browsing

## How It Works

The bookmarklet operates in two phases:

### Selection Phase
1. Creates a transparent overlay to capture mouse events
2. Detects elements under the cursor and highlights them with colored borders
3. Shows nested element structure to allow precise selection
4. Prevents events from reaching the underlying page

### Sticky Phase
1. Creates a clone of the selected element
2. Analyzes the original element's background and text colors
3. Shows the clone only when the original would scroll out of view
4. Positions the clone intelligently based on scroll direction
5. Maintains the exact horizontal position of the original element
6. Provides visual feedback with a subtle green border and "STICKY" label

## Technical Details

- Uses `getComputedStyle()` to detect and preserve original element styling
- Creates clones rather than modifying original elements to avoid layout disruption
- Employs visibility tracking to seamlessly switch between original and cloned elements
- Uses event delegation and capture for efficient interaction handling
- Built with vanilla JavaScript with no external dependencies
- Works across modern browsers

## Privacy & Security

The bookmarklet runs entirely in your browser - no data is sent to any server. It:
1. Only interacts with the current page's DOM
2. Uses standard browser APIs
3. Creates no persistent storage
4. Adds no tracking or analytics

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/sticky_element.js)

## License

Licensed under the MIT License - see [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)
