# BlueSky Profile Latest Posts Bookmarklet

[This bookmarklet](https://github.com/oaustegard/bookmarklets/blob/main/bsky_profile_latest_posts.js) adds hover functionality to BlueSky profile links, showing a popup with the user's latest posts when you hover over their profile.

## Features

- **Hover to Preview** - Simply hover over any profile link for 0.5 seconds to see their latest posts
- **Latest Posts Only** - Shows only original posts (no replies, reposts, or quotes) using the `posts_no_replies` filter
- **Smart Positioning** - Dialog appears to the right of your cursor and automatically adjusts if it would go off-screen
- **Post Details** - Shows relative timestamps, full post text, and engagement stats (replies, reposts, likes, quotes)
- **Native Styling** - Matches BlueSky's dark theme perfectly
- **Toggle Control** - Press Escape to disable/enable hover functionality
- **Dynamic Updates** - Automatically works with new profile links loaded via AJAX
- **Profile Context** - Shows user's avatar, display name, and handle in the dialog header

## Installation

### Easy Mode
1. Go to the [BlueSky Profile Latest Posts Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=bsky_profile_latest_posts.js)
2. Drag the link to your bookmarks bar

### Hard Mode
1. Copy the entire JavaScript code from the bookmarklet file at https://github.com/oaustegard/bookmarklets/blob/main/bsky_profile_latest_posts.js
2. Go to [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
3. Paste the code
4. Name the bookmarklet
5. Drag the link to your bookmarks bar

## Usage

1. Click the bookmarklet while on any BlueSky page with profile links (feeds, lists, search results, etc.)
2. Hover over any profile link for about half a second
3. A dialog will appear showing their 5 most recent original posts
4. Move your mouse away from both the profile link and dialog to hide it
5. Press **Escape** to toggle the hover functionality on/off

## Examples

Works great on:
- **User Lists** - Hover over profiles in your lists to see their recent activity
- **Feed Posts** - Preview what users have been posting lately before following
- **Search Results** - Quick preview of users found in search
- **Reply Threads** - See recent posts from people in conversations
- **Following/Followers Lists** - Check activity without visiting each profile

## Controls

- **Hover Delay**: 500ms delay before showing dialog (prevents accidental triggers)
- **Escape Key**: Toggle hover functionality on/off
- **Mouse Control**: Dialog stays visible when hovering over it, hides when you move away
- **Smart Positioning**: Automatically repositions if dialog would appear off-screen

## Technical Details

- Uses BlueSky's public API: `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed`
- Fetches 5 most recent posts with `filter=posts_no_replies` parameter
- Handles both username handles and DID identifiers automatically
- Styled to match BlueSky's native dark theme with proper spacing and typography
- Uses MutationObserver to detect dynamically loaded content
- Includes robust error handling and loading states
- Console logging for debugging and status updates

## Purpose

This bookmarklet enhances the BlueSky browsing experience by allowing users to quickly preview a user's latest original posts without navigating to their profile. By simply hovering over a profile link, a pop-up dialog displays their most recent content, making it easier to decide whether to follow someone or engage with their posts.

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
