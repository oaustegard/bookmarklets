javascript:
/* @title: Copy Jira Link */
/* @description: Copies a formatted markdown link to the current Jira ticket to clipboard */
/* @domains: jira.meso-scale.com */
(function() {
    /* Copy HTML and plain text to clipboard */
    function copyToClip(doc, html, text = null) {
        function listener(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text || html);
            e.preventDefault();
        }
        doc.addEventListener("copy", listener);
        doc.execCommand("copy");
        doc.removeEventListener("copy", listener);
    }

    /* Get element value using Atlassian jQuery */
    function getElementValue(selector) {
        const result = AJS.$(selector).text().trim();
        return result || '';
    }

    /* Extract issue key - try both ticket view and Kanban view selectors */
    const key = getElementValue('#key-val') || AJS.$('#ghx-detail-issue').attr('data-issuekey');
    
    if (!key) {
        alert("Please select a ticket.");
        return;
    }

    /* Create the correct issue URL (works for both ticket page and Kanban) */
    const baseUrl = window.location.origin;
    const ticketUrl = `${baseUrl}/browse/${key}`;

    /* Get ticket details */
    const summary = getElementValue('#summary-val');
    const status = getElementValue('#opsbar-transitions_more span') || getElementValue('#status-val');
    const priority = getElementValue('#priority-val');
    const type = getElementValue('#type-val');
    const assignee = getElementValue('#assignee-val');

    /* Format links */
    const markdownLink = `[${key}](${ticketUrl})`;
    const description = `${summary} (${status}/${assignee}/${priority}/${type})`;
    const markdown = `_${markdownLink} - ${description}_`;
    const htmlLink = `<a href="${ticketUrl}">${key}</a>`;
    const html = `<em>${htmlLink} - ${description}</em>`;

    copyToClip(document, html, markdown);
})();
