# BlueSky Lists Viewer Bookmarklet

This bookmarklet displays all the lists created by any BlueSky user in a convenient modal overlay, making it easy to discover and browse user-curated lists without navigating through profile menus.

**It is completely pointless because the functionality already exists on the user's profile page -- it's just that not many profiles _have_ lists. :-(**

## Features

- **One-click list discovery** - View all lists created by any BlueSky user instantly
- **Native BlueSky styling** - Seamlessly integrates with BlueSky's dark theme and design language
- **List previews** - Shows list name, description, creation date, and avatar
- **Direct navigation** - Click any list to open it in a new tab
- **Smart profile detection** - Automatically detects the current profile page
- **Responsive design** - Works perfectly on desktop and mobile devices
- **Keyboard accessible** - Close with Escape key or click outside

## Installation

### Easy Mode
1. Go to the [BlueSky Lists Viewer Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=bsky_user_lists.js)
2. Drag the link to your bookmarks bar

### Hard Mode
1. Copy the entire JavaScript code from the bookmarklet file
2. Go to [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
3. Paste the code
4. Name the bookmarklet (e.g., "BlueSky Lists")
5. Drag the link to your bookmarks bar

## Usage

1. Navigate to any BlueSky profile page (e.g., `https://bsky.app/profile/austegard.com`)
2. Click the bookmarklet in your bookmarks bar
3. The lists viewer will open automatically, showing:
   - Total number of lists found
   - Each list with its name, description, and creation date
   - List avatars (if available)
4. Click any list item to open it in a new tab
5. Close the viewer by:
   - Clicking the X button
   - Pressing the Escape key
   - Clicking outside the modal

## Examples

- **Discover topic-specific lists**: Browse lists created by subject matter experts to find curated accounts in their field
- **Find community lists**: See what lists active community members have created
- **Explore user interests**: Get insights into what topics a user finds worth organizing

## Error Handling

The bookmarklet handles various scenarios gracefully:
- **Wrong page**: Shows alert if not on a profile page
- **No lists found**: Displays friendly empty state message
- **Network errors**: Shows clear error message with troubleshooting info
- **API issues**: Provides detailed error information for debugging

## Technical Details

- Uses BlueSky's AT Protocol APIs to fetch list data
- Resolves user handles to DIDs (Decentralized Identifiers) automatically
- Styled with native BlueSky color scheme and typography
- Implements proper loading states and error handling
- Fully responsive with mobile-optimized touch targets
- Uses semantic HTML for accessibility
- Includes hover animations and visual feedback

## Privacy & Security

- No data is stored or transmitted to external servers
- All API calls go directly to BlueSky's official endpoints
- Runs entirely in your browser with no external dependencies
- No tracking or analytics included
