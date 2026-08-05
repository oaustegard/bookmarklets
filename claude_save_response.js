javascript:(function () {
  /* Save Claude's last response as a .md file, named after the chat title */
  console.log('Bookmarklet: Starting');
  try {
    /* --- Locate the copy button for the last response --- */
    var buttons = document.querySelectorAll('button[aria-label="Copy"]');
    if (!buttons.length) {
      alert('✗ Element not found: no Copy button on this page.');
      return;
    }
    var copyButton = buttons[buttons.length - 1];

    /* --- Derive the filename from the chat title --- */
    var titleEl = document.querySelector('[data-testid="chat-title-split"]');
    var rawTitle = titleEl ? (titleEl.innerText || '') : '';
    var fileName = rawTitle
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120)
      .replace(/[\s.]+$/, '');
    if (!fileName) { fileName = 'claude-response'; }
    fileName = fileName + '.md';
    console.log('Bookmarklet: Target filename', fileName);

    /* --- Intercept the copy instead of reading the clipboard back --- */
    var captured = null;
    var originalWriteText = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText.bind(navigator.clipboard)
      : null;

    if (originalWriteText) {
      navigator.clipboard.writeText = function (text) {
        captured = text;
        return Promise.resolve();
      };
    }

    var onCopy = function (e) {
      if (e.clipboardData) {
        var data = e.clipboardData.getData('text/plain');
        if (data) { captured = data; }
      }
    };
    document.addEventListener('copy', onCopy, true);

    var restore = function () {
      if (originalWriteText) { navigator.clipboard.writeText = originalWriteText; }
      document.removeEventListener('copy', onCopy, true);
    };

    /* --- Trigger the app's own copy handler --- */
    copyButton.click();

    /* --- Give the handler a moment, then write the file --- */
    setTimeout(function () {
      try {
        restore();
        if (!captured) {
          alert('✗ Could not capture the response markdown.');
          console.log('Bookmarklet: Complete (no content)');
          return;
        }
        console.log('Bookmarklet: Captured', captured.length, 'characters');

        var blob = new Blob([captured], { type: 'text/markdown;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);

        alert('✓ Saved ' + fileName + ' (' + captured.length + ' characters)');
        console.log('Bookmarklet: Complete');
      } catch (inner) {
        restore();
        console.error('Bookmarklet error:', inner);
        alert('Operation failed: ' + inner.message);
      }
    }, 600);
  } catch (e) {
    console.error('Bookmarklet error:', e);
    alert('Operation failed: ' + e.message);
  }
})();
