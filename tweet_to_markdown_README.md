# Tweet to Markdown

## Purpose
This bookmarklet captures the author, content, and URL of a tweet from a tweet page on X.com (formerly Twitter) and copies it to your clipboard in a clean Markdown format.

## Features
- Captures the tweet's author and body content.
- Creates a Markdown-formatted string that links back to the original tweet.
- Formats the tweet body as a blockquote.
- Copies the final Markdown to the user's clipboard.
- Includes checks to ensure it's running on a valid tweet page.

## Installation

### Easy Install
[Install via Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=tweet_to_markdown.js)

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Tweet to Markdown".
3. Copy the code from `tweet_to_markdown.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a specific tweet's page on `x.com` or `twitter.com`.
2. Click the "Tweet to Markdown" bookmarklet.
3. The formatted Markdown will be copied to your clipboard. You can then paste it into any Markdown-supporting application.

## Example Output
```markdown
[Elon Musk on X:](https://x.com/elonmusk/status/1234567890)
> This is a sample tweet.
```

## How It Works
The bookmarklet reads the page's title, which on X.com typically follows the format: `Author on X: "Tweet Content" / X`. It uses a regular expression to parse the author and the tweet body from this title. It then constructs a Markdown string and uses the modern `navigator.clipboard.writeText()` API to copy it to the clipboard.

## Technical Notes
- This bookmarklet relies on the specific format of the page title on X.com. If X.com changes its title structure, the bookmarklet may break.
- It requires a modern browser that supports the `navigator.clipboard` API for secure clipboard access.
- The script will alert you if it doesn't seem to be on a valid tweet page or if it fails to parse the title.

## License
MIT

## Author
[Your Name/Alias Here]
