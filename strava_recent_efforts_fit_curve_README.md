# Strava Efforts Fit Curve

## Purpose
This bookmarklet enhances the "My Efforts" chart on a Strava segment page by adding a trend line. This visualizes your performance over time and calculates your approximate rate of improvement.

## Features
- Overlays a linear regression (line of best fit) trend line on the segment efforts chart.
- Calculates and displays your rate of improvement in "seconds per month".
- Adds a legend for the new trend line directly onto the chart.
- Helps you quickly visualize if you are getting faster or slower on a segment over time.

## Installation

### Easy Install
Drag this link to your bookmarks bar: [Strava Fit Curve](javascript:(function()%7Bfunction%20t(t,e)%7Bconst%20n%3Dt.length,o%3Dt.reduce(((t,e)%3D>t+e.x),0),r%3Dt.reduce(((t,e)%3D>t+e.y),0),s%3Dt.reduce(((t,e)%3D>t+e.x*e.y),0),c%3Dt.reduce(((t,e)%3D>t+e.x*e.x),0),i%3D(n*s-o*r)/(n*c-o*o),u%3D(r-i*o)/n%3Breturn%7Bm:i,b:u%7D%7Dfunction%20e()%7Bconst%20t%3Ddocument.querySelectorAll(%22circle.mark:not(.personal-best-mark)%22),e%3D%5B%5D%3Breturn%20t.forEach((t%3D>%7Bconst%20n%3DparseFloat(t.getAttribute(%22cx%22)),o%3DparseFloat(t.getAttribute(%22cy%22))%3BisNaN(n)%7C%7CisNaN(o)%7C%7Ce.push(%7Bx:n,y:o%7D)%7D)),e%7Dfunction%20n(t,e)%7Bconst%20n%3D%5B...t%5D.sort(((t,e)%3D>t.x-e.x)),o%3Dn%5B0%5D.x,r%3Dn%5Bn.length-1%5D.x%3Blet%20s%3D%60M%20%24%7Bo%7D%20%24%7Be.m*o+e.b%7D%60%3Bfor(let%20t%3Do%3Bt<%3Dr%3Bt+%3D(r-o)/100)%7Bconst%20n%3De.m*t+e.b%3Bs+%3D%60%20L%20%24%7Bt%7D%20%24%7Bn%7D%60%7Dreturn%20s%7Dtry%7Bconst%20o%3Ddocument.querySelector(%22%23athlete-history-chart%20svg%22)%3Bif(!o)throw%20new%20Error(%22Chart%20SVG%20not%20found%22)%3Bconst%20r%3Do.querySelector('g%5Btransform%5E%3D%22translate%22%5D')%3Bif(!r)throw%20new%20Error(%22Main%20group%20not%20found%22)%3Bconst%20s%3De()%3Bif(s.length<2)throw%20new%20Error(%22Insufficient%20data%20points%22)%3Bconst%20c%3Dt(s,1),i%3Ddocument.createElementNS(%22http://www.w3.org/2000/svg%22,%22path%22)%3Bi.setAttribute(%22d%22,n(s,c)),i.setAttribute(%22stroke%22,%22%23FF4444%22),i.setAttribute(%22stroke-width%22,%222%22),i.setAttribute(%22fill%22,%22none%22),i.setAttribute(%22stroke-dasharray%22,%225,5%22),i.setAttribute(%22class%22,%22trend-line%22),r.appendChild(i)%3Bconst%20u%3Ddocument.createElementNS(%22http://www.w3.org/2000/svg%22,%22text%22)%3Bu.setAttribute(%22x%22,%22100%22),u.setAttribute(%22y%22,%2220%22),u.setAttribute(%22fill%22,%22%23FF4444%22),u.setAttribute(%22class%22,%22trend-label%22),u.textContent%3D%22Trend%20Line%22,r.appendChild(u)%3Bconst%20a%3Ddocument.createElementNS(%22http://www.w3.org/2000/svg%22,%22text%22),h%3D-1*c.m*(3600/s%5Bs.length-1%5D.x)*30%3Ba.setAttribute(%22x%22,%22100%22),a.setAttribute(%22y%22,%2240%22),a.setAttribute(%22fill%22,%22%23FF4444%22),a.setAttribute(%22class%22,%22trend-slope%22),a.textContent%3D%60%24%7Bh.toFixed(1)%7D%20sec/month%20improvement%60,r.appendChild(a)%7Dcatch(t)%7Balert(%22Error:%20%22+t.message)%7D%7D)())

### Manual Install
1. Create a new bookmark in your browser.
2. Name it "Strava Fit Curve".
3. Copy the code from `strava_recent_efforts_fit_curve.js` and paste it into the URL field of the bookmark.
4. Make sure to add the `javascript:` prefix at the beginning of the code.

## Usage
1. Navigate to a Strava segment page where you have at least two recorded efforts.
2. Scroll down to the "My Efforts" chart.
3. Click the "Strava Fit Curve" bookmarklet.
4. A red, dashed trend line and text describing your improvement rate will appear on the chart.

## How It Works
The bookmarklet scans the "My Efforts" chart for the SVG element it's drawn in. It then finds all the `<circle>` elements that represent your individual efforts and extracts their coordinates. Using this data, it performs a simple linear regression to calculate a line of best fit. Finally, it injects new SVG elements (`<path>` and `<text>`) into the chart to draw the trend line and display the calculated improvement rate.

## Technical Notes
- This bookmarklet is highly dependent on the specific HTML structure and class names of the Strava website, particularly the SVG chart. If Strava updates its design, the bookmarklet may break.
- It requires at least two efforts on a segment to calculate a trend line.
- The "improvement" calculation is a simple linear projection and may not be statistically rigorous, but it serves as a good visual indicator.

## License
MIT

## Author
[Your Name/Alias Here]
