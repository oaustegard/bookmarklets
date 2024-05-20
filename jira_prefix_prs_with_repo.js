javascript:(function() { /* Augment Jira's PR listing with repo info */ 
    var dialog = document.getElementById('devstatus-pullrequest-detail-dialog');
    if (dialog) {
        dialog.style.width = '1200px';
    }
    var links = document.querySelectorAll('a.pullrequest-link.ellipsis');
    links.forEach(function(link) {
        var title = link.title;
        var href = link.href;
        var matches = href.match(/projects\/[^\/]+\/repos\/([^\/]+)\/pull-requests\/\d+/);
        if (matches) {
            var repo = matches[1];
            link.textContent = '[' + repo + '] ' + title;
        }
    });
})();
