javascript:(function() {
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

    var url = window.location.href.split(/[?#]/)[0];
    var key = AJS.$('#key-val').text();
    var summary = AJS.$('#summary-val').text();
    var status = AJS.$('#opsbar-transitions_more span').text();
    var priority = AJS.$('#priority-val').text().trim();
    var type = AJS.$('#type-val').text().trim();
    var assignee = AJS.$('#assignee-val').text().trim();

    var markdownLink = "[" + key + "](" + url + ")";
    var description = summary + " (" + status + "/" + priority + "/" + type + "/" + assignee + ")";
    var markdown = "_" + markdownLink + " - " + description + "_";
    var htmlLink = '<a href="' + url + '">' + key + '</a>';
    var html = "<em>" + htmlLink + " - " + description + "</em>";
    
    copyToClip(document, html, markdown);
})();
