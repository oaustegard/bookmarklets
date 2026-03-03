# XCancel Thread Scraper & Renderer

A two-part bookmarklet workflow for scraping and exporting threaded conversations from [xcancel.com](https://xcancel.com) (an alternative X/Twitter frontend).

## Overview

Because xcancel.com paginates long threads behind "Load more" links, capturing an entire conversation requires multiple passes. This pair of bookmarklets solves that problem:

| Step | Bookmarklet | Purpose |
|------|------------|---------|
| 1 | **[xcancel_scrape_thread.js](https://github.com/oaustegard/bookmarklets/blob/main/xcancel_scrape_thread.js)** | Scrapes visible tweets into session storage, accumulating across pages |
| 2 | **[xcancel_render_scraped_thread.js](https://github.com/oaustegard/bookmarklets/blob/main/xcancel_render_scraped_thread.js)** | Renders the collected tweets and provides copy/download export options |

## Installation

Install both bookmarklets via the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html):
- [Install Scrape XCancel Thread](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=xcancel_scrape_thread.js)
- [Install Render XCancel Scraped Thread](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=xcancel_render_scraped_thread.js)

Drag each generated link to your browser's bookmarks bar.

## Usage Workflow

### Step 1: Scrape the Thread

1. Navigate to a thread page on xcancel.com (e.g., `https://xcancel.com/user/status/123456`).
2. Click the **Scrape XCancel Thread** bookmarklet.
3. An alert confirms how many tweets were added and the running total.
4. If the thread has more replies, click **"Load more"** on the page to reveal the next batch.
5. Click the bookmarklet again to scrape the newly visible tweets.
6. Repeat steps 4-5 until all replies are captured.

The scraper is additive — each run appends only new (unseen) tweets to the collection, so you can safely run it multiple times on the same page without duplicates.

### Step 2: Render & Export

1. Once all tweets are collected, click the **Render XCancel Scraped Thread** bookmarklet.
2. A full-screen overlay displays the scraped thread organized into question-reply thread groups.
3. Use the toolbar buttons to export:
   - **Copy JSON** — copies the structured thread data to the clipboard
   - **Download JSON** — saves the data as `xcancel-threads.json`
   - **Copy Plain Text** — copies a human-readable formatted version
   - **Clear Storage** — removes all stored data from session storage
4. Click **Close** (or the **✕** button) to dismiss the overlay.

## How It Works

### Scraper (`xcancel_scrape_thread.js`)

The scraper targets `div.timeline-item` elements on the page and extracts:

| Field | Source | Description |
|-------|--------|-------------|
| `id` | `a.tweet-link` href | Unique tweet/status ID |
| `username` | `a.username` | The @handle |
| `fullname` | `a.fullname` | Display name |
| `timestamp` | `span.tweet-date a` title attribute | Post date/time |
| `content` | `.tweet-content` | The tweet text |
| `isThreadLine` | CSS class `thread-line` | Whether the tweet is the OP's continuation |
| `isThread` | CSS class `thread` | Whether the tweet is part of a thread group |
| `isThreadLast` | CSS class `thread-last` | Whether the tweet is the last in a thread group |

Data is stored in `sessionStorage` under the key `xcancelScrape` as a JSON object:

```json
{
  "url": "/user/status/123456",
  "tweets": [
    {
      "id": "123456",
      "username": "@user",
      "fullname": "Display Name",
      "timestamp": "Mar 1, 2026 · 10:30 AM UTC",
      "content": "Tweet text...",
      "isThreadLine": true,
      "isThread": false,
      "isThreadLast": false
    }
  ]
}
```

If you navigate to a different thread URL, the stored data resets automatically to prevent mixing threads.

### Renderer (`xcancel_render_scraped_thread.js`)

The renderer reads the scraped data from session storage and:

1. **Groups tweets into threads** using the `isThreadLine`, `isThread`, and `isThreadLast` flags. Each group consists of a "question" tweet followed by its replies.
2. **Renders an overlay UI** styled to resemble X/Twitter's dark theme, with:
   - Question tweets displayed prominently with blue-highlighted author names
   - Replies indented with a blue left border
   - Tweet content displayed with preserved whitespace
3. **Provides export options** in multiple formats (JSON and plain text).

### Plain Text Export Format

The plain text export produces output in this format:

```
--- Thread 1 ---
[Display Name @user · Mar 1, 2026 · 10:30 AM UTC]
Original tweet content here

  ↳ [Reply Author @reply_user · Mar 1, 2026 · 10:45 AM UTC]
  Reply content here

--- Thread 2 ---
...
```

## Notes

- Both bookmarklets operate on **xcancel.com** only (per the `@domains` metadata).
- Data is stored in **session storage**, meaning it persists across page navigations within the same tab but is cleared when the tab is closed.
- The scraper uses **deduplication** via tweet IDs, so running it multiple times on the same page is safe.
- The renderer **escapes HTML** in tweet content to prevent rendering issues.

## Credits

Created by Oskar Austegard ([@oaustegard](https://github.com/oaustegard))
