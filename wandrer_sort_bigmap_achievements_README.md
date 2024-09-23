# Wandrer BigMap Table Sort Bookmarklet

## Overview

This bookmarklet adds sorting functionality to the achievements table on https://wandrer.earth/dashboard/my_places. It adds a header that allows sorting by either area name or achievement percentage.

## Features

- Adds a header row to the table
- Enables sorting by Name (alphabetically)
- Enables sorting by Percentage (numerically, descending)

## Installation

To install the bookmarklet:

1. Visit the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
2. a. From the dropdown list select wandrer_sort_bigmap_achievements.js:
2. b. Alternatively copy the below into the text area (note there is currently a bug that if you clear the field it prepends a hello world alert -- delete that before continuing)
```javascript
javascript:(function(){const iframe=document.querySelector("#my_places_iframe");const iframeDocument=iframe.contentDocument||iframe.contentWindow.document;const tableContainer=iframeDocument.querySelector("#drawer > div.tw-relative.tw-flex.tw-flex-col.tw-overflow-auto > div > div:nth-child(2)");if(!tableContainer){alert("Table container not found");return;}const rowsContainer=tableContainer.querySelector("div > div > div.tw-bg-white.tw-flex.tw-flex-grow.tw-flex-col.tw-overflow-scroll");if(!rowsContainer){alert("Rows container not found");return;}const rows=Array.from(rowsContainer.querySelectorAll("div.tw-flex.tw-justify-between.tw-items-center.tw-py-2.tw-border-b.tw-border-b-\\[\\#F8F8F8\\]"));if(rows.length===0){alert("No rows found");return;}const headerRow=iframeDocument.createElement("div");headerRow.className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-b-[#F8F8F8] tw-font-bold";headerRow.innerHTML=`<p class="tw-text-sm tw-cursor-pointer" onclick="window.sortTable('name')">Name</p><p class="tw-text-sm tw-cursor-pointer" onclick="window.sortTable('percentage')">Percentage</p>`;rowsContainer.insertBefore(headerRow,rows[0]);iframe.contentWindow.sortTable=function(column){const sortedRows=rows.sort((a,b)=>{const aValue=column==='name'?a.querySelector("p").textContent.trim():parseFloat(a.querySelector("p.tw-text-slate-500.tw-text-\\[10px\\]").textContent);const bValue=column==='name'?b.querySelector("p").textContent.trim():parseFloat(b.querySelector("p.tw-text-slate-500.tw-text-\\[10px\\]").textContent);if(column==='name'){return aValue.localeCompare(bValue);}else{return bValue-aValue;}});sortedRows.forEach(row=>rowsContainer.appendChild(row));};alert("Table header and sorting functionality added successfully!");})();
```

3. Click the "Create Bookmarklet" button
4. Drag the generated bookmarklet to your bookmarks bar

## Usage

1. Navigate to https://wandrer.earth/dashboard/my_places
2. Click More Details
3. Expand Explorer Achievements
4. Click the bookmarklet in your bookmarks bar
5. The table should now have a header row with clickable "Name" and "Percentage" columns
6. Click on "Name" to sort alphabetically
7. Click on "Percentage" to sort by percentage (descending order)

## Troubleshooting

If you encounter issues:

- Ensure you're on the correct webpage with the expected iframe and table structure
- Look in the Dev Console for errors
- File an issue here
- Alternatively: copy the code and the erro to your favorite capable AI and ask it to fix it for you

## Limitations

- This bookmarklet is designed only for the specific usage above
- Exceptionally brittle -- likely to break whenever the site is modified.
- Works on my machine in Chrome for Windows.
