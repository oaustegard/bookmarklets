# BSky Translator Bookmarklet

This bookmarklet translates non-English posts inline as you scroll a Bluesky feed or thread, appending an English rendering directly beneath each foreign-language post without leaving the page.

## Purpose

Bluesky has no built-in translation. Following accounts that post in Japanese, Portuguese, German, or anything else means either skipping their posts or copy-pasting them into a translation site one at a time. This bookmarklet turns translation into a toggle: click it once and every non-English post in view sprouts an English version underneath, including posts that load later as you scroll.

## Features

- **Inline translations** — an accent-bordered block appended after each post, tagged with the detected source language (e.g. `[ja→en] ...`)
- **Feeds and threads** — matches feed posts *and* posts on the thread detail page, where Bluesky uses a different DOM structure
- **Auto-translates on scroll** — a `MutationObserver` plus scroll listener picks up posts as Bluesky's virtualized list renders them
- **Skips English** — posts already detected as English get no translation block
- **Caches by post text** — repeated text (reposts, quote chains, re-rendered nodes) is translated once, not once per appearance
- **Serialized requests** — a single queue drainer with a 200 ms gap between calls, so a fast scroll doesn't burst the endpoint
- **Click-to-stop badge** — a floating badge in the bottom-right corner; click it (or re-run the bookmarklet) to remove every translation and restore the page
- **Clean teardown** — disconnects the observer, drops the scroll listener, removes all injected nodes and data attributes

## Installation

### Easy Mode
1. Go to the [BSky Translator Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bsky_translator.js)
2. Drag the link to your bookmarks bar

### Hard Mode
1. Copy the entire JavaScript code from the bookmarklet file at https://github.com/oaustegard/bookmarklets/blob/main/bsky_translator.js
2. Go to [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html)
3. Paste the code
4. Name the bookmarklet (e.g., "BSky Translate")
5. Drag the link to your bookmarks bar

## Usage

1. Open any Bluesky feed, profile, or thread at `https://bsky.app/`
2. Click the bookmarklet
3. A blue **EN translate: ON (click to stop)** badge appears in the bottom-right corner
4. Non-English posts get an English block appended beneath them, prefixed with the detected source language
5. Keep scrolling — newly rendered posts are translated automatically
6. To stop, either click the badge or click the bookmarklet a second time. All translation blocks and the badge are removed

## How It Works

**Post discovery.** Two selectors run against the document on every scan:

```javascript
'[data-testid="postText"],[data-testid^="postThreadItem-by-"] [data-word-wrap]'
```

Feed posts carry `data-testid="postText"`. Posts on the thread detail page do not — there the text lives in a `[data-word-wrap]` node inside a `postThreadItem-by-<handle>` container, so both shapes are matched.

**Visibility filter.** Bluesky virtualizes long lists, keeping off-screen nodes in the DOM unrendered. Each candidate is checked with `e.offsetParent || e.getClientRects().length` so only actually-rendered posts are queued.

**Change detection.** Each processed node gets its post text stamped onto `dataset.trKey`. That single attribute serves as both the "already handled" marker and the staleness check: when Bluesky recycles a node for a different post, the text no longer matches the stored key and the node is re-queued.

**Translation.** Text is sent to the public Google Translate endpoint:

```
https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=<text>
```

The response's segments are joined into one string and `j[2]` gives the auto-detected source language.

**Queue drain.** A single async drainer processes the queue serially, pausing 200 ms between network calls. Before rendering, it re-checks `isConnected` and `trKey` — the node may have been recycled while the request was in flight.

**Caching.** Results are keyed by post text in a `Map`. Negative results are cached too: if the detected source is already `en`, or the translation comes back empty or identical to the input, a `{skip:1}` sentinel is stored so the same text is never re-fetched.

**Scheduling.** A `MutationObserver` on `document.body` and a capture-phase `scroll` listener both funnel into a 250 ms debounced rescan.

**Teardown.** `window.__bskyTr.stop()` sets the loop flag to 0, disconnects the observer, removes the scroll listener and badge, deletes every `[data-bsky-tr]` block, clears every `trKey` attribute, and removes the global. Running the bookmarklet while it is already active calls `stop()` and returns, making the bookmarklet a toggle.

## Technical Notes

- **Unofficial endpoint.** `translate.googleapis.com/translate_a/single` is the undocumented endpoint the Google Translate web UI uses. It needs no API key and is CORS-permissive, but it is not a supported API — it can rate-limit or change response shape without notice. Failed requests are swallowed per-post; the rest of the queue continues.
- **Post text is sent to Google.** Every non-English post you scroll past is transmitted to Google's translation endpoint. Nothing else leaves the page and nothing is stored beyond the in-memory cache, which dies with the tab.
- **Language detection is per-post.** Short posts, emoji-heavy posts, and proper nouns are often misdetected as English and therefore skipped.
- **Cache is per-session.** Reloading the page clears it.
- **DOM-selector dependent.** Bluesky ships frequent UI changes; if translations stop appearing, the `data-testid` selectors are the first thing to check.
- Requires a modern browser (`async`/`await`, `MutationObserver`, `fetch`).

## Source Code

https://github.com/oaustegard/bookmarklets/blob/main/bsky_translator.js

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Concept and edits by [Oskar Austegard](https://austegard.com). Code and README by Claude.
