# Video Controls

Adds a full-featured control bar to all HTML5 `<video>` elements on a page. Designed for sites (like Bluesky) that embed videos with minimal or no playback controls.

## Purpose

Many sites embed HTML5 videos with autoplay and no visible controls — no seek bar, no speed control, no time display. This bookmarklet injects a hover-activated control bar onto every video on the page, giving you full playback control without leaving the site.

## Features

-   **Play/Pause**: Toggle playback with a ▶/⏸ button.
-   **Seek Bar**: Click anywhere on the progress bar to jump to that point in the video.
-   **Time Display**: Shows current position and total duration (e.g., `1:23 / 4:56`).
-   **Playback Speed**: Cycle through 0.25×, 0.5×, 1×, 1.5×, 2× with a single click.
-   **Mute Toggle**: 🔇/🔊 button to mute and unmute audio.
-   **Loop Toggle**: 🔁 button to enable/disable looping (visual opacity indicates state).
-   **Full Page View**: ⛶ button opens a canvas-based full-page overlay with its own control bar, preserving aspect ratio. Escape key exits.
-   **Fullscreen**: ⬜ button for native browser fullscreen on the video container.
-   **Hover to Reveal**: Controls fade in on mouse hover and fade out when the cursor leaves, keeping the video clean.
-   **Idempotent**: Re-clicking the bookmarklet won't duplicate controls — it alerts that controls are already active.
-   **Bluesky-Aware**: Targets the `[aria-label="Embedded video player"]` container used by Bluesky, and hides the redundant "Pause GIF" button when present.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=video_controls.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [video_controls.js file](https://github.com/oaustegard/bookmarklets/blob/main/video_controls.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Video Controls").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a page with HTML5 videos (e.g., a Bluesky feed with embedded video posts).
2.  Click the "Video Controls" bookmarklet.
3.  An alert confirms how many videos received controls.
4.  Hover over any video to reveal the control bar at the bottom.
5.  Use ⛶ for a full-page cinema view with its own larger control bar.

## How It Works

1.  **Detection**: Queries all `<video>` elements on the page. Alerts and exits if none are found.
2.  **Control Bar Injection**: For each video, creates an absolutely-positioned `<div>` overlay anchored to the video's container with play/pause, seek, time, speed, mute, loop, full-page, and fullscreen controls.
3.  **Full Page Mode**: Creates a fixed overlay with a `<canvas>` element that mirrors the video via `requestAnimationFrame` + `drawImage`, maintaining the original aspect ratio. Includes a bottom control bar with synced state (play/pause, speed, mute, loop all stay in sync with the inline controls).
4.  **State Sync**: Speed, mute, and loop state is synchronized between the inline control bar and the full-page control bar.

## Technical Notes

-   The full-page view uses a canvas mirror rather than moving the video element, avoiding layout disruption.
-   Speed presets are fixed at `[0.25, 0.5, 1, 1.5, 2]` — cycling wraps around.
-   The control bar uses `z-index: 10001` to sit above most page elements; the full-page overlay uses `z-index: 999999`.
-   Videos are marked with `data-augmented="true"` to prevent duplicate injection.
-   On Bluesky, the bookmarklet hides the native "Pause GIF" button which conflicts with the injected controls.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/video_controls.js).
