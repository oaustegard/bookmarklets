javascript:(function() {
    /* @title: Sort GitHub Files by Update */
    /* @description: Sorts GitHub repository files by last commit date instead of alphabetically */
    console.log('GitHub repo sort by date bookmarklet started');
    
    /* Find the table using aria-labelledby attribute */
    const table = document.querySelector('table[aria-labelledby="folders-and-files"]');
    if (!table) {
        console.log('Could not find the folders and files table');
        alert('Could not find the GitHub files table -- make sure you\'re on a GitHub code listing page');
        return;
    }
    
    console.log('Found table:', table);
    
    /* Get the tbody and all rows */
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    console.log('Found rows:', rows.length);
    
    /* Sort rows by commit date */
    rows.sort((a, b) => {
        const timeA = a.querySelector('relative-time');
        const timeB = b.querySelector('relative-time');
        
        /* Handle rows without commit times */
        if (!timeA && !timeB) return 0;
        if (!timeA) return 1;
        if (!timeB) return -1;
        
        const dateA = new Date(timeA.getAttribute('datetime'));
        const dateB = new Date(timeB.getAttribute('datetime'));
        
        /* Sort newest first */
        return dateB - dateA;
    });
    
    /* Reorder the table */
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    console.log('Table sorted by commit date (newest first)');
})();
