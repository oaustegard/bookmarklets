javascript:(function() {
    /* Get the stored ride summaries from localStorage */
    function getStoredRides() {
        /* Use the same key as the extraction bookmarklet */
        var storedRides = JSON.parse(localStorage.getItem('stravaRideSummaries')) || [];
        
        if (storedRides.length === 0) {
            alert('No ride data found in localStorage. Use the extraction bookmarklet first.');
            return null;
        }
        
        return storedRides;
    }
    
    /* Clean the text by removing unwanted phrases */
    function cleanRideText(text) {
        var trimPhrases = [
            'Embed on Blog', 
            'Give kudos', 
            'Collapse', 
            'View Flybys', 
            'Show Less', 
            'View all', 
            'Add private notes',
            'Add Others',
            'Ride this route again to see how you\'re progressing.',
            'Learn More',
            'Only you can view this activity. It won\'t appear on segment leaderboards and may not count toward some challenges'
        ];
        
        var cleanedText = text;
        trimPhrases.forEach(function(phrase) {
            /* Global replace all instances of each phrase */
            cleanedText = cleanedText.replace(new RegExp(phrase, 'g'), '');
        });
        
        /* Clean up excessive whitespace */
        cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
        
        return cleanedText;
    }
    
    /* Format rides for display with metadata */
    function formatRidesForDisplay(rides) {
        var formattedContent = '';
        
        rides.forEach(function(ride, index) {
            /* Add metadata */
            formattedContent += '--- Ride #' + (index + 1) + ' ---\n';
            formattedContent += 'Extracted: ' + new Date(ride.timestamp).toLocaleString() + '\n';
            formattedContent += 'URL: ' + ride.url + '\n\n';
            
            /* Add cleaned summary text */
            formattedContent += cleanRideText(ride.summary) + '\n\n';
            formattedContent += '------------------------\n\n';
        });
        
        return formattedContent;
    }
    
    /* Display rides in a new window with basic styling */
    function displayRides(formattedContent) {
        var w = window.open('', '_blank');
        
        w.document.write(`
            <html>
            <head>
                <title>Strava Ride Summaries</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    pre { white-space: pre-wrap; }
                    .controls { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Strava Ride Summaries</h1>
                <div class="controls">
                    <button onclick="window.print()">Print</button>
                    <button onclick="navigator.clipboard.writeText(document.querySelector('pre').textContent)">Copy All</button>
                    <button onclick="if(confirm('Clear all stored rides?')) { localStorage.removeItem('stravaRideSummaries'); alert('Rides cleared!'); window.close(); }">Clear Stored Rides</button>
                </div>
                <pre>${formattedContent}</pre>
            </body>
            </html>
        `);
        
        w.document.close();
    }
    
    /* Main execution */
    var storedRides = getStoredRides();
    
    if (storedRides) {
        var formattedContent = formatRidesForDisplay(storedRides);
        displayRides(formattedContent);
    }
})();
