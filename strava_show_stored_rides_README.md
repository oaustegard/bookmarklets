# Strava Show Stored Rides

## Purpose
This bookmarklet retrieves and displays Strava ride summaries that have been saved to the browser's local storage by other bookmarklets (like `strava_excerpt.js` or `strava_short_excerpt.js`).

## Features
- Retrieves ride data from local storage.
- Cleans the summary text by removing common boilerplate phrases from Strava.
- Formats the rides with metadata (timestamp, URL) for better context.
- Displays all stored rides in a new, clean, easy-to-read browser window.
- Provides controls to "Print", "Copy All", and "Clear Stored Rides".

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Show Stored Strava Rides](javascript:(function()%7Bfunction%20t()%7Bvar%20t%3DJSON.parse(localStorage.getItem(%22stravaRideSummaries%22))%7C%7C%5B%5D%3Breturn%200%3D%3D%3Dt.length%3F(alert(%22No%20ride%20data%20found%20in%20localStorage.%20Use%20the%20extraction%20bookmarklet%20first.%22),null):t%7Dfunction%20e(t)%7Bvar%20e%3D%5B%22Embed%20on%20Blog%22,%22Give%20kudos%22,%22Collapse%22,%22View%20Flybys%22,%22Show%20Less%22,%22View%20all%22,%22Add%20private%20notes%22,%22Add%20Others%22,%22Ride%20this%20route%20again%20to%20see%20how%20you're%20progressing.%22,%22Learn%20More%22,%22Only%20you%20can%20view%20this%20activity.%20It%20won't%20appear%20on%20segment%20leaderboards%20and%20may%20not%20count%20toward%20some%20challenges%22%5D,n%3Dt%3Breturn%20e.forEach((function(t)%7Bn%3Dn.replace(new%20RegExp(t,%22g%22),%22%22)%7D)),n%3Dn.replace(/%5Cs+/g,%22%20%22).trim()%7Dfunction%20n(t)%7Bvar%20n%3D%22%22%3Breturn%20t.forEach((function(t,o)%7Bn+%3D%22---%20Ride%20%23%22+(o+1)+%22%20---%5Cn%22,n+%3D%22Extracted:%20%22+(new%20Date(t.timestamp)).toLocaleString()+%22%5Cn%22,n+%3D%22URL:%20%22+t.url+%22%5Cn%5Cn%22,n+%3De(t.summary)+%22%5Cn%5Cn%22,n+%3D%22------------------------%5Cn%5Cn%22%7D)),n%7Dfunction%20o(t)%7Bvar%20e%3Dwindow.open(%22%22,%22_blank%22)%3Be.document.write(%22%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Chtml%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Chead%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ctitle%3EStrava%20Ride%20Summaries%3C/title%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cstyle%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20body%20%7B%20font-family:%20Arial,%20sans-serif;%20margin:%2020px;%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20pre%20%7B%20white-space:%20pre-wrap;%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20.controls%20%7B%20margin-bottom:%2020px;%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/style%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C/head%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3Cbody%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3EStrava%20Ride%20Summaries%3C/h1%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22controls%22%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20onclick%3D%22window.print()%22%3EPrint%3C/button%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20onclick%3D%22navigator.clipboard.writeText(document.querySelector('pre').textContent)%22%3ECopy%20All%3C/button%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20onclick%3D%22if(confirm('Clear%20all%20stored%20rides%3F'))%20%7B%20localStorage.removeItem('stravaRideSummaries');%20alert('Rides%20cleared!');%20window.close();%20%7D%22%3EClear%20Stored%20Rides%3C/button%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/div%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpre%3E%22+t+%22%3C/pre%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C/body%3E%5Cn%20%20%20%20%20%20%20%20%20%20%20%20%3C/html%3E%5Cn%20%20%20%20%20%20%20%20%22),e.document.close()%7Dvar%20r%3Dt()%3Br%26%26(displayRides(n(r)))%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Show Stored Strava Rides".
3. Copy the code from `strava_show_stored_rides.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. After using another Strava bookmarklet to save ride summaries (e.g., `strava_excerpt.js`), click this "Show Stored Strava Rides" bookmarklet.
2. A new browser window or tab will open.
3. The new window will display all the ride summaries you have saved, along with the date they were saved and the original URL.
4. You can then use the buttons at the top to print the summaries, copy them to your clipboard, or clear them from your browser's storage.

## How It Works
The bookmarklet retrieves a JSON array of ride objects from `localStorage` using the key `stravaRideSummaries`. It then iterates through this array, cleaning up the summary text and formatting each ride's data into a string. This string is then written into the HTML of a new browser window. The new window also includes JavaScript for the control buttons (`Print`, `Copy`, `Clear`).

## Technical Notes
- This bookmarklet relies on data being present in `localStorage` under the key `stravaRideSummaries`. If no data is found, it will show an alert.
- The "Clear Stored Rides" button will permanently delete the `stravaRideSummaries` item from your local storage. This action is not reversible.

## License
MIT

## Author
[Your Name/Alias Here]
