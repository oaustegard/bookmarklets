# Upload Claude Skill

This bookmarklet opens the Upload Skill dialog on [claude.ai/customize/skills](https://claude.ai/customize/skills) in one click. It is intended for use anywhere on claude.ai, or any other page in your browser.

## Purpose

The primary purpose of this bookmarklet is to skip the manual navigation to the Skills page and the two-click sequence (+ menu → Upload a skill) required to reach the Upload Skill dialog. It fires the necessary pointer events to open the Radix UI dropdown and trigger the upload overlay directly.

## Features

- **Instant Navigation:** If you are not already on `claude.ai/customize/skills`, immediately redirects you there (click the bookmarklet a second time once the page loads).
- **Programmatic Dialog Trigger:** Simulates the pointer event sequence required to open the + menu and select "Upload a skill", bypassing manual interaction.
- **Error Handling:** Alerts with "Something went wrong opening the Upload Skill dialog." if the expected UI elements are not found on the page.

## Background

Claude.ai's skill upload flow suffers from unnecessary friction: from anywhere in the app you must first navigate to the Customize page, select the Skills section, click the + menu icon, and finally select "Upload a skill" — four steps before you even see the upload dialog. For a workflow that developers are likely to repeat frequently as they iterate on skills, this quickly becomes tedious.

To fix this, Claude (the AI) was asked to reverse engineer the upload flow directly in Chrome using browser automation tools. Claude inspected the live claude.ai DOM, traced the React fiber tree to identify the Radix UI components driving the dropdown, and discovered that the menu items require a precise sequence of pointer events — not just a simple `.click()` — to behave correctly. Armed with that understanding, Claude crafted a bookmarklet that replicates the exact event sequence the browser itself would produce, collapsing the entire multi-step flow into a single bookmark click.

## Installation

### Easy Install

1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_upload_skill.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install

1. Create a new bookmark in your browser.
2. Set the name to "Upload Claude Skill" or similar.
3. Set the URL to the JavaScript code found in [claude_upload_skill.js](https://github.com/oaustegard/bookmarklets/blob/main/claude_upload_skill.js).

## Usage

1. Click the "Upload Claude Skill" bookmarklet from any page.
2. If you are not on `claude.ai/customize/skills`, you will be redirected there automatically — click the bookmarklet once more after the page loads.
3. The Upload Skill dialog will open immediately, ready for a drag-and-drop or file selection upload.

## How it Works

The bookmarklet executes the following steps:

1. It checks whether the current page is `claude.ai/customize/skills`.
2. If not, it navigates directly to `https://claude.ai/customize/skills` (click again once loaded).
3. If on the correct page, it locates the "Add skill" button by its `aria-label` attribute and fires a `pointerdown` / `pointerup` / `click` sequence to open the dropdown menu.
4. After a 200ms delay to allow the Radix UI dropdown to render, it locates the "Upload a skill" menu item and fires a `pointermove` / `pointerdown` / `pointerup` / `click` sequence to select it.
5. The Upload Skill dialog appears, ready for use.
6. If either the button or the menu item cannot be found, it displays: "Something went wrong opening the Upload Skill dialog."

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
