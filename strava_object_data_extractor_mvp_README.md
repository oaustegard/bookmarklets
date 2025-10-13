# Strava Segment Data Extractor

## Purpose
This bookmarklet extracts detailed performance data for every segment in a Strava activity and displays it in a convenient table. It is designed for athletes and coaches who want to perform a quick, detailed analysis without manually clicking through each segment.

## Features
- Extracts key performance metrics including power, heart rate, cadence, speed, and elevation gain.
- Presents the data in a clean, easy-to-read HTML table.
- Displays the data in a popup modal on the activity page.
- Includes a "Close" button to dismiss the table.

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Strava Segment Extractor](javascript:(function()%7Bfunction%20t()%7Bconst%20t%3DpageView._segmentEffortsTableContext.segmentEfforts.models%3Breturn%20t.map((t%3D>%7Bconst%20e%3Dt.attributes%3Breturn%7Bname:e.name,distance:e.distance,elapsedTime:e.elapsed_time,avgSpeed:e.avg_speed,maxSpeed:e.max_speed,avgWatts:e.avg_watts,avgHR:e.avg_hr,maxHR:e.max_hr,avgCadence:e.avg_cadence,maxCadence:e.max_cadence,elevGain:e.elev_gain,avgGrade:e.avg_grade%7D%7D))%7Dfunction%20e(t)%7Bconst%20e%3D%60%5Cn%20%20%20%20%20%20%20%20%20%20%20%20position:%20fixed;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20top:%2020px;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20left:%2020px;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20max-width:%20600px;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20max-height:%2080vh;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20overflow-y:%20auto;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20background:%20white;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20border:%201px%20solid%20%23ccc;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20padding:%2020px;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20z-index:%2010000;%5Cn%20%20%20%20%20%20%20%20%20%20%20%20font-family:%20Arial,%20sans-serif;%5Cn%20%20%20%20%20%20%20%20%60,o%3D%60%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20id%3D%22segmentDataPopup%22%20style%3D%22%24%7Be%7D%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch2%3ESegment%20Performance%20Data%3C/h2%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20onclick%3D%22document.body.removeChild(document.getElementById('segmentDataPopup'))%22%3EClose%3C/button%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctable%20border%3D%221%22%20cellpadding%3D%225%22%20style%3D%22border-collapse:%20collapse;%20margin-top:%2010px;%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3ESegment%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EDistance%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3ETime%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EAvg%20Speed%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EMax%20Speed%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EAvg%20Watts%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EAvg%20HR%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EMax%20HR%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EAvg%20Cadence%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EMax%20Cadence%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EElev%20Gain%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cth%3EAvg%20Grade%3C/th%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%24%7Bt.map((t%3D%60%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.name%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.distance%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.elapsedTime%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.avgSpeed%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.maxSpeed%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.avgWatts%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.avgHR%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.maxHR%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.avgCadence%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.maxCadence%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.elevGain%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctd%3E%24%7Bt.avgGrade%7D%3C/td%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/tr%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%60)).join(%22%22)%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/table%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%5Cn%20%20%20%20%20%20%20%20%60,a%3Ddocument.createElement(%22div%22)%3Ba.innerHTML%3Do,document.body.appendChild(a.firstChild)%7Dconst%20o%3Dt()%3Be(o)%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Segment Extractor".
3. Copy the code from `strava_object_data_extractor_mvp.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to any Strava activity page.
2. Scroll down to the "Segments" section to ensure the data is loaded.
3. Click the "Strava Segment Extractor" bookmarklet.
4. A popup will appear on the top left of the page containing a table with detailed data for each segment in the activity.
5. Click the "Close" button to dismiss the popup.

## How It Works
The bookmarklet accesses a global JavaScript object, `pageView._segmentEffortsTableContext`, which Strava uses to manage the data for the segments table on an activity page. It then iterates through the `segmentEfforts.models` array within that object, extracting the relevant performance attributes for each segment. Finally, it constructs an HTML table with this data and displays it in a simple popup `div` injected into the page.

## Technical Notes
- This tool is highly dependent on Strava's internal JavaScript object structure (`pageView._segmentEffortsTableContext`). If Strava updates its website, this bookmarklet is likely to break.
- It uses an inline `onclick` event handler for the "Close" button, which may be blocked by strict Content Security Policies (CSP), although this is unlikely to be an issue on Strava's own pages.

## License
MIT

## Author
[Your Name/Alias Here]
