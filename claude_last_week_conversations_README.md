# Claude Last Week's Conversations

## Purpose
The [claude_last_week_conversations.js](./claude_last_week_conversations.js) bookmarklet fetches all your Claude.ai conversations from the last 7 days and generates a summary in Markdown format. It's useful for weekly reviews, creating backups, or sharing progress with a team.

## Features
- Fetches conversations from the last 7 days.
- Groups conversations by project.
- Displays the output in a modal window.
- Generates a clean Markdown report.
- "Copy to Clipboard" button for easy export.
- Sorts conversations within each project by update date (newest first).
- Generates aggregate statistics.
- Includes a week-over-week comparison table.

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Claude Last Week's Conversations](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_last_week_conversations.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Claude Last Week's Conversations".
3. Copy the code from `claude_last_week_conversations.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Log in to your Claude.ai account.
2. Click the "Claude Last Week's Conversations" bookmarklet from your bookmarks bar.
3. A modal window will appear with the Markdown summary of your conversations.
4. Click the "Copy to Clipboard" button to copy the summary.
5. Paste the summary into a Markdown editor or any other text editor.

## How It Works
The bookmarklet performs the following actions:
1. It retrieves your organization ID from the Claude.ai website.
2. It calculates the date from 14 days ago to fetch data for the current and previous week.
3. It makes API calls to fetch your conversations, paginating through the results.
4. It generates aggregate statistics for both weeks and creates a week-over-week comparison table.
5. It groups the most recent week's conversations by the project they belong to.
6. It formats the grouped conversations and comparison statistics into a Markdown string.
7. It displays the Markdown in a user-friendly modal with a copy-to-clipboard functionality.

## Technical Notes
- This bookmarklet relies on the internal API of Claude.ai, which may change without notice.
- It requires you to be logged into Claude.ai to work.
- The bookmarklet fetches up to 14 days of conversations to generate the week-over-week comparison.
- Includes rate limiting of iterative GET calls to prevent issues on the backend.

## License
MIT

## Author
[Your Name/Alias Here]
