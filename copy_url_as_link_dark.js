javascript:(function() {
    /* @title: Copy URL as Markdown Link (Dark) */
    /* @description: Copies the page title and URL as a markdown link with dark mode styling */
    var loc = window.location;
    var page_title = window.document.title;
    var w = window.open('about:blank', '_blank', 'height=190,width=400');
    w.document.title = 'Create Formatted Link';
    var d = w.document;
    function createElem(tag, props, parent) {
        var elem = d.createElement(tag);
        for (var key in props) {
            if (key === 'textContent') elem.textContent = props[key];
            else elem.setAttribute(key, props[key]);
        }
        if (parent) parent.appendChild(elem);
        return elem;
    }
    var css = d.createElement('style');
    css.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #474747; margin: 0; padding: 10px; box-sizing: border-box; overflow: hidden; }
        .container { background-color: #474747; padding: 10px; max-width: 380px; margin: 10px auto 0; }
        label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 2px; color: #ffffff; }
        input { width: 100%; padding: 5px 8px; border: 1px solid #6b6b6b; border-radius: 4px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; background-color: #3c3c3c; color: #ffffff; }
        button { background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.3s; display: block; width: 100%; margin-top: 5px; }
        button:hover { background-color: #2563eb; }
        button:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }
    `;
    d.head.appendChild(css);
    var container = createElem('div', {class: 'container'}, d.body);
    var form = createElem('form', {}, container);
    createElem('label', {textContent: 'URL:'}, form);
    var urlInput = createElem('input', {id: 'url', type: 'text'}, form);
    createElem('label', {textContent: 'Link Title:'}, form);
    var titleInput = createElem('input', {id: 'title', type: 'text'}, form);
    var copyButton = createElem('button', {id: 'copy', textContent: 'Copy & Close'}, form);
    urlInput.value = loc.toString();
    titleInput.value = page_title;
    function copyToClip(doc, html, text) {
        text = text || html;
        var listener = function(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        };
        doc.addEventListener("copy", listener);
        doc.execCommand("copy");
        doc.removeEventListener("copy", listener);
    }
    copyButton.addEventListener("click", function(event) {
        event.preventDefault();
        var e = d.createElement("a");
        e.href = urlInput.value;
        e.textContent = titleInput.value;
        var mdlink = "[" + titleInput.value + "](" + urlInput.value + ")";
        copyToClip(d, e.outerHTML, mdlink);
        w.close();
    });
    copyButton.focus();
})();