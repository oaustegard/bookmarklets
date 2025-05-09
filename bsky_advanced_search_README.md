# BlueSky Advanced Search Bookmarklet

[This bookmarklet](https://github.com/oaustegard/bookmarklets/blob/main/bsky_advanced_search.js) adds an advanced search panel to BlueSky, giving you easy access to all the powerful search features available on the platform.
See [Bsky announcement](https://bsky.app/profile/austegard.com/post/3loqrukzbbk25)


![bafkreibp3hbxcvh5c4osmwgadkb5l3liid3kzddizuffruoxtb74l7tppq](https://github.com/user-attachments/assets/484e5340-00d8-45f4-ab1e-473fd9d44d40)


## Features

- **Exact phrase search** - Search for exact phrases by wrapping terms in quotes
- **Hashtag search** - Find posts with specific hashtags
- **User search** - Search for posts from specific users or mentioning users
- **URL/Domain search** - Find posts containing specific URLs or from specific domains
- **Language filtering** - Filter results by language
- **Date range filtering** - Search within specific date ranges
- **Auto-population** - If you're already on a search page, the form will populate with your current search parameters

## Installation

### Easy Mode
1. Go to the [BlueSky Advanced Search Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=bsky_advanced_search.js)
2. Drag the link to your bookmarks bar
### Hard Mode
1. Copy the entire JavaScript code from the bookmarklet file at https://github.com/oaustegard/bookmarklets/blob/main/bsky_advanced_search.js
2. Go to [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
3. Paste the code
4. Name the bookmarklet
5. Drag the link to your bookmarks bar

## Usage

1. Click the bookmarklet while on any BlueSky page
   - If you're not on BlueSky, you'll be redirected to the search page first
2. Fill in the search criteria you want:
   - **Search Terms**: Enter keywords (use quotes for exact phrases)
   - **Hashtag**: Enter hashtag without the # symbol
   - **Posts From User**: Enter username without @ symbol
   - **Posts Mentioning User**: Enter username without @ symbol
   - **URL or Domain**: Enter full URL or just domain name
   - **Language**: Select from dropdown
   - **Date Range**: Select start and/or end dates
3. Click "Search" to execute your search
4. Close the panel by:
   - Clicking the X button
   - Pressing the Escape key
   - Clicking outside the panel

## Examples

- Search for posts from austegard.com mentioning "claude": 
  - From User: `austegard.com`
  - Search Terms: `claude`
  
- Find all posts with NPR articles:
  - URL or Domain: `npr.org`
  
- Search for posts in Japanese with the hashtag #technology:
  - Language: Japanese
  - Hashtag: `technology`

## Technical Details

- The bookmarklet injects a floating panel with form controls
- Uses BlueSky's URL query parameters to construct complex searches
- Styled to match BlueSky's dark theme
- Fully keyboard accessible
- Responsive and mobile-friendly
