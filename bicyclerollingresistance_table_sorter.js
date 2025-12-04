javascript:(function(){
    /* @title: Sort Bicycle Rolling Resistance Table */
    /* @description: Adds sortable columns to the bicycle rolling resistance comparison table */
    
    let currentSortColumn = null;
    let currentSortDirection = 'asc';
    
    /* Get the data table body */
    function getDataTableBody() {
        return document.querySelector('#tableData');
    }
    
    /* Extract sortable value from a cell */
    function getCellValue(cell, columnClass) {
        if (!cell) return '';
        
        let value = '';
        
        /* Handle special cases based on column class */
        switch(columnClass) {
            case 'cYear':
            case 'cRating':
                value = cell.textContent.trim();
                break;
                
            case 'cWidth': /* Use measured value if available */
                const widthSpan = cell.querySelector('.widthm');
                value = widthSpan ? widthSpan.textContent : cell.textContent.trim();
                break;
                
            case 'cHeight':
                value = cell.textContent.trim();
                break;
                
            case 'cWeight': /* Use measured value if available */
                const weightSpan = cell.querySelector('.mweight');
                value = weightSpan ? weightSpan.textContent : cell.textContent.trim();
                break;
                
            case 'cRRExtraLow':
            case 'cRRLow':
            case 'cRRMed':
            case 'cRRHigh':
            case 'cRRExtraHigh':
            case 'cRRUltraHigh': /* RR columns */
                value = cell.textContent.trim().replace('--', '999');
                break;
                
            default:
                value = cell.textContent.trim();
        }
        
        /* Convert to number if it looks like a number */
        const numValue = parseFloat(value);
        return !isNaN(numValue) ? numValue : value.toLowerCase();
    }
    
    /* Sort the table by column class */
    function sortTable(columnClass) {
        console.log('Sorting by column class:', columnClass);
        
        const tbody = getDataTableBody();
        if (!tbody) {
            console.log('Data table body not found');
            return;
        }
        
        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length === 0) {
            console.log('No data rows found');
            return;
        }
        
        /* Get the column index from the header table */
        const headerTable = document.querySelector('#tableTirePagesID');
        const headerRow = headerTable.querySelector('thead tr');
        const headers = Array.from(headerRow.querySelectorAll('th'));
        const columnIndex = headers.findIndex(header => header.classList.contains(columnClass));
        
        if (columnIndex === -1) {
            console.log('Column not found:', columnClass);
            return;
        }
        
        /* Determine sort direction */
        if (currentSortColumn === columnClass) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortDirection = 'asc';
            currentSortColumn = columnClass;
        }
        
        console.log('Sort direction:', currentSortDirection, 'Column index:', columnIndex);
        
        /* Sort rows */
        rows.sort((a, b) => {
            const cellA = a.cells[columnIndex];
            const cellB = b.cells[columnIndex];
            
            const valueA = getCellValue(cellA, columnClass);
            const valueB = getCellValue(cellB, columnClass);
            
            let comparison = 0;
            if (valueA > valueB) comparison = 1;
            if (valueA < valueB) comparison = -1;
            
            return currentSortDirection === 'asc' ? comparison : -comparison;
        });
        
        /* Clear and repopulate tbody */
        tbody.innerHTML = '';
        rows.forEach((row, index) => {
            row.className = index % 2 === 0 ? 'even' : 'odd';
            tbody.appendChild(row);
        });
        
        console.log('Table sorted successfully');
        
        /* Update visual indicators */
        updateSortIndicators(columnClass);
    }
    
    /* Update visual sort indicators */
    function updateSortIndicators(activeColumnClass) {
        const headerTable = document.querySelector('#tableTirePagesID');
        if (!headerTable) return;
        
        const headers = headerTable.querySelectorAll('th');
        
        headers.forEach((header) => {
            /* Skip checkbox column */
            if (header.classList.contains('cSelect')) return;
            
            /* Remove existing arrow */
            const existingArrow = header.querySelector('.sort-arrow');
            if (existingArrow) existingArrow.remove();
            
            /* Get the column class for this header - exclude width classes */
            const columnClass = Array.from(header.classList).find(cls => cls.startsWith('c') && !cls.startsWith('tcw') && cls !== 'cSelect');
            if (!columnClass) return;
            
            /* Add arrow to all sortable headers */
            const arrow = document.createElement('span');
            arrow.className = 'sort-arrow';
            arrow.style.position = 'absolute';
            arrow.style.right = '2px';
            arrow.style.top = '2px';
            arrow.style.fontSize = '10px';
            arrow.style.lineHeight = '1';
            
            if (columnClass === activeColumnClass) {
                /* Active column - show current sort direction */
                arrow.textContent = currentSortDirection === 'asc' ? '▲' : '▼';
                arrow.style.color = '#0066cc';
                arrow.style.fontWeight = 'bold';
            } else {
                /* Inactive columns - show both arrows stacked */
                arrow.innerHTML = '▲<br>▼';
                arrow.style.color = '#ccc';
                arrow.style.fontWeight = 'normal';
            }
            
            header.style.position = 'relative';
            header.style.paddingRight = '15px';
            header.appendChild(arrow);
        });
    }
    
    /* Add click handlers to header table */
    function initializeSorting() {
        const headerTable = document.querySelector('#tableTirePagesID');
        if (!headerTable) {
            console.log('Header table not found');
            return;
        }
        
        const headers = headerTable.querySelectorAll('th');
        
        headers.forEach((header) => {
            /* Skip checkbox column */
            if (header.classList.contains('cSelect')) return;
            
            /* Get the column class for this header - exclude width classes */
            const columnClass = Array.from(header.classList).find(cls => cls.startsWith('c') && !cls.startsWith('tcw') && cls !== 'cSelect');
            if (!columnClass) return;
            
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            
            /* Remove existing onclick handlers */
            header.removeAttribute('onclick');
            
            /* Add new click handler with proper closure */
            header.addEventListener('click', function(e) {
                e.preventDefault();
                sortTable(columnClass);
            });
        });
        
        /* Add initial arrows to all sortable headers */
        updateSortIndicators(null); /* null means no active column initially */
        
        console.log('Table sorting initialized - click any column header to sort');
    }
    
    /* Initialize the sorting functionality */
    initializeSorting();
    
})();
