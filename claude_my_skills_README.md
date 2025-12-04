# Claude Skills Installer

A bookmarklet that displays available Claude skills from GitHub releases and allows one-click installation directly to your Claude.ai account.

## Purpose

This bookmarklet provides a streamlined way to discover and install Claude skills from the [oaustegard/claude-skills](https://github.com/oaustegard/claude-skills) repository. Instead of manually downloading ZIP files and uploading them through the Claude.ai interface, you can browse available skills in an overlay and install them with a single click.

## Features

- **Direct Installation**: Click any skill to download and install it automatically
- **GitHub Integration**: Fetches skills directly from GitHub releases
- **Clean Interface**: Elegant overlay positioned in the top-right corner
- **Real-time Feedback**: Shows download/upload progress and success states
- **Alphabetical Sorting**: Skills displayed in alphabetical order for easy browsing
- **Smart Filtering**: Only shows releases that contain .zip skill files
- **Toggle Behavior**: Clicking the bookmarklet again closes the overlay
- **Error Handling**: Displays helpful error messages if installation fails

## Installation

### Easy Install
Click this link to install: [Bookmarklet Installer - claude_my_skills.js](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_my_skills.js)

### Manual Install
1. Create a new bookmark in your browser
2. Copy the entire contents of [`claude_my_skills.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_my_skills.js)
3. Paste the code as the bookmark's URL
4. Name it something memorable like "Install Claude Skills"

## Usage

1. Navigate to any page on `claude.ai` while logged in
2. Click the bookmarklet
3. An overlay appears showing available skills from GitHub releases
4. Click any skill to install it:
   - The skill is downloaded from GitHub
   - It's automatically uploaded to your Claude account
   - A green checkmark appears when installation is complete
5. Click the × button or click the bookmarklet again to close the overlay

## How It Works

The bookmarklet:

1. **Creates Overlay**: Displays a modal dialog with a loading indicator
2. **Fetches Releases**: Calls GitHub API to get releases from `oaustegard/claude-skills`
3. **Filters & Sorts**: Shows only releases with .zip assets, sorted alphabetically
4. **Handles Clicks**: When you click a skill:
   - Downloads the .zip file from GitHub using the release asset API
   - Extracts your Claude organization ID using multiple detection methods
   - Uploads the skill to Claude API at `/api/organizations/{orgId}/skills/upload-skill`
   - Updates the UI to show success or error status
5. **Provides Feedback**: Shows loading, success, and error states throughout the process

## Technical Notes

### Organization ID Detection

The bookmarklet uses a sophisticated multi-method approach to find your organization ID:

1. **Script Tag Parsing**: Searches for `lastActiveOrg` in inline scripts (most reliable)
2. **URL Path**: Extracts from `/organizations/{id}` in the current URL
3. **Link Extraction**: Finds organization links in the page
4. **Storage APIs**: Checks localStorage and sessionStorage
5. **organizationId Field**: Searches for `organizationId` in script tags

### API Integration

- **GitHub API**: Uses `api.github.com/repos/oaustegard/claude-skills/releases`
- **Asset Download**: Uses `Accept: application/octet-stream` header
- **Claude Upload**: Uses FormData with authenticated session cookies
- **Overwrite Policy**: Set to `overwrite=false` to prevent accidental overwrites

### Browser Compatibility

- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Fetch API and FormData support
- Uses modern ES6+ JavaScript features (async/await, arrow functions)

### UI Features

- **Loading States**: Shows spinner while fetching releases
- **Progress Indication**: Updates during download and upload phases
- **Success Feedback**: Green background and checkmark on completion
- **Error Display**: Red text with error message if something fails
- **Hover Effects**: Visual feedback when hovering over skills
- **CSS Animations**: Smooth spinner animation during loading

### Security Considerations

- All requests use your existing Claude.ai authentication
- Downloads are fetched from GitHub's official API
- Organization ID is extracted from trusted page sources
- No credentials are transmitted or stored

## Use Cases

- **Quick Skill Installation**: Install new skills without manual download/upload
- **Skill Discovery**: Browse available skills in the repository
- **Batch Installation**: Install multiple skills in quick succession
- **Testing**: Easily install skills for testing and development

## Known Limitations

- Requires authentication to Claude.ai
- Only installs skills from the `oaustegard/claude-skills` repository
- Depends on Claude.ai's internal API structure (may break if API changes)
- GitHub API has rate limits (60 requests/hour for unauthenticated requests)
- Cannot currently handle skill overwrites (set to prevent overwrites)

## Error Messages

Common errors and their meanings:

- **"Could not determine organization ID"**: Not logged into Claude.ai or page structure changed
- **"GitHub API error"**: GitHub API is down or rate limited
- **"Download failed"**: Network error or asset not accessible
- **"Upload failed"**: Claude API error or authentication issue

## Privacy & Security

- All data stays between your browser, GitHub, and Claude.ai
- No third-party services are involved
- Uses existing authentication cookies
- No data is stored or transmitted elsewhere

## Related Bookmarklets

- [Claude Skills Viewer](claude_list_skills_README.md) - View installed skills
- [Claude Conversation Tree JSON](claude_conversation_tree_json_README.md) - Export conversation as JSON
- [Claude Pruner](claude_pruner_README.md) - Manage conversation size

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/claude_my_skills.js).
