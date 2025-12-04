javascript:(function() {
    /* @title: Copy URL with Preview */
    /* @description: Copies the URL with a preview overlay showing the copied content */
    var loc = window.location;
    var page_title = window.document.title;
    var w = window.open('about:blank', '_blank', 'height=420,width=500');
    w.document.title = 'Create Formatted Link';
    var d = w.document;
    function createElem(tag, props, parent) {
        var elem = d.createElement(tag);
        for (var key in props) {
            if (key === 'textContent') elem.textContent = props[key];
            else if (key === 'innerHTML') elem.innerHTML = props[key];
            else elem.setAttribute(key, props[key]);
        }
        if (parent) parent.appendChild(elem);
        return elem;
    }
    var css = d.createElement('style');
    css.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; box-sizing: border-box; }
        .container { background-color: white; padding: 20px; max-width: 460px; }
        label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; color: #4b5563; }
        input, textarea { width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; margin-bottom: 12px; box-sizing: border-box; }
        textarea { resize: vertical; min-height: 60px; }
        button { background-color: #3b82f6; color: white; padding: 10px 15px; border: none; border-radius: 4px; font-size: 16px; font-weight: 500; cursor: pointer; transition: background-color 0.3s; display: block; width: 100%; margin-top: 10px; }
        button:hover { background-color: #2563eb; }
        button:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }
        .preview { margin-top: 15px; padding: 10px; background-color: #f9fafb; border-radius: 4px; font-size: 14px; }
        .preview h3 { margin-top: 0; font-size: 16px; color: #4b5563; }
        .preview p { margin: 5px 0; word-break: break-all; }
    `;
    d.head.appendChild(css);
    var container = createElem('div', {class: 'container'}, d.body);
    var form = createElem('form', {}, container);
    createElem('label', {textContent: 'URL:'}, form);
    var urlInput = createElem('input', {id: 'url', type: 'text'}, form);
    createElem('label', {textContent: 'Link Title:'}, form);
    var titleInput = createElem('input', {id: 'title', type: 'text'}, form);
    var copyButton = createElem('button', {id: 'copy', textContent: 'Copy & Close'}, form);
    var preview = createElem('div', {class: 'preview'}, container);
    createElem('h3', {textContent: 'Preview:'}, preview);
    var htmlPreview = createElem('p', {}, preview);
    createElem('label', {textContent: 'Markdown:'}, preview);
    var mdTextarea = createElem('textarea', {readonly: 'readonly'}, preview);
    urlInput.value = loc.toString();
    titleInput.value = page_title;
    function updatePreview() {
        var url = urlInput.value;
        var title = titleInput.value;
        htmlPreview.innerHTML = '';
        createElem('a', {href: url, textContent: title, target: '_blank'}, htmlPreview);
        mdTextarea.value = '[' + title + '](' + url + ')';
    }
    urlInput.addEventListener('input', updatePreview);
    titleInput.addEventListener('input', updatePreview);
    updatePreview();
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
