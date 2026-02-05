# Speed Reader Bookmarklet

A bookmarklet that enables rapid reading of web articles using RSVP (Rapid Serial Visual Presentation) with a fixed-position focus point.

## The Technique: RSVP with ORP

**RSVP (Rapid Serial Visual Presentation)** displays one word at a time in a fixed location, eliminating the need for eye movement across lines of text. This allows reading speeds of 300-800+ words per minute without special training.

**ORP (Optimal Recognition Point)** is the key innovation that makes this work smoothly. Research shows that our eyes don't fixate on the center of a word—they naturally land about 25-35% from the beginning. By highlighting this "pivot letter" in red and keeping it in a fixed screen position, your eye has a stable anchor point while words flow around it.

```
Traditional reading:     RSVP with fixed ORP:

  The quick brown         |     T|h|e      |
  fox jumps over   →      |    qu|i|ck     |
  the lazy dog            |   bro|w|n      |
                          |      f|o|x      |
                               ↑
                          Red letter stays
                          in same position
```

The fixed-position approach (used by readers like Spritz) is superior to center-aligned RSVP because:
- Your eye never moves—the focus point is always in the same spot
- Short and long words feel equally natural
- Reduces cognitive load from tracking a moving target

## Usage

1. Create a bookmark with the contents of `speed_reader.js`
2. Navigate to any article or text-heavy page
3. Click the bookmarklet

## Controls

| Control | Action |
|---------|--------|
| **Play/Pause** button | Start or stop reading |
| **← 10 / 10 →** buttons | Skip backward/forward 10 words |
| **Speed slider** | Adjust from 100-800 WPM |
| **Space** | Play/Pause |
| **Left/Right arrows** | Navigate one word at a time |
| **Escape** | Close the reader |

## Tips for Speed Reading

- **Start slow**: Begin at 250-300 WPM and gradually increase
- **Don't subvocalize**: Try not to "speak" the words in your head
- **Trust your brain**: Comprehension often catches up even when it feels too fast
- **Use for appropriate content**: Works best for narrative text; technical material may need slower speeds

## How It Works

1. Extracts the main content from the page (article, main element, or body)
2. Removes navigation, sidebars, footers, and other non-content elements
3. Parses text into words while preserving paragraph/section structure
4. Displays words one at a time with the ORP letter highlighted in red at a fixed screen position
