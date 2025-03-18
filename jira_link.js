javascript: /* From either a Jira ticket or Kanban board, adds a formatted link to the selected Jira ticket to your clipboard, in Markdown and HTML format */
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
        var result = AJS.$(selector).text().trim();
        return result || '';
    }

    /* Extract issue key - try both ticket view and Kanban view selectors */
    var key = getElementValue('#key-val') || AJS.$('#ghx-detail-issue').attr('data-issuekey');
    
    if (!key) {
        alert("Please select a ticket.");
        return;
    }

    /* Create the correct issue URL (works for both ticket page and Kanban) */
    var baseUrl = window.location.origin;
    var ticketUrl = baseUrl + "/browse/" + key;

    /* Get ticket details */
    var summary = getElementValue('#summary-val');
    var status = getElementValue('#opsbar-transitions_more span') || getElementValue('#status-val');
    var priority = getElementValue('#priority-val');
    var type = getElementValue('#type-val');
    var assignee = getElementValue('#assignee-val');

    /* Format links */
    var markdownLink = `[${key}](${ticketUrl})`;
    var description = `${summary} (${status}/${assignee}/${priority}/${type})`;
    var markdown = `_${markdownLink} - ${description}_`;
    var htmlLink = `<a href="${ticketUrl}">${key}</a>`;
    var html = `<em>${htmlLink} - ${description}</em>`;

    copyToClip(document, html, markdown);
})();
