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
Drag this link to your bookmarks bar: [Tweet to Markdown](javascript:(function()%7Bconst%20t%3D/%5Ehttps%3F:%5C/%5C/(twitter%5C.com%7Cx%5C.com)%5C/.%2B%5C/status%5C/%5Cd+/%2Co%3D/%5E(.+)%20on%20X:%20%22(.+)%22%20%5C/%20X%24/%2Ct%3Dwindow.location.href,e%3Dwindow.document.title%3Bif(!t.test(t))return%20void%20alert(%22This%20bookmarklet%20only%20works%20on%20X.com%20(formerly%20Twitter)%20tweet%20pages%22)%3Bconst%20n%3De.match(o)%3Bif(!n)return%20void%20alert(%22Unable%20to%20parse%20the%20tweet.%20The%20page%20format%20might%20have%20changed.%22)%3Bconst%20a%3Dn%5B1%5D,i%3Dn%5B2%5D.replace(/https%3F:%5C/%5C/t%5C.co%5C/%5Cw+/,"").trim(),d%3D%60%5B%24%7Ba%7D%20on%20X:%5D(%24%7Bt%7D)%5Cn%3E%20%24%7Bi%7D%60%3Bnavigator.clipboard.writeText(d).catch((function()%7Balert(%22Failed%20to%20copy%20to%20clipboard.%20Your%20browser%20might%20not%20support%20this%20feature.%22)%7D))%7D)())

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
