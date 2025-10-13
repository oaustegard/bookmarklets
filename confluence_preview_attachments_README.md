# Confluence Preview Attachments

## Purpose
This bookmarklet enhances the Confluence attachments page by adding a "Preview" column that displays a thumbnail of image attachments.

## Features
- Injects a new "Preview" column into the attachments table.
- Displays a small image preview for each attachment, making it easy to identify images without opening them.
- Works on the standard Confluence attachments page.

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Confluence Preview Attachments](javascript:(function()%7Bconst%20t%3Ddocument.querySelector(%22.tableview.attachments%22),e%3Dt.querySelectorAll(%22tbody%20>%20tr%22),o%3De%5B0%5D,l%3Ddocument.createElement(%22th%22)%3Bl.innerText%3D%22Preview%22,o.insertBefore(l,o.querySelector(%22.filename-column%22).nextElementSibling)%3Bfor(let%20t%3D1%3Bt<e.length%3Bt%2B%2B)%7Bconst%20o%3De%5Bt%5D,l%3Ddocument.createElement(%22td%22)%3Bl.style.minWidth%3D%22150px%22,l.style.width%3D%22150px%22%3Bconst%20n%3Do.querySelector(%22.filename-column%20a.filename%22)%3Bif(n)%7Bconst%20t%3Dn.getAttribute(%22href%22),e%3Ddocument.createElement(%22img%22)%3Be.src%3Dt,e.style.maxWidth%3D%22150px%22,l.appendChild(e)%7Do.insertBefore(l,o.querySelector(%22.filename-column%22).nextElementSibling)%7D%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Confluence Preview Attachments".
3. Copy the code from `confluence_preview_attachments.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a Confluence page with attachments.
2. Click on the "Attachments" link to view the list of attachments.
3. Click the "Confluence Preview Attachments" bookmarklet from your bookmarks bar.
4. A "Preview" column will be added to the table, showing image thumbnails.

## How It Works
The bookmarklet scans the page for the Confluence attachments table (`.tableview.attachments`). It then dynamically injects a new header cell ("Preview") and a corresponding data cell into each row. For each attachment, it creates an `<img>` element with its `src` attribute pointing to the attachment's URL, effectively creating a thumbnail.

## Technical Notes
- This bookmarklet will only display previews for file types that can be rendered by the browser in an `<img>` tag (e.g., PNG, JPG, GIF, SVG).
- Its functionality depends on the specific HTML structure and CSS classes used by Confluence. If Confluence updates its UI, the bookmarklet may stop working.

## License
MIT

## Author
[Your Name/Alias Here]
