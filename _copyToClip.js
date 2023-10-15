/* utility function to copy text to clipboard, uses the older execCommand as it's more reliable -- copies both formatted and plaintext*/
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
