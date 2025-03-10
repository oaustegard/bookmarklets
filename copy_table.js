javascript:(function() {
    /* See https://github.com/oaustegard/bookmarklets/blob/main/copy_table_README.md */
    const tables = document.querySelectorAll('table');
    
    if (tables.length === 0) {
        alert('No tables found on page');
        return;
    }
    
    /* Convert table to array of objects */
    function tableToObjects(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length < 2) return [];
        
        const headers = Array.from(rows[0].querySelectorAll('th, td'))
            .map(cell => cell.textContent.trim());
        
        const result = [];
        for (let i = 1; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll('td'));
            const obj = {};
            
            headers.forEach((header, index) => {
                if (index < cells.length) {
                    obj[header] = cells[index].textContent.trim();
                }
            });
            
            result.push(obj);
        }
        
        return result;
    }
    
    /* Copy data to clipboard */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    /* Handle table selection if multiple tables exist */
    if (tables.length > 1) {
        /* Store original table styles */
        const originalStyles = Array.from(tables).map(table => ({
            table,
            outline: table.style.outline,
            position: table.style.position,
            zIndex: table.style.zIndex
        }));
        
        /* Highlight tables on hover */
        tables.forEach((table, index) => {
            table.style.outline = '3px solid transparent';
            table.style.position = 'relative';
            table.style.zIndex = '1';
            
            /* Add hover effect */
            table.addEventListener('mouseover', function() {
                this.style.outline = '3px solid blue';
                this.style.cursor = 'pointer';
            });
            
            table.addEventListener('mouseout', function() {
                this.style.outline = '3px solid transparent';
            });
            
            /* Add click handler */
            table.addEventListener('click', function() {
                /* Clean up styles */
                originalStyles.forEach(item => {
                    item.table.style.outline = item.outline;
                    item.table.style.position = item.position;
                    item.table.style.zIndex = item.zIndex;
                    
                    /* Remove event listeners */
                    item.table.removeEventListener('mouseover', arguments.callee);
                    item.table.removeEventListener('mouseout', arguments.callee);
                    item.table.removeEventListener('click', arguments.callee);
                });
                
                /* Process selected table */
                const data = tableToObjects(this);
                const json = JSON.stringify(data, null, 2);
                copyToClipboard(json);
                alert('Table copied to clipboard as JSON');
            });
        });
        
        /* Add instruction overlay */
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:10px;border-radius:5px;z-index:10000;font-family:sans-serif;';
        overlay.innerHTML = 'Click on a table to convert it to JSON';
        document.body.appendChild(overlay);
        
        /* Add option to cancel */
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.style.cssText = 'margin-left:10px;background:red;border:none;color:white;border-radius:3px;cursor:pointer;';
        cancelBtn.addEventListener('click', function() {
            /* Clean up */
            originalStyles.forEach(item => {
                item.table.style.outline = item.outline;
                item.table.style.position = item.position;
                item.table.style.zIndex = item.zIndex;
            });
            document.body.removeChild(overlay);
        });
        overlay.appendChild(cancelBtn);
    } else {
        /* Only one table, process directly */
        const table = tables[0];
        const data = tableToObjects(table);
        const json = JSON.stringify(data, null, 2);
        copyToClipboard(json);
        alert('Table copied to clipboard as JSON');
    }
})();
