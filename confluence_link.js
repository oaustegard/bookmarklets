javascript:(function() {
    /* @title: Copy Confluence Link */
    /* @description: Copies a formatted markdown link to the current Confluence page to clipboard */
    /* @domains: confluence.meso-scale.com */
    document.body.appendChild(Object.assign(document.createElement('script'), {textContent: '_c=window.console||{};Object.keys(console).forEach(k=>{_c[k]=console[k];});'}));
    
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
  
    var pageTitleMeta = document.querySelector('meta[name="ajs-page-title"]');
    var spaceNameMeta = document.querySelector('meta[name="ajs-space-name"]');
  
    if (!pageTitleMeta || !spaceNameMeta) {
      alert("This script can only be executed on a Confluence page.");
      return;
    }
  
    var pageTitle = pageTitleMeta.getAttribute("content").replace(/ *\[[^\]]*]/g, "");
    var spaceName = spaceNameMeta.getAttribute("content");
    var pageUrl = window.location.href;
  
    var markdown = "[" + decodeURIComponent(pageTitle) +
                   " @ " + decodeURIComponent(spaceName) +
                   "](" + pageUrl + ")";
  
    var htmlLink = '<a href="' + pageUrl + '">' + decodeURIComponent(pageTitle) + ' @ ' + decodeURIComponent(spaceName) + '</a>';
  
    try {
      copyToClip(document, htmlLink, markdown);
      _c.log("Copied link to clipboard:", markdown);
    } catch (error) {
      _c.error("Failed to copy link to clipboard:", error);
      alert("An error occurred while copying the link to the clipboard. See console for details.");
    }
  })();
  