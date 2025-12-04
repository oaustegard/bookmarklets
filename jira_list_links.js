javascript:(function(){
    /* @title: List Jira Links */
    /* @description: Extracts and displays all links found on the current Jira page */
    /* @domains: jira.meso-scale.com */
    function getTextContent(selector, parent=document) {
        const element = parent.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }

    function getAttribute(selector, attribute, parent=document) {
        const element = parent.querySelector(selector);
        return element ? element.getAttribute(attribute) : '';
    }

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

    const rows = document.querySelectorAll('tr.issuerow');
    const baseURL = window.location.origin;

    let markdownList = '';
    let htmlList = '';
    rows.forEach(row => {
        const key = getTextContent('.issuekey a', row);
        const link = getAttribute('.issuekey a', 'href', row);
        const summary = getTextContent('.summary a', row);
        const status = getTextContent('.status span', row);
        const priority = getAttribute('.priority img', 'alt', row);
        const type = getAttribute('.issuetype img', 'alt', row);
        const assignee = getTextContent('.assignee a', row) || 'Unassigned';
        
        const url = `${baseURL}${link}`;
        const markdownLink = `[${key}](${url})`;
        const description = `${summary} (${status}/${priority}/${type}/${assignee})`;
        const markdown = `_${markdownLink} - ${description}_`;
        const htmlLink = `<a href="${url}">${key}</a>`;
        const html = `<em>${htmlLink} - ${description}</em>`;
        
        markdownList += `* ${markdown}\n`;
        htmlList += `<li>${html}</li>`;
    });

    const fullHtml = `<ul>${htmlList}</ul>`;
    copyToClip(document, fullHtml, markdownList);
})();
