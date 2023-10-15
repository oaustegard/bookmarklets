javascript: (function() {
	if (window.location.hostname !== 'arxiv.org') {
		alert('This bookmarklet only works on pdfs on arxiv.org');
		return;
	}
	var currentURL = window.location.href;
	var newURL = currentURL.replace("/pdf/", "/abs/").replace(".pdf", "");
	window.open(newURL, '_blank');
})();