# Speed Reader

Enables rapid reading of web articles using RSVP (Rapid Serial Visual Presentation) with a fixed-position focus point, allowing reading speeds of 300-800+ words per minute.

## Purpose

This bookmarklet transforms any article or text-heavy webpage into an immersive speed reading experience. It's useful for:

-   Consuming long-form articles and blog posts more quickly.
-   Reading through documentation or reports at an accelerated pace.
-   Training yourself to read faster without losing comprehension.
-   Focusing on content without the distraction of surrounding page elements.

## Features

-   **RSVP Display**: Shows one word at a time in a full-screen overlay, eliminating eye movement across lines.
-   **Fixed ORP (Optimal Recognition Point)**: The red focus letter stays in a fixed screen position while words flow around it.
-   **Smart Content Extraction**: Automatically finds the main article content and filters out navigation, sidebars, and footers.
-   **Adjustable Speed**: Control reading speed from 100-800 WPM via slider.
-   **Navigation Controls**: Play/pause, skip forward/backward 10 words.
-   **Keyboard Shortcuts**: Space (play/pause), arrow keys (navigate), Escape (close).
-   **Progress Tracking**: Shows word count and progress bar.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=speed_reader.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [speed_reader.js file](https://github.com/oaustegard/bookmarklets/blob/main/speed_reader.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Speed Reader").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any article or text-heavy webpage.
2.  Click the "Speed Reader" bookmarklet in your bookmarks bar.
3.  A dark overlay appears with controls. Click Play or press Space to begin.
4.  Use the speed slider to adjust WPM. Use the navigation buttons or arrow keys to move through the text.
5.  Press Escape or click the × button to close.

### Controls Reference

| Control | Action |
|---------|--------|
| **Play/Pause** button | Start or stop reading |
| **← 10 / 10 →** buttons | Skip backward/forward 10 words |
| **Speed slider** | Adjust from 100-800 WPM |
| **Space** | Play/Pause |
| **Left/Right arrows** | Navigate one word at a time |
| **Escape** | Close the reader |

## How It Works

1.  **Content Extraction**: Finds the main content element (`<main>`, `<article>`, or similar) and clones it.
2.  **Cleanup**: Removes unwanted elements like navigation, sidebars, footers, scripts, and ads.
3.  **Tokenization**: Parses text into word tokens while preserving paragraph and heading structure.
4.  **ORP Calculation**: For each word, calculates the Optimal Recognition Point (about 25-35% into the word).
5.  **Fixed-Position Display**: Renders words with the ORP letter centered in a fixed screen position, with preceding text right-aligned and following text left-aligned around it.

## The Technique: RSVP with ORP

**RSVP (Rapid Serial Visual Presentation)** displays one word at a time in a fixed location, eliminating the need for eye movement across lines of text.

**ORP (Optimal Recognition Point)** is the key innovation. Research shows that our eyes don't fixate on the center of a word—they naturally land about 25-35% from the beginning. By highlighting this "pivot letter" in red and keeping it in a fixed screen position, your eye has a stable anchor point while words flow around it.

```
Traditional reading:     RSVP with fixed ORP:

  The quick brown         |     T|h|e      |
  fox jumps over   →      |    qu|i|ck     |
  the lazy dog            |   bro|w|n      |
                          |     f|o|x      |
                                 ↑
                          Red letter stays
                          in same position
```

The fixed-position approach (used by readers like Spritz) is superior to center-aligned RSVP because:
-   Your eye never moves—the focus point is always in the same spot
-   Short and long words feel equally natural
-   Reduces cognitive load from tracking a moving target

## Tips for Speed Reading

-   **Start slow**: Begin at 250-300 WPM and gradually increase.
-   **Don't subvocalize**: Try not to "speak" the words in your head.
-   **Trust your brain**: Comprehension often catches up even when it feels too fast.
-   **Use for appropriate content**: Works best for narrative text; technical material may need slower speeds.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/speed_reader.js).
