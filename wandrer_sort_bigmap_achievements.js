javascript:(function(){
    /* Expects to be called from https://wandrer.earth/dashboard/my_places -- brittle, likely to break with any change to the website */
    /* Get the iframe and its content */
    const iframe = document.querySelector("#my_places_iframe");
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    /* Find the table container */
    const tableContainer = iframeDocument.querySelector("#drawer > div.tw-relative.tw-flex.tw-flex-col.tw-overflow-auto > div > div:nth-child(2)");

    if (!tableContainer) {
        alert("Table container not found");
        return;
    }

    /* Find the div containing the rows */
    const rowsContainer = tableContainer.querySelector("div > div > div.tw-bg-white.tw-flex.tw-flex-grow.tw-flex-col.tw-overflow-scroll");

    if (!rowsContainer) {
        alert("Rows container not found");
        return;
    }

    /* Extract table rows */
    const rows = Array.from(rowsContainer.querySelectorAll("div.tw-flex.tw-justify-between.tw-items-center.tw-py-2.tw-border-b.tw-border-b-\\[\\#F8F8F8\\]"));

    if (rows.length === 0) {
        alert("No rows found");
        return;
    }

    /* Create header row */
    const headerRow = iframeDocument.createElement("div");
    headerRow.className = "tw-flex tw-justify-between tw-items-center tw-py-2 tw-border-b tw-border-b-[#F8F8F8] tw-font-bold";
    headerRow.innerHTML = `
        <p class="tw-text-sm tw-cursor-pointer" onclick="window.sortTable('name')">Name</p>
        <p class="tw-text-sm tw-cursor-pointer" onclick="window.sortTable('percentage')">Percentage</p>
    `;

    /* Insert header row */
    rowsContainer.insertBefore(headerRow, rows[0]);

    /* Sorting function */
    iframe.contentWindow.sortTable = function(column) {
        const sortedRows = rows.sort((a, b) => {
            const aValue = column === 'name' 
                ? a.querySelector("p").textContent.trim() 
                : parseFloat(a.querySelector("p.tw-text-slate-500.tw-text-\\[10px\\]").textContent);
            const bValue = column === 'name' 
                ? b.querySelector("p").textContent.trim() 
                : parseFloat(b.querySelector("p.tw-text-slate-500.tw-text-\\[10px\\]").textContent);

            if (column === 'name') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue - aValue; /* Sort percentages in descending order */
            }
        });

        /* Re-append sorted rows */
        sortedRows.forEach(row => rowsContainer.appendChild(row));
    };
})();
