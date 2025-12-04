javascript:(function(){
    /* @title: Sort Datalists Alphabetically */
    /* @description: Finds and sorts all datalist elements on the page alphabetically */
    const datalists = document.querySelectorAll('datalist');
    console.log(`Found ${datalists.length} datalist(s) to sort`);
    
    if (datalists.length === 0) {
        alert('No datalist elements found on this page.');
        return;
    }
    
    let totalSorted = 0;
    
    datalists.forEach((datalist, index) => {
        console.log(`Processing datalist ${index + 1}:`, datalist);
        
        /* Get all option elements from this datalist */
        const options = Array.from(datalist.querySelectorAll('option'));
        console.log(`Found ${options.length} options in datalist ${index + 1}`);
        
        if (options.length === 0) {
            console.log(`Datalist ${index + 1} is empty, skipping`);
            return;
        }
        
        /* Create array of option data for sorting */
        const optionData = options.map(option => ({
            text: option.textContent.trim(),
            value: option.value || option.textContent.trim(),
            element: option
        }));
        
        /* Sort by text content (case-insensitive) */
        optionData.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
        console.log('Sorted options:', optionData.map(opt => opt.text));
        
        /* Clear the datalist and append sorted options */
        datalist.innerHTML = '';
        
        optionData.forEach(optData => {
            const newOption = document.createElement('option');
            newOption.textContent = optData.text;
            if (optData.value !== optData.text) {
                newOption.value = optData.value;
            }
            datalist.appendChild(newOption);
        });
        
        totalSorted++;
        console.log(`Datalist ${index + 1} sorted successfully`);
    });
    
    console.log(`Sorting complete! ${totalSorted} datalist(s) processed.`);
})();
