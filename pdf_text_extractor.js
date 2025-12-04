javascript:(function() {
    let targetUrl = window.location.href;

    /* Special handling for arXiv abstract pages */
    if (targetUrl.includes('arxiv.org') && targetUrl.includes('/abs/')) {
        targetUrl = targetUrl.replace('/abs/', '/pdf/') + '.pdf';
    }

    /* Redirect to PDF text extractor with the target URL */
    window.location.href = `https://austegard.com/web-utilities/pdf-text-extractor.html?${targetUrl}`;
})();
