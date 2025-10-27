/**
 * Copy HTML and Plain Text to Clipboard
 *
 * Utility function to copy text to clipboard, uses the older execCommand as it's more reliable.
 * Copies both formatted (HTML) and plaintext versions.
 *
 * See copy-html-and-text-to-clipboard.md for full documentation.
 *
 * @param {Document} doc - The document object
 * @param {string} html - HTML content to copy
 * @param {string|null} text - Optional plain text version (defaults to html if not provided)
 */
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
