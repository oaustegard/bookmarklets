# Page Eruption Effect

Creates a visual "eruption" effect on the current webpage, featuring a particle firework and jumping text elements, triggered by a click or automatically on load.

## Purpose

This bookmarklet is primarily a visual toy or a fun effect to apply to a webpage. It can be used to:

-   Add a playful, dynamic effect to a static page.
-   Demonstrate JavaScript's ability to manipulate DOM elements for animation.

## Features

-   **Firework Particle Effect**: Generates a burst of colored particles at the click location (or center of the screen for the initial effect). Particles animate outwards and fade.
-   **Text Eruption**: Visible text elements on the page briefly jump up and then settle back down.
-   **Click Triggered**: After the initial eruption, subsequent eruptions are triggered by clicking anywhere on the page.
-   **Style Reset**: Adds minimal CSS to ensure `position: relative` for animated text elements without interfering broadly with page styles.
-   **Performance Consideration**: Limits effect to visible text elements and staggers text animations.
-   **Cleanup Function**: Exposes `window._cleanupEruption` to remove event listeners and styles, stopping the effect.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=erupt.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [erupt.js file](https://github.com/oaustegard/bookmarklets/blob/main/erupt.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Erupt!").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage.
2.  Click the "Erupt!" bookmarklet.
    *   After a brief delay (500ms), an initial eruption effect will occur near the center of the screen.
3.  Click anywhere on the page to trigger subsequent eruptions at the mouse cursor's location.
4.  To stop the effect and remove listeners, you can open your browser's developer console and execute `window._cleanupEruption();`.

## How It Works

1.  **CSS Injection**:
    *   Creates a `<style>` tag with a rule for `.erupting-text { position: relative !important; transition: transform 0.3s ease-out !important; }` to enable smooth animation of text elements.
2.  **`createFirework(x, y)` Function**:
    *   Takes click coordinates `x`, `y`.
    *   Constrains coordinates to be within a margin from viewport edges.
    *   Creates 30 `<div>` elements (particles) with random colors from a predefined set.
    *   Positions particles at `(x, y)` with `position: fixed` and high `z-index`.
    *   Animates each particle:
        *   Calculates an angle and velocity for outward movement.
        *   Uses `requestAnimationFrame` for smooth animation.
        *   Particles move, fade (`opacity *= 0.98`), and are removed when nearly transparent.
3.  **`getTextElements()` Function**:
    *   Uses `document.createTreeWalker` to find all elements that contain direct text nodes and are visible (not `display: none`).
4.  **`erupt(e)` Function**:
    *   `isErupting` flag prevents multiple simultaneous eruptions.
    *   Determines `x, y` from mouse event `e` or defaults to screen center.
    *   Filters `getTextElements()` to only those currently visible in the viewport.
    *   Adds `erupting-text` class to these elements.
    *   Calls `createFirework(x, y)`.
    *   Animates visible text elements:
        *   Iterates through elements, applying a `translateY(-10px)` transform with a slight delay (`i * 50ms`) for each.
        *   Resets the transform after 300ms.
    *   Resets `isErupting` flag after the animation duration.
5.  **Event Listener & Initial Trigger**:
    *   Adds a `click` listener to `document.body` that calls `erupt`.
    *   Schedules an initial `erupt()` call after 500ms.
6.  **`window._cleanupEruption` Function**:
    *   Removes the click listener and the injected `<style>` tag.
    *   Removes the `erupting-text` class and resets transforms on affected elements.

## Technical Notes

-   The effect is purely visual and temporary.
-   Uses `requestAnimationFrame` for smoother particle animations.
-   The `TreeWalker` API is an efficient way to find specific types of DOM nodes.
-   The `z-index: 2147483647` for particles aims to place them on top of most page content.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/erupt.js).
