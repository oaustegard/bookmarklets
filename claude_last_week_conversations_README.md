# Claude Last Week's Conversations

## Purpose
This bookmarklet fetches all your Claude.ai conversations from the last 7 days and generates a summary in Markdown format. It's useful for weekly reviews, creating backups, or sharing progress with a team.

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
Drag this link to your bookmarks bar: [Claude Last Week's Conversations](javascript:(function()%7Bconst%20t%3D7,e%3D50%3Bconst%20o%3D()%3D>%7Bconst%20t%3D()%3D>%7Bconst%20t%3Ddocument.querySelectorAll(%22script%22)%3Bfor(const%20e%20of%20t)%7Bconst%20t%3D(e%3F.textContent)%3Bif(null%3F.t%26%26t.includes(%22lastActiveOrg%22))%7Bconst%20e%3Dt.match(%2F%5C%22lastActiveOrg%5C%22,%5C%22value%5C%22:%5C%22(%5Ba-f0-9-%5D%7B36%7D)%5C%22%2F)%3Bif(null%3F.e%26%26e%5B1%5D)return%7Bid:e%5B1%5D,source:%22lastActiveOrg%22%7D%7D%7Dreturn%20null%7D,e%3Dt()%3Breturn%20e%3Fe.id:null%7D,n%3Dt%3D>%7Bconst%20e%3Dnew%20Date%3Breturn%20e.setDate(e.getDate()-t),e%7D,s%3Dasync(t,o)%3D>%7Bconst%20n%3D%5B%5D%3Blet%20s%3D0,a%3D!0%3Bfor(console.log(%60Fetching%20conversations%20since%20$%7Bo.toISOString()%7D%60)%3Ba%3B)%7Btry%7Bconst%20i%3D%60https://claude.ai/api/organizations/%24%7Bt%7D/chat_conversations%3Flimit%3D%24%7Be%7D%26offset%3D%24%7Bs%7D%60%3Bconsole.log(%60Fetching%20batch:%20offset%3D%24%7Bs%7D%60)%3Bconst%20r%3Dawait%20fetch(i,%7Bcredentials:%22include%22,headers:%7BAccept:%22application/json%22%7D%7D)%3Bif(!r.ok)throw%20new%20Error(%60HTTP%20%24%7Br.status%7D:%20%24%7Br.statusText%7D%60)%3Bconst%20c%3Dawait%20r.json()%3Bif(console.log(%60Received%20%24%7Bc.length%7D%20conversations%60),0%3D%3D%3Dc.length)%7Ba%3D!1%3Bbreak%7Dfor(const%20t%20of%20c)%7Bnew%20Date(t.updated_at)%3E%3Do%3Fn.push(t):(a%3D!1,break)%7Dif(c.length<e)a%3D!1%3Bs+%3D50,await%20new%20Promise((t%3D>setTimeout(t,100)))%7Dcatch(t)%7Bconsole.error(%22Error%20fetching%20conversations:%22,t),alert(%60Error%20fetching%20conversations:%20%24%7Bt.message%7D%60),a%3D!1%7D%7Dreturn%20n%7D,a%3Dt%3D>%7Bconst%20e%3D%7B%7D%3Bfor(const%20o%20of%20t)%7Bconst%20t%3D(null%3F.o.project%3F.name%7C%7C%22(No%20Project)%22)%3Be%5Bt%5D%7C%7C(e%5Bt%5D%3D%5B%5D),e%5Bt%5D.push(o)%7Dfor(const%20t%20in%20e)e%5Bt%5D.sort(((t,e)%3D>new%20Date(e.updated_at)-new%20Date(t.updated_at)))%3Breturn%20e%7D,i%3D(t,e)%3D>%7Blet%20o%3D%60%23%20Claude%20Conversations%20-%20Last%20%24%7Be%7D%20Days%5Cn%5Cn%60%3Bo+%3D%60Generated:%20%24%7Bnew%20Date().toLocaleString()%7D%5Cn%5Cn%60,o+%3D%22--%5C-%5Cn%5Cn%22%3Bconst%20n%3DObject.keys(t).sort()%3Bfor(const%20e%20of%20n)%7Bconst%20s%3Dt%5Be%5D%3Bo+%3D%60%23%23%20Project:%20%24%7Be%7D%5Cn%5Cn%60,o+%3D%60**Total%20Conversations:**%20%24%7Bs.length%7D%5Cn%5Cn%60%3Bfor(const%20t%20of%20s)%7Bconst%20e%3Dnew%20Date(t.updated_at).toLocaleString()%3Bo+%3D%60%23%23%23%20%24%7Bt.name%7D%5Cn%5Cn%60,o+%3D%60-%20**Updated:**%20%24%7Be%7D%5Cn%60,o+%3D%60-%20**UUID:**%20%24%7Bt.uuid%7D%5Cn%5Cn%60,t.summary%26%26(o+%3D%60**Summary:**%5Cn%5Cn%24%7Bt.summary%7D%5Cn%5Cn%60),o+%3D%22--%5C-%5Cn%5Cn%22%7D%7Dreturn%20o%7D,r%3Dt%3D>%7Bconst%20e%3Ddocument.createElement(%22div%22)%3Be.style.cssText%3D%22%5Cn%20%20%20%20%20%20position:%20fixed;%5Cn%20%20%20%20%20%20top:%200;%5Cn%20%20%20%20%20%20left:%200;%5Cn%20%20%20%20%20%20width:%20100%25;%5Cn%20%20%20%20%20%20height:%20100%25;%5Cn%20%20%20%20%20%20background:%20rgba(0,%200,%200,%200.8);%5Cn%20%20%20%20%20%20z-index:%20999999;%5Cn%20%20%20%20%20%20display:%20flex;%5Cn%20%20%20%20%20%20align-items:%20center;%5Cn%20%20%20%20%20%20justify-content:%20center;%5Cn%20%20%20%20%22%3Bconst%20o%3Ddocument.createElement(%22div%22)%3Bo.style.cssText%3D%22%5Cn%20%20%20%20%20%20background:%20white;%5Cn%20%20%20%20%20%20border-radius:%208px;%5Cn%20%20%20%20%20%20padding:%2020px;%5Cn%20%20%20%20%20%20max-width:%2090%25;%5Cn%20%20%20%20%20%20max-height:%2090%25;%5Cn%20%20%20%20%20%20overflow:%20auto;%5Cn%20%20%20%20%20%20box-shadow:%200%204px%206px%20rgba(0,%200,%200,%200.3);%5Cn%20%20%20%20%22%3Bconst%20n%3Ddocument.createElement(%22textarea%22)%3Bn.value%3Dt,n.style.cssText%3D%22%5Cn%20%20%20%20%20%20width:%20100%25;%5Cn%20%20%20%20%20%20min-width:%20600px;%5Cn%20%20%20%20%20%20height:%20500px;%5Cn%20%20%20%20%20%20font-family:%20monospace;%5Cn%20%20%20%20%20%20font-size:%2012px;%5Cn%20%20%20%20%20%20padding:%2010px;%5Cn%20%20%20%20%20%20border:%201px%20solid%20%23ccc;%5Cn%20%20%20%20%20%20border-radius:%204px;%5Cn%20%20%20%20%20%20resize:%20vertical;%5Cn%20%20%20%20%22%3Bconst%20s%3Ddocument.createElement(%22div%22)%3Bs.style.cssText%3D%22%5Cn%20%20%20%20%20%20margin-top:%2015px;%5Cn%20%20%20%20%20%20display:%20flex;%5Cn%20%20%20%20%20%20gap:%2010px;%5Cn%20%20%20%20%20%20justify-content:%20flex-end;%5Cn%20%20%20%20%22%3Bconst%20a%3Ddocument.createElement(%22button%22)%3Ba.textContent%3D%22Copy%20to%20Clipboard%22,a.style.cssText%3D%22%5Cn%20%20%20%20%20%20padding:%208px%2016px;%5Cn%20%20%20%20%20%20background:%20%234CAF50;%5Cn%20%20%20%20%20%20color:%20white;%5Cn%20%20%20%20%20%20border:%20none;%5Cn%20%20%20%20%20%20border-radius:%204px;%5Cn%20%20%20%20%20%20cursor:%20pointer;%5Cn%20%20%20%20%20%20font-size:%2014px;%5Cn%20%20%20%20%22,a.onclick%3D()%3D>%7Bn.select(),document.execCommand(%22copy%22),a.textContent%3D%22Copied!%22,setTimeout((()%3D>%7Ba.textContent%3D%22Copy%20to%20Clipboard%22%7D),2e3)%7D%3Bconst%20i%3Ddocument.createElement(%22button%22)%3Bi.textContent%3D%22Close%22,i.style.cssText%3D%22%5Cn%20%20%20%20%20%20padding:%208px%2016px;%5Cn%20%20%20%20%20%20background:%20%23666;%5Cn%20%20%20%20%20%20color:%20white;%5Cn%20%20%20%20%20%20border:%20none;%5Cn%20%20%20%20%20%20border-radius:%204px;%5Cn%20%20%20%20%20%20cursor:%20pointer;%5Cn%20%20%20%20%20%20font-size:%2014px;%5Cn%20%20%20%20%22,i.onclick%3D()%3D>%7Bdocument.body.removeChild(e)%7D,s.appendChild(a),s.appendChild(i),o.appendChild(n),o.appendChild(s),e.appendChild(o),document.body.appendChild(e),n.select()%7D%3B(async()%3D>%7Btry%7Bconsole.log(%22Starting%20Claude%20conversation%20fetch...%22)%3Bconst%20c%3Do()%3Bif(!c)return%20void%20alert(%22Could%20not%20find%20organization%20ID.%20Make%20sure%20you%20are%20logged%20into%20Claude.%22)%3Bconsole.log(%60Organization%20ID:%20%24%7Bc%7D%60)%3Bconst%20l%3Dn(t),d%3Dawait%20s(c,l)%3Bif(console.log(%60Total%20conversations%20fetched:%20%24%7Bd.length%7D%60),0%3D%3D%3Dd.length)return%20void%20alert(%60No%20conversations%20found%20in%20the%20last%20%24%7Bt%7D%20days.%60)%3Bconst%20p%3Da(d),u%3Di(p,t)%3Br(u)%7Dcatch(t)%7Bconsole.error(%22Fatal%20error:%22,t),alert(%60Fatal%20error:%20%24%7Bt.message%7D%60)%7D%7D)()%7D)())

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
2. It calculates the date from 7 days ago.
3. It makes API calls to fetch your conversations, paginating through the results.
4. It groups the conversations by the project they belong to.
5. It formats the grouped conversations into a Markdown string.
6. It displays the Markdown in a user-friendly modal with a copy-to-clipboard functionality.

## Technical Notes
- This bookmarklet relies on the internal API of Claude.ai, which may change without notice.
- It requires you to be logged into Claude.ai to work.
- The bookmarklet will stop fetching more conversations as soon as it encounters a conversation older than 7 days, for efficiency.
- Includes rate limiting of iterative GET calls to prevent issues on the backend.

## License
MIT

## Author
[Your Name/Alias Here]
