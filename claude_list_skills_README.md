# Claude Skills Viewer

A bookmarklet that displays all active skills in your Claude.ai organization with quick copy functionality.

## Purpose

This bookmarklet provides a quick and convenient way to view all skills available in your Claude.ai organization. It displays skills in an elegant dialog with their names, descriptions, and last update dates. Clicking any skill copies its name to your clipboard for easy use in conversations.

## Features

- **Quick Access**: View all organization skills with one click
- **Detailed Information**: See skill name, description, and last update date
- **One-Click Copy**: Click any skill to copy its name to clipboard
- **Clean Interface**: Dark-themed, non-intrusive dialog positioned in the top-right corner
- **Smart Sorting**: Skills sorted by most recently updated first
- **Idempotent**: Can be run multiple times without creating duplicate dialogs
- **Easy Dismissal**: Close via X button, clicking outside, or pressing Escape

## Installation

### Easy Install
Click this link to install: [Bookmarklet Installer - claude_list_skills.js](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_list_skills.js)

### Manual Install
1. Create a new bookmark in your browser
2. Copy the entire contents of [`claude_list_skills.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_list_skills.js)
3. Paste the code as the bookmark's URL
4. Name it something memorable like "Claude Skills"

## Usage

1. Navigate to any page on `claude.ai` while logged in
2. Click the bookmarklet
3. A dialog appears in the top-right showing all available skills
4. Click any skill to:
   - Copy the skill name to your clipboard
   - See a brief "Copied" confirmation
   - Automatically close the dialog
5. Paste the skill name into your conversation prompt

## How It Works

The bookmarklet:

1. **Validates Context**: Ensures you're on the Claude.ai domain
2. **Extracts Organization ID**: Uses the organization ID retrieval pattern to find your active organization
3. **Fetches Skills**: Makes an authenticated API call to `https://claude.ai/api/organizations/{orgId}/skills/list-skills`
4. **Displays Results**: Shows skills in a styled modal with:
   - Skill count at the top
   - Skills sorted by most recent update
   - Name (bold), description, and update date for each skill
5. **Handles Clicks**: Copies skill name to clipboard and closes dialog when clicked

## Technical Notes

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Clipboard API support for copy functionality
- Uses modern ES6+ JavaScript features

### API Behavior
- Makes authenticated requests using existing session cookies
- Handles various response formats (array or object with `skills` property)
- Gracefully handles empty results and errors

### UI Features
- Modal positioned in top-right corner (not center)
- Prevents duplicate modals by removing existing ones
- Smooth animations and hover effects
- Responsive design adapts to screen size
- Accessible keyboard navigation (Escape to close)

### Data Display
- Descriptions truncated at 120 characters
- Dates formatted as "MMM DD, YYYY"
- Skills sorted by `updated_at` or `created_at` (newest first)
- HTML escaping prevents XSS vulnerabilities

### Error Handling
- Validates organization ID before making requests
- Displays user-friendly error messages
- Logs detailed errors to browser console
- Handles HTTP errors gracefully

## Use Cases

- **Discovering Available Skills**: See what skills are configured in your organization
- **Quick Reference**: Check skill names before starting a conversation
- **Monitoring Updates**: See when skills were last modified
- **Conversation Preparation**: Quickly copy skill names to use in prompts

## Known Limitations

- Requires authentication to Claude.ai
- Only shows skills for your current active organization
- Description truncation may hide important details (hover shows full text via title attribute)
- Depends on Claude.ai's internal API structure (may break if API changes)

## Privacy & Security

- All data stays in your browser
- No external services are contacted except Claude.ai's API
- Uses existing authentication cookies
- No data is stored or transmitted elsewhere

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE) file for details.

## Author

Created by [Owen Austegard](https://austegard.com)

## Related Bookmarklets

- [Claude Conversation Tree JSON](claude_conversation_tree_json_README.md) - Export conversation as JSON
- [Claude Continue Chat](claude_continue_chat_README.md) - Continue previous conversation
- [Claude Pruner](claude_pruner_README.md) - Manage conversation size
