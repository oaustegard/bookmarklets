javascript:
(function() {
    /* @title: Extract Short Strava Summary */
    /* @description: Extracts a concise ride summary from the current Strava activity page */
    /* @domains: strava.com */
    /* simply get the text of the section#heading and store it in local storage */
    var summary = document.querySelector('section#heading').innerText;    
    var rideSummaries = JSON.parse(localStorage.getItem('rideSummaries')) || [];
    rideSummaries.push(summary);
    localStorage.setItem('rideSummaries', JSON.stringify(rideSummaries));
})();

