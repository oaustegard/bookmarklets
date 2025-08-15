# Speed Up HTML5 Videos

Increases the playback speed of all HTML5 `<video>` elements on the current page, including those within accessible iframes. Each click multiplies the current speed by 1.5.

## Purpose

This bookmarklet allows users to quickly increase the playback speed of videos embedded on webpages. It's useful for:

-   Watching lectures or presentations at a faster pace.
-   Quickly skimming through video content.
-   Overriding sites that don't offer playback speed controls or have limited options.

## Features

-   **Targets All Videos**: Affects all `<video>` tags found on the page.
-   **iframe Traversal**: Recursively searches within `<iframe>` elements for videos (if accessible due to same-origin policy).
-   **Cumulative Speed Increase**: Each time the bookmarklet is clicked, the playback rate of found videos is multiplied by 1.5 relative to their *current* speed. For example:
    -   1st click: 1x -> 1.5x
    -   2nd click: 1.5x -> 2.25x
    -   3rd click: 2.25x -> 3.375x
    -   And so on.
-   **Console Logging**: Logs the video elements found and their new playback rates (uses an embedded `_c` console alias).

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=speed_up_video.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [speed_up_video.js file](https://github.com/oaustegard/bookmarklets/blob/main/speed_up_video.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Speed Up Video x1.5").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a webpage that contains one or more HTML5 videos.
2.  Play a video (or ensure it's loaded enough to have playback controls).
3.  Click the "Speed Up Video x1.5" bookmarklet.
    *   The playback speed of all videos on the page should increase.
4.  Click the bookmarklet again to further increase the speed.
5.  To reset the speed, you would typically need to reload the page or use the video player's own controls (if available and still functional).

## How It Works

1.  **Injects Console Alias**: Adds `_c` as an alias for `window.console`.
2.  **`findVideosInIframes(doc)` Function**:
    *   This is a recursive function that takes a `document` object as an argument.
    *   **iframe Search**: It gets all `<iframe>` elements in the current `doc`. For each iframe, it recursively calls `findVideosInIframes(iframe.contentDocument)`. This is wrapped in a `try...catch` because accessing `contentDocument` of cross-origin iframes will throw a security error.
    *   **Video Search**: It gets all `<video>` elements in the current `doc`.
    *   **Increase Speed**: For each video found, it sets `video.playbackRate *= 1.5;`.
    *   Logs the video element and its new `playbackRate` to the console.
3.  **Initial Call**: Calls `findVideosInIframes(document)` to start the process from the main page document.

## Technical Notes

-   The ability to control videos inside iframes is limited by the browser's same-origin policy. If an iframe is from a different domain than the parent page, the bookmarklet won't be able to access its content and thus won't affect videos inside it.
-   Some custom video players might override or interfere with direct manipulation of the `<video>` element's `playbackRate`.
-   There's no built-in way to slow down or reset the speed with this bookmarklet other than reloading the page.
-   Repeatedly clicking can lead to extremely high playback rates that might not be practical or performant.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/speed_up_video.js).
