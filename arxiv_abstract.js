javascript:(function() {
    /* Toggles between arXiv PDF and abstract views, working in both directions */
    if (window.location.hostname !== 'arxiv.org') {
        alert('This bookmarklet only works on arxiv.org');
        return;
    }
    var currentURL = window.location.href;
    var newURL;
    if (currentURL.includes('/pdf/')) {
        newURL = currentURL.replace('/pdf/', '/abs/').replace('.pdf', '');
    } 
    else if (currentURL.includes('/abs/')) {
        newURL = currentURL.replace('/abs/', '/pdf/') + '.pdf';
    }
    else {
        alert('This bookmarklet only works on arXiv abstract or PDF pages');
        return;
    }
    window.open(newURL, '_blank');
})();
