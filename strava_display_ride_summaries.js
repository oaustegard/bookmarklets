javascript:
(function() {
    /* @title: Display Strava Ride Summaries */
    /* @description: Displays all stored ride summaries from localStorage in a formatted view */
    /* @domains: strava.com */
    /* get the stored ride summaries and display them in a new window */
    var rideSummaries = JSON.parse(localStorage.getItem('rideSummaries')) || [];
    /* get rid of the following phrases */
    var trimPhrases = ['Embed on Blog', 'Give kudos', 'Collapse', 'View Flybys', 'Show Less', 'View all', 'Add private notes', 'Only you can view this activity. It won\'t appear on segment leaderboards and may not count toward some challenges'];
    var formattedData = rideSummaries.join('\n\n-------------\n\n');
    trimPhrases.forEach(function(phrase) {
        formattedData = formattedData.replace(phrase, '');
    });
    var w = window.open('', '_blank');
    w.document.write('<html><head><title>Rides</title></head><body>');
    w.document.write('<pre>' + formattedData + '</pre>');
    w.document.write('</body></html>');
    w.document.close();
})();
