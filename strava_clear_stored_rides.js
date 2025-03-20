javascript:(function() {
    /* Function to clear stored Strava ride data */
    function clearStoredRides() {
        /* Check if there are any rides stored */
        var storedRides = JSON.parse(localStorage.getItem('stravaRideSummaries')) || [];
        var rideCount = storedRides.length;
        
        if (rideCount === 0) {
            alert('No stored ride data found.');
            return;
        }
        
        /* Confirm before deleting */
        var confirmMessage = 'Are you sure you want to delete all ' + rideCount + ' stored ride summaries?';
        
        if (confirm(confirmMessage)) {
            /* Remove the item from localStorage */
            localStorage.removeItem('stravaRideSummaries');
            alert('Successfully cleared ' + rideCount + ' stored ride summaries.');
        }
    }
    
    /* Execute main function */
    clearStoredRides();
})();
