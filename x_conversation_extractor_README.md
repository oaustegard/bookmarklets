# X.com Conversation Extractor

## Purpose
This bookmarklet automatically scrolls through an entire X.com (formerly Twitter) conversation thread, extracts all the tweets along with their engagement stats, and displays them in a new browser tab.

## Features
- **Automatic Scrolling**: Programmatically scrolls down the page to load all replies in a thread.
- **Data Extraction**: Captures the text of each tweet and its popularity data (replies, retweets, likes).
- **Deduplication**: Ensures that each tweet is only listed once, even if it's rendered multiple times during scrolling.
- **Clean Output**: Displays the full, extracted conversation in a new, easy-to-read browser tab.

## Installation

### Easy Install
Drag this link to your bookmarks bar: [X Conversation Extractor](javascript:(function()%7Blet%20t%3Dnew%20Set%3Bfunction%20e()%7Bdocument.querySelectorAll(%22article%22).forEach((e%3D>%7Bconst%20o%3De.querySelector('div%5Bdata-testid%3D%22tweetText%22%5D'),n%3De.querySelector('div%5Brole%3D%22group%22%5D')%3Bo%26%26n%26%26(e%3Do.innerText.trim(),o%3Dn.ariaLabel%3Fn.ariaLabel.trim():%22No%20popularity%20data%22,n%3D%60%24%7Be%7D%20-%20%24%7Bo%7D%60,t.add(n))%7D))%7Dfunction%20o()%7Be(),window.scrollBy(0,window.innerHeight),window.innerHeight+window.pageYOffset<document.body.scrollHeight%3FsetTimeout(o,200):(n%3Dwindow.open(%22%22,%22_blank%22)).document.write(%22<pre>%22+Array.from(t).join(%22%5Cn%5Cn%22)+%22</pre>%22)%7Dvar%20n%3Bo()%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "X Conversation Extractor".
3. Copy the code from `x_conversation_extractor.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a tweet page on X.com.
2. Click the "X Conversation Extractor" bookmarklet.
3. The page will begin to scroll down automatically. This may take some time for very long conversations.
4. Once the bottom of the page is reached, a new browser tab will open, displaying the full text of the conversation.

## How It Works
The bookmarklet works by repeatedly:
1. Scanning the current view for all tweet elements (`<article>`).
2. Extracting the tweet text and the accessibility label containing the engagement stats.
3. Storing this information in a `Set` to avoid duplicates.
4. Scrolling the window down to load more tweets.

This process continues in a loop until it detects it has reached the end of the scrollable content. Finally, it opens a new window and writes the collected data into it.

## Technical Notes
- This bookmarklet is highly dependent on the specific HTML structure and `data-testid` attributes used by X.com. If the site's code changes, this tool may break.
- The script uses a 200ms delay between scrolls to allow new content to load. On very slow connections, it might finish before all tweets have been loaded.

## License
MIT

## Author
[Your Name/Alias Here]
