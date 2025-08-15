# Bluesky Markdown Link Post Bookmarklet

A bookmarklet that adds markdown link support to Bluesky with smart context awareness. Write `[text](url)` syntax and it automatically converts to clickable links. When viewing a post, get options to reply or quote; otherwise create new posts.

## Features

- **Context-aware actions** - Reply/quote buttons on post pages, post button elsewhere
- **Markdown link syntax** - Write `[link text](https://example.com)` and it becomes a clickable link
- **Auto-handle detection** - Automatically detects your Bluesky handle from the current session
- **Secure app password storage** - Stores your app password locally for seamless future posts
- **UTF-8 compatible** - Properly handles emoji, international characters, and complex text
- **Rich text facets** - Uses Bluesky's native rich text system for proper link rendering
- **Thread-aware replies** - Maintains proper reply chains in conversations
- **Quote post support** - Creates quote posts with embedded references

## Installation

### Easy Mode
1. Go to the [Bluesky Markdown Link Post Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bsky_markdown_link_post.js)
2. Optionally rename the bookmarklet (click the name field)
3. Drag the "**Bsky markdown link post**" link to your bookmarks bar

### Manual Mode
1. Copy the entire JavaScript code from the bookmarklet file
2. Create a new bookmark in your browser
3. Set the URL to the copied JavaScript code (starting with `javascript:`)
4. Name the bookmark and save to your bookmarks bar

## Setup

Before first use, you'll need to create a Bluesky App Password:

1. Go to Bluesky → Settings → Privacy & Security → App Passwords
2. Click "Add App Password"
3. Give it a name (e.g., "Markdown Bookmarklet")
4. Copy the generated password

## Usage

### On Any Page (Creates New Post)
1. **Navigate to any Bluesky page** while logged in
2. **Click the bookmarklet** - shows "Post" button only
3. **First time only**: Enter your app password when prompted
4. **Write your post** using markdown link syntax
5. **Click "Post"** to publish as a new post

### On a Post Page (Reply/Quote Options)
1. **Navigate to a specific post** (URL like `https://bsky.app/profile/handle/post/abc123`)
2. **Click the bookmarklet** - shows "Reply" and "Quote" buttons only
3. **Write your content** with markdown links as usual
4. **Choose your action**:
   - **Click "Reply"** - Creates a threaded reply to the post
   - **Click "Quote"** - Creates a quote post with the original embedded

## Examples

### Basic Link
```
Check out [my repo](https://github.com/oaustegard/bookmarklets) for more bookmarklets!
```
**Result**: 
> Check out [my repo](https://github.com/oaustegard/bookmarklets) for more bookmarklets!

### Reply with Links
When viewing someone's post about AI:
```
Great points! I'd add that [this research](https://example.com/ai-study) supports your argument.
```
**Result**: A threaded reply with "this research" as a clickable link

### Quote Post with Commentary
When viewing a news article post:
```
This is exactly what I was talking about in [my previous post](https://bsky.app/profile/you/post/xyz). The trend is accelerating.
```
**Result**: A quote post showing the original embedded, with your commentary and link

### Multiple Links
```
Follow me on [Bluesky](https://bsky.app/profile/austegard.com) and check out my [GitHub](https://github.com/oaustegard)!
```
**Result**: Both "Bluesky" and "GitHub" become clickable links

### With Emoji and International Text
```
🎉 Exciting news! Read about [AI advances](https://example.com) in français: [l'article](https://example.fr)
```
**Result**: Properly handles emoji and international characters while creating working links

## How It Works

### Context Detection
The bookmarklet automatically detects if you're on a post page by analyzing the URL pattern:
- `https://bsky.app/profile/{handle}/post/{postId}` = **Post page detected**
- Any other URL = **Regular new post mode**

### User Experience

**On regular pages**: 
- Shows single "Post" button
- Creates new posts with markdown link support

**On post pages**: 
- Shows "Reply" and "Quote" buttons  
- Reply creates threaded responses
- Quote creates posts with embedded original
- No "new post" option (keeps focus on the current post)

### Reply Threading
When replying, the bookmarklet:
1. Extracts the post handle and ID from the current URL
2. Resolves the handle to a DID (decentralized identifier)
3. Fetches the original post's metadata (URI and CID)
4. Checks if the original post is part of a thread
5. Sets proper `parent` and `root` references for correct threading

### Quote Post Embedding
When quote posting, the bookmarklet:
1. Fetches the original post's metadata
2. Embeds it using Bluesky's `app.bsky.embed.record` format
3. Your text appears above the embedded original post

## Security Notes

- **App passwords are stored locally** in your browser's localStorage
- **App passwords are scoped per handle** - if you use multiple accounts, each gets its own stored password
- **App passwords can be revoked** anytime in Bluesky settings if needed
- **No data leaves your browser** except the API calls to post to Bluesky

## Technical Details

- Automatically detects your current Bluesky handle from localStorage (`bsky-handle` key)
- Converts markdown `[text](url)` syntax to Bluesky's rich text facets system
- Uses proper UTF-8 byte indexing for international character support
- Stores app passwords with format: `bsky_app_pass_{handle}`
- Creates authenticated sessions using Bluesky's official API endpoints
- Falls back gracefully if handle detection fails

### API Endpoints Used
- `com.atproto.identity.resolveHandle` - Convert handle to DID
- `com.atproto.repo.getRecord` - Fetch post metadata  
- `com.atproto.server.createSession` - Authentication
- `com.atproto.repo.createRecord` - Create posts/replies/quotes

### Thread Structure
Replies include a `reply` field with:
```json
{
  "reply": {
    "parent": { "uri": "at://...", "cid": "..." },
    "root": { "uri": "at://...", "cid": "..." }
  }
}
```

### Quote Post Structure  
Quote posts include an `embed` field with:
```json
{
  "embed": {
    "$type": "app.bsky.embed.record",
    "record": { "uri": "at://...", "cid": "..." }
  }
}
```

## Troubleshooting

**"Unable to detect handle"**: Make sure you're logged into Bluesky and try refreshing the page

**"Authentication failed"**: Check that your app password is correct and hasn't been revoked

**"Failed to fetch post data"**: The post might be deleted, private, or the URL might be malformed

**"Post not detected"**: Make sure you're on a URL like `bsky.app/profile/handle/post/postid`

**"Links not clickable"**: Ensure you're using the correct markdown syntax: `[text](url)` with square brackets and parentheses

**Reply not threaded properly**: This can happen if the original post was deleted or if there are network issues fetching metadata

## Limitations

- **Requires JavaScript** - Won't work with JavaScript disabled
- **Bluesky domain only** - Only works on bsky.app pages  
- **Public posts only** - Cannot access private or deleted posts for replies/quotes
- **Browser storage dependent** - Clearing browser data removes stored passwords

## Purpose

This bookmarklet enhances the user experience on the BlueSky social platform by enabling the use of Markdown link syntax (`[text](url)`) for creating posts, replies, and quote posts. It intelligently adapts its functionality based on whether the user is viewing a specific post or browsing other parts of the site.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post.js)

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
