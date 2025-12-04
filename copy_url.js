javascript:
/* @title: Copy URL */
/* @description: Copies the current page URL to clipboard */
void(function() {
	loc = window.location;
	page_title = window.document.title;
	w = window.open(null, null, "height=150,width=900");
	d = w.document;
	d.open();
	d.write(`<html><head><title>Create formatted link</title></head><body><form onsubmit="return false"><table><tr><th>URL:</th><td><input id="url" type="text" size="100"></td></tr><tr><th>Link title:</th><td><input id="title" type="text" size="100"></td></tr><tr><td/><td><input id="copy" type="submit" value="Copy & Close"/></td></tr></table></form></body></html>`);
	l = d.getElementById("url");
	t = d.getElementById("title");
	c = d.getElementById("copy");
	l.value = window.location.toString();
	t.value = page_title;
	function copyToClip(doc, html, text = null) {
		function listener(e) {
			e.clipboardData.setData("text/html", html);
			e.clipboardData.setData("text/plain", text || html);
			e.preventDefault();
		}
		doc.addEventListener("copy", listener);
		doc.execCommand("copy");
		doc.removeEventListener("copy", listener);
	};
	c.onclick = function() {
		e = d.createElement("a");
		e.href = l.value;
		e.innerHTML = t.value;
		mdlink = `[${t.value}](${l.value})`;
		copyToClip(d, e.outerHTML, mdlink);
		w.close();
	};
	d.close();
	c.focus();
})()
