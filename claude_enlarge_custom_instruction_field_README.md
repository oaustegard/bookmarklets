# Claude Custom Instructions Enlarger

A simple bookmarklet that enlarges the Custom Instructions textarea in Claude Projects to make editing large instructions more convenient.

## Purpose

This bookmarklet solves a common minor frustration when working with Claude Projects: the default Custom Instructions textarea is too small for comfortable editing of longer instructions. You know and I know we should manage these in an IDE, but... 

When activated, this bookmarklet:

- Enlarges the Custom Instructions textarea to an optimal size
- Makes the textarea resizable so you can adjust it further
- Adjusts the containing dialog to properly accommodate the larger textarea

## Installation

### Easy Install
1. Visit the [Claude Custom Instructions Enlarger Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_enlarge_custom_instruction_field.js)
2. Drag the created bookmarklet link to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Claude Enlarge CI" or similar.
3. Set the URL to the JavaScript code found in [`claude_enlarge_custom_instruction_field.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_enlarge_custom_instruction_field.js).

## Usage

1. Go to any Claude Project
2. Open the Custom Instructions dialog 
3. Click the bookmarklet in your bookmarks bar
4. The textarea will immediately resize for better editing

## How It Works

The bookmarklet:
1. Finds the textarea by searching for elements with numeric IDs
2. Sets optimal dimensions and makes it resizable
3. Adjusts the containing dialog to properly fit the enlarged textarea
4. Ensures layout recalculation for proper display

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_enlarge_custom_instruction_field.js)

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
