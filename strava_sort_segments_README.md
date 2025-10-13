# Strava Sortable Segments

## Purpose
This bookmarklet makes the segments table on a Strava activity page fully interactive and sortable. By default, Strava's segment list is static. This tool allows you to click on any column header to sort the segments by that metric.

## Features
- Makes the entire segments table sortable.
- Click any column header to sort in ascending order. Click again to sort in descending order.
- Supports sorting by:
  - Starred Segments (⭐️)
  - Achievements (KOM/QOM, Top 10, PRs) (🎖️)
  - Local Legend Status (🦸🏻)
  - Segment Name
  - Time
  - Speed, Power, Heart Rate, Cadence, and more.
- Cleans up the table header with emojis for better readability.
- May integrate with data from other browser extensions like "Sauce for Strava" for sorting by metrics like "Intensity".

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Strava Sort Segments](javascript:(function()%7Bconst%20t%3D%7Bstar:(t,e)%3D>%7Bconst%20o%3Dnull!%3D%3Dt.querySelector(%22.starred-segment.active%22),n%3Dnull!%3D%3De.querySelector(%22.starred-segment.active%22)%3Bif(o!%3D%3Dn)return%20n-o%3Bconst%20s%3Dt%3D>%7Bconst%20e%3Dt.querySelector(%22.sauce-segment-score%22)%3Breturn%20e%3FparseInt(e.textContent.replace(%22,%22,%22%22)):0%7D%3Breturn%20s(e)-s(t)%7D,achievement:(t,e)%3D>%7Bconst%20o%3Dt%3D>%7Bconst%20e%3Dt.querySelector(%22.achievement-col%20.app-icon%22)%3Bif(!e)return%200%3Bconst%20t%3De.className%3Breturn%20console.log(%22Achievement%20classes:%22,t),t.includes(%22icon-at-kom-1%22)%3F1e3:t.includes(%22icon-at-kom-%22)%3F1e3-parseInt(t.match(/icon-at-kom-(%5Cd+)/)%5B1%5D):t.includes(%22icon-at-pr-%22)%3F500-parseInt(t.match(/icon-at-pr-(%5Cd+)/)%5B1%5D):0%7D,n%3Do(t),s%3Do(e)%3Breturn%20console.log(%22Achievement%20values:%22,n,s),s-n%7D,legend:(t,e)%3D>%7Bconst%20o%3Dt%3D>%7Bconst%20t%3Dt.querySelector(%22.local-legend-col%20.app-icon%22)%3Breturn%20t%3Ft.classList.contains(%22icon-local-legend%22)%3F1e3:500:0%7D,n%3Do(t),s%3Do(e)%3Breturn%20console.log(%22Legend%20values:%22,n,s),s-n%7C%7Ct.rowIndex-e.rowIndex%7D,name:(t,e)%3D>t.querySelector(%22.name%22).textContent.localeCompare(e.querySelector(%22.name%22).textContent),time:(t,e)%3D>%7Bconst%20o%3Dt%3D>t.includes(%22:%22)%3F(t%3Dt.split(%22:%22).map(Number)).length%3D%3D%3D3%3F3600*t%5B0%5D+60*t%5B1%5D+t%5B2%5D:60*t%5B0%5D+t%5B1%5D:parseInt(t)%3Breturn%20o(t.querySelector(%22.time-col%22).textContent)-o(e.querySelector(%22.time-col%22).textContent)%7D,numeric:(t,e,o)%3D>%7Bconst%20n%3DparseFloat(t.querySelector(o).textContent),s%3DparseFloat(e.querySelector(o).textContent)%3Breturn%20s-n%7D,intensity:(t,e)%3D>%7Bconst%20o%3Dt%3D>%7Bconst%20e%3Dt.querySelector(%22.effort-intensity%22)%3Bif(!e)return%200%3Bconst%20o%3De.querySelector(%22.ei-value%22)%3Breturn%20o%3FparseFloat(o.textContent):0%7D%3Breturn%20o(e)-o(t)%7D%7D%3Bfunction%20e(t)%7Bt.querySelectorAll(%22th%22).forEach((t%3D>%7Bt.removeAttribute(%22colspan%22),t.style.cursor%3D%22pointer%22%3Bconst%20e%3Dt,o%3De.cloneNode(!0)%3Be.parentNode.replaceChild(o,e)%7D))%3Bconst%20e%3Dt.querySelector(%22th.starred-col%22)%3Be%26%26(e.textContent%3D%22%E2%AD%90%EF%B8%8F%22)%3Bconst%20o%3Dt.querySelector(%22th.achievement-col%22)%3Bo%26%26(o.textContent%3D%22%F0%9F%8E%96%EF%B8%8F%22)%3Bconst%20n%3Dt.querySelector(%22th.local-legend-col%22)%3Bn%26%26(n.textContent%3D%22%F0%9F%A6%B8%F0%9F%8F%BB%22)%3Bconst%20s%3Dt.querySelector(%22th.name-col%22)%3Bif(s)%7Bconst%20t%3Ddocument.createElement(%22th%22)%3Bt.textContent%3D%22%F0%9F%8F%94%EF%B8%8F%22,t.style.cursor%3D%22pointer%22,s.after(t)%7Dconst%20r%3Dt.querySelector(%22th:nth-child(8)%22)%3Bif(r)%7Bconst%20t%3Ddocument.createElement(%22th%22)%3Bt.textContent%3D%22Power%22,t.style.cursor%3D%22pointer%22%3Bconst%20e%3Ddocument.createElement(%22th%22)%3Be.textContent%3D%22Intensity%22,e.style.cursor%3D%22pointer%22,r.parentNode.replaceChild(t,r),t.after(e)%7D%7Dfunction%20o(n)%7Be(n),n.querySelectorAll(%22th%22).forEach(((t,e)%3D>%7Bt.addEventListener(%22click%22,(()%3D>s(n,e)))%7D))%7Dfunction%20s(e,o)%7Bconsole.log(%22Sorting%20column:%22,o)%3Bconst%20n%3De.querySelector(%22tbody%22),s%3DArray.from(n.querySelectorAll(%22tr%22)),r%3D(()%3D>%7Bswitch(o)%7Bcase%200:return%20t.star%3Bcase%201:return%20t.achievement%3Bcase%202:return%20t.legend%3Bcase%203:return%20t.name%3Bcase%204:return()=%3E0%3Bcase%205:return%20t.time%3Bcase%206:return(e,o)%3D>t.numeric(e,o,%22td:nth-child(7)%22)%3Bcase%207:return(e,o)%3D>t.numeric(e,o,%22td:nth-child(8)%22)%3Bcase%208:return%20t.intensity%3Bcase%209:return(e,o)%3D>t.numeric(e,o,%22td:nth-child(10)%22)%3Bcase%2010:return(e,o)%3D>t.numeric(e,o,%22td:nth-child(11)%22)%3Bdefault:return(t,e)%3D>0%7D%7D))()%3Bs.sort(r),e.sorted%26%26e.sorted.column%3D%3D%3Do%3F(s.reverse(),e.sorted.asc%3D!e.sorted.asc):e.sorted%3D%7Bcolumn:o,asc:!0%7D,n.innerHTML%3D%22%22,s.forEach((t%3D>n.appendChild(t)))%7Dconst%20n%3Ddocument.getElementById(%22segments%22)%3Bn%3F(t%3Dn.querySelector(%22table%22))%3F(o(t),console.log(%22Table%20made%20sortable%22)):console.log(%22Table%20not%20found%22):console.log(%22Segments%20section%20not%20found%22)%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Sort Segments".
3. Copy the code from `strava_sort_segments.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to any Strava activity page.
2. Scroll down to the "Segments" section.
3. Click the "Strava Sort Segments" bookmarklet.
4. The headers in the segments table will become clickable.
5. Click any header to sort by that column. Click it again to reverse the sort order.

## How It Works
The bookmarklet finds the segments table on the page and dynamically modifies its headers to make them clickable. It attaches event listeners to each header. When a header is clicked, the script runs a custom sorting function based on the data type of that column. It then re-orders the rows in the table and updates the display.

## Technical Notes
- This bookmarklet is highly dependent on the HTML structure and CSS class names of the Strava activity page. If Strava updates its design, the bookmarklet may break.
- The sorting for "Intensity" and "Score" may only work if you have another browser extension, like "Sauce for Strava", that adds this data to the page.

## License
MIT

## Author
[Your Name/Alias Here]
