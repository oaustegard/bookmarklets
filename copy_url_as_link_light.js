javascript:(function() {
    var loc = window.location;
    var page_title = window.document.title;
    var w = window.open('about:blank', '_blank', 'height=200,width=400');
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
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 10px; box-sizing: border-box; overflow: hidden; }
        .container { background-color: white; padding: 10px; max-width: 380px; margin: 20px auto 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 2px; color: #4b5563; }
        input { width: 100%; padding: 5px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; }
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