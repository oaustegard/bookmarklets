# Bluesky Markdown Link Post Bookmarklet

[This bookmarklet](https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post.js) adds markdown link support to Bluesky, allowing you to compose posts with `[text](url)` syntax that automatically converts to clickable links.

## Features

- **Markdown link syntax** - Write `[link text](https://example.com)` and it becomes a clickable link
- **Auto-handle detection** - Automatically detects your Bluesky handle from the current session
- **Secure app password storage** - Stores your app password locally for seamless future posts
- **UTF-8 compatible** - Properly handles emoji, international characters, and complex text
- **Rich text facets** - Uses Bluesky's native rich text system for proper link rendering
- **One-time setup** - Enter your app password once, then just click and post

## Installation

### Easy Mode
1. Go to the [Bluesky Markdown Link Post Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=bsky_markdown_link_post.js)
2. Drag the link to your bookmarks bar

### Hard Mode
1. Copy the entire JavaScript code from the bookmarklet file at https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post.js
2. Go to [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
3. Paste the code
4. Name the bookmarklet
5. Drag the link to your bookmarks bar

## Setup

Before first use, you'll need to create a Bluesky App Password:

1. Go to Bluesky → Settings → Privacy & Security → App Passwords
2. Click "Add App Password"
3. Give it a name (e.g., "Markdown Bookmarklet")
4. Copy the generated password

## Usage

1. **Navigate to any Bluesky page** while logged in
2. **Click the bookmarklet** in your bookmarks bar
3. **First time only**: Enter your app password when prompted
4. **Write your post** using markdown link syntax:
   - `Check out [my website](https://austegard.com)!`
   - `Read this [great article](https://example.com) about AI`
5. **Click "Post with Links"** to publish

After the first use, the bookmarklet will remember your app password and you can post immediately without re-entering credentials.

## Examples

### Basic Link
```
Check out [my website](https://austegard.com) for more bookmarklets!
```
**Result**: "Check out my website for more bookmarklets!" (with "my website" as a clickable link)

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

## Troubleshooting

**"Unable to detect handle"**: Make sure you're logged into Bluesky and try refreshing the page

**"Authentication failed"**: Check that your app password is correct and hasn't been revoked

**"Links not clickable"**: Ensure you're using the correct markdown syntax: `[text](url)` with square brackets and parentheses

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post.js)
