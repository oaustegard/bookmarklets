javascript:(function() {
    /* Extract ride data from Strava page */
    function extractRideData() {
        /* Get the heading section with ride summary */
        var headingSection = document.querySelector('section#heading');
        
        if (!headingSection) {
            alert('Unable to find ride data. Make sure you are on a Strava ride page.');
            return null;
        }
        
        /* Get the text content from the heading section */
        var summaryText = headingSection.innerText;
        
        /* Create timestamp for the extraction */
        var timestamp = new Date().toISOString();
        
        /* Create structured data object */
        var rideData = {
            summary: summaryText,
            url: window.location.href,
            timestamp: timestamp
        };
        
        return rideData;
    }
    
    /* Store ride data in localStorage */
    function storeRideData(rideData) {
        /* Get existing ride data from localStorage or initialize empty array */
        var storedRides = JSON.parse(localStorage.getItem('stravaRideSummaries')) || [];
        
        /* Add new ride data to the array */
        storedRides.push(rideData);
        
        /* Save updated array back to localStorage */
        localStorage.setItem('stravaRideSummaries', JSON.stringify(storedRides));
        
        return storedRides.length;
    }
    
    /* Main execution */
    var rideData = extractRideData();
    
    if (rideData) {
        var totalRides = storeRideData(rideData);
        alert('Ride data saved! Total rides stored: ' + totalRides);
    }
})();
