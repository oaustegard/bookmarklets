javascript:
(function() {
    /* simply get the text of the section#heading and store it in local storage */
    var summary = document.querySelector('section#heading').innerText;    
    var rideSummaries = JSON.parse(localStorage.getItem('rideSummaries')) || [];
    rideSummaries.push(summary);
    localStorage.setItem('rideSummaries', JSON.stringify(rideSummaries));
})();

