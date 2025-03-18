javascript: /* From either a Jira ticket or Kanban board, adds a formatted link to the selected Jira ticket to your clipboard, in Markdown and HTML format */
(function() {
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

    function __$(selector, attribute = 'innerText') {
        var element = document.querySelector(selector);
        if (!element) return ' ';
        return attribute === 'innerText' ? element.innerText.trim() : element.getAttribute(attribute).trim();
    }

    var url = window.location.href.split(/[?#]/)[0];
    var key = AJS.$('#key-val').text() || __$('#ghx-detail-issue', 'data-issuekey');
    if (!key || key === ' ') {
        alert("Please select a ticket.");
        return;
    }

    var summary = AJS.$('#summary-val').text() || __$('#summary-val');
    var status = AJS.$('#opsbar-transitions_more span').text() || __$('#status-val');
    var priority = (AJS.$('#priority-val').text() || __$('#priority-val')).trim();
    var type = (AJS.$('#type-val').text() || __$('#type-val')).trim();
    var assignee = (AJS.$('#assignee-val').text() || __$('#assignee-val')).trim();

    var markdownLink = `[${key}](${url})`;
    var description = `${summary} (${status}/${assignee}/${priority}/${type})`;
    var markdown = `_${markdownLink} - ${description}_`;
    var htmlLink = `<a href="${url}">${key}</a>`;
    var html = `<em>${htmlLink} - ${description}</em>`;

    copyToClip(document, html, markdown);
})();
