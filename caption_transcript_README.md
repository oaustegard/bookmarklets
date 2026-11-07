# Caption Transcript

Finds the main video on the current page, loads its whole caption track by seeking through the video, and downloads a timestamped transcript as a `.txt` file.

## Purpose

Streaming players such as Mux (hls.js) load captions as WebVTT chunks near the playhead, so a freshly opened lesson page holds only a few minutes of cues. The chunk URLs are signed, so fetching them directly is not an option. This bookmarklet drives the player instead: it seeks through the video while muted and paused, copies cues out of the caption track after each seek, and writes them out as one transcript. Everything runs in the page; nothing is sent anywhere.

Use it to save a transcript of a course lesson or recorded talk, search a long video for a passage, or feed the text to another tool.

## Features

- **Finds the video anywhere on the page**: walks the document, every open shadow root, and same-origin iframes. With several videos, it takes the one with the longest duration, and waits up to 3 s for metadata.
- **Picks the English caption track**: prefers a `subtitles` or `captions` track whose language starts with `en` or whose label contains "English" or "CC", then any subtitle track. Chapters, metadata and description tracks are ignored.
- **Two-pass scrub**: pass 1 seeks every 600 s across the video. Pass 2 finds gaps of more than 20 s between cues (including before the first and after the last cue) and seeks into each at 100 s intervals, for up to 3 rounds or until a round adds nothing.
- **Adaptive waits**: after each seek it waits until no new cues have arrived for 1.2 s (3 s before the first new cue), with a 6 s cap per seek.
- **Per-seek harvest**: cues are copied after every seek, so players that drop cues or disable the track between loads lose nothing.
- **Reports what it could not fill**: remaining gaps over 20 s are listed in the transcript header.
- **Leaves the page as it found it**: position, play/pause, mute, playback rate and every track's mode are restored on success, error or cancel. The progress overlay is removed afterwards.
- **Progress overlay with Cancel**: shows the pass, position, duration and cue count. Cancel stops the run without downloading.
- **Single run**: clicking the bookmark again while it runs does nothing.

## Installation

### Easy Mode
1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=caption_transcript.js)
2. Drag the created bookmarklet to your bookmarks bar.

Or open [`install/caption_transcript.html`](install/caption_transcript.html) locally and drag the button from there.

### Hard Mode
1. Create a new bookmark named "Caption Transcript".
2. Paste the one-line URL from [`install/caption_transcript.url`](https://github.com/oaustegard/bookmarklets/blob/main/install/caption_transcript.url) as its address, or paste the source from [`caption_transcript.js`](https://github.com/oaustegard/bookmarklets/blob/main/caption_transcript.js) into the [generic installer](https://austegard.com/web-utilities/bookmarklet-installer.html).

### Rebuilding the minified URL
```
cd tools && npm install && node build_bookmarklet.mjs ../caption_transcript.js
```
This writes `install/caption_transcript.url` and `install/caption_transcript.html`. The build fails if the source contains a `//` comment.

## Usage

1. Open the page with the video and let the player load (the video does not need to be playing).
2. Click the bookmarklet. An overlay appears in the top-right corner.
3. Wait. A 70-minute video takes one to two minutes.
4. The transcript downloads as `<page-title>-transcript.txt` and is also copied to the clipboard when the browser allows it. The clipboard copy usually fails after a long run because the click that started it has expired; the download is the main output.

The file starts with a header (title, URL without query string or fragment, duration, cue count, track, capture date, uncaptioned gaps, and a note that automatic captions contain recognition errors). The body is one paragraph per minute, each starting with an `[hh:mm:ss]` marker.

## How It Works

1. Collects `<video>` elements through `querySelectorAll('*')`, recursing into `shadowRoot` and `iframe.contentDocument` (cross-origin access throws and is skipped).
2. Saves the playback state, mutes and pauses, and sets the chosen track to `hidden` so cues load without being drawn. If `hidden` yields no cues at position 0, it switches to `showing` and continues.
3. For each seek, it sets `currentTime`, then polls `track.cues` every 200 ms, copying each cue into a map keyed on `startTime|text`. Cue text is stripped of VTT tags and entities and its whitespace collapsed.
4. Pass 2 sorts the collected cues, computes gaps over 20 s, and seeks into them. Positions already visited are not revisited, so a silent stretch ends the loop instead of being retried.
5. Output sorts cues by start time, merges a repeated line that continues the previous cue (rolling captions), starts a new `[hh:mm:ss]` paragraph every 60 s, and downloads a `Blob` through a temporary `<a download>` link.

## Technical Notes

- **Not reachable**: captions burned into the video pixels, DRM streams whose text tracks are not exposed, and players that only create cues during real playback or user interaction.
- **Cross-origin iframes** (YouTube and Vimeo embeds) cannot be reached from the host page. On youtube.com itself the page's own transcript panel is simpler.
- **Silent stretches** show up as gaps in the header. A gap shorter than 20 s is not searched.
- The bookmarklet reads no cookies or storage and makes no network requests of its own; the player fetches caption chunks as it normally would.
- Tested headless in Chromium against a plain `<track default>` page (360 of 360 cues, first pass only) and a simulated lazy-loading shadow-DOM player (535 of 536 cues, both planted silences reported as gaps; the missed cue sat in a 3 s hole below the gap threshold), plus no-video, cancel, and double-click cases.

## Source Code

[`caption_transcript.js`](https://github.com/oaustegard/bookmarklets/blob/main/caption_transcript.js)

## License

MIT

## Author

Concept and edits by [Oskar Austegard](https://austegard.com). Code and README by Claude.
