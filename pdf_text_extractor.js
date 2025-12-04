javascript:(function() {
    /* @title: Extract PDF Text */
    /* @description: Redirects to a PDF text extraction utility with the current PDF URL */
    let targetUrl = window.location.href;

    /* Special handling for arXiv abstract pages */
    if (targetUrl.includes('arxiv.org') && targetUrl.includes('/abs/')) {
        targetUrl = targetUrl.replace('/abs/', '/pdf/');
    }

    /* Redirect to PDF text extractor with the target URL */
    window.location.href = `https://austegard.com/web-utilities/pdf-text-extractor.html?${targetUrl}`;
})();
