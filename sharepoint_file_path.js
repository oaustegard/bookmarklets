javascript:(function() {
/* @title: Get SharePoint File Path */
/* @description: Generates a Windows Explorer-compatible file path for SharePoint document libraries */
    /* Verify we're on a SharePoint site */
    if (typeof SP === 'undefined' || typeof SP.Site === 'undefined') {
        alert('This doesn\'t appear to be a SharePoint site.');
        return;
    }

    /* Validate domain -- change as needed*/
    function isValidDomain(server) {
        return (
            server.endsWith('.ACME.com') ||
            server.endsWith('.AC-ME.com') ||
            !server.includes('.')
        );
    }

    /* Extract the server name and path from the current URL */
    function extractPathInfo(url) {
        var match = url.match(/^https?:\/\/([^\/]+)(.+)/);
        if (!match) return null;
        var server = match[1];
        var path = match[2];

        if (!isValidDomain(server)) {
            alert('This doesn\'t appear to be a valid local SharePoint site.');
            return null;
        }

        /* Handle different URL formats */
        if (path.includes('_layouts/15/start.aspx#/')) {
            path = path.split('#')[1];
        } else if (path.includes('RootFolder=')) {
            path = decodeURIComponent(path.split('RootFolder=')[1].split('&')[0]);
        }

        /* Remove query parameters and specific SharePoint paths */
        path = path.split('?')[0].replace(/\/Forms\/AllItems\.aspx$/, '').replace(/\/SitePages\/.*$/, '/SitePages');

        return { server: server, path: path };
    }

    /* Create the Windows Explorer compatible path */
    function createExplorerPath(pathInfo) {
        if (!pathInfo) return 'Unable to extract path information';
        return 'file://' + pathInfo.server + '/DavWWWRoot' + pathInfo.path;
    }

    /* Copy text to clipboard */
    function copyToClipboard(text) {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            console.log('Path copied to clipboard');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
        document.body.removeChild(textArea);
    }

    /* Display the path in a dialog and copy to clipboard */
    function showAndCopyPath(path) {
        /* Create dialog */
        var dialog = document.createElement('div');
        dialog.style.cssText = 'position:fixed;bottom:10px;right:10px;background:white;padding:15px;border:1px solid #ccc;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.1);z-index:1000;font-family:Arial,sans-serif;';
        dialog.innerHTML = '<h3 style="margin-top:0;">Windows Explorer Path:</h3><p style="word-break:break-all;">' + path + '</p><button id="closeDialog" style="float:right;">Close</button>';
        document.body.appendChild(dialog);

        /* Copy to clipboard */
        copyToClipboard(path);

        /* Close dialog on button click or after 10 seconds */
        var closeButton = document.getElementById('closeDialog');
        closeButton.onclick = function() {
            document.body.removeChild(dialog);
        };
        setTimeout(function() {
            if (document.body.contains(dialog)) {
                document.body.removeChild(dialog);
            }
        }, 10000);
    }

    /* Main execution */
    var pathInfo = extractPathInfo(window.location.href);
    if (pathInfo) {
        var explorerPath = createExplorerPath(pathInfo);
        showAndCopyPath(explorerPath);
    }
})();
