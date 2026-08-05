javascript:
/* @title: Save Claude's last response */
/* @description: Saves the last response given by Claude as a .md file, named after the chat title */
/* @domains: claude.ai */
(function () {
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
      .normalize('NFKC')
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u205F-\u206F\uFE00-\uFE0F\uFEFF\uE000-\uF8FF]/g, '')
      .replace(/[\u{1F000}-\u{1FFFF}\u2190-\u2BFF]/gu, '')
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120)
      .replace(/[\s.]+$/, '');
    if (!fileName) { fileName = 'claude-response'; }
    fileName = fileName + '.md';
    console.log('Bookmarklet: Target filename', fileName);

    if (!navigator.clipboard || !navigator.clipboard.readText) {
      alert('✗ Clipboard read is not available in this browser.');
      return;
    }

    /* --- Trigger the app's own copy handler, then read the OS clipboard back.
       The site's copy write is async and not reliably interceptable (it may
       hold a bound reference to navigator.clipboard.writeText from before
       this bookmarklet ran), so read the real clipboard instead — with a
       short retry loop since the write may not have landed yet. --- */
    var readClipboardWithRetry = function (retriesLeft, delay) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          navigator.clipboard.readText().then(function (text) {
            if (text || retriesLeft <= 0) {
              resolve(text);
            } else {
              readClipboardWithRetry(retriesLeft - 1, delay).then(resolve, reject);
            }
          }).catch(function (err) {
            if (retriesLeft <= 0) {
              reject(err);
            } else {
              readClipboardWithRetry(retriesLeft - 1, delay).then(resolve, reject);
            }
          });
        }, delay);
      });
    };

    copyButton.click();

    readClipboardWithRetry(4, 200).then(function (captured) {
      if (!captured) {
        alert('✗ Clipboard was empty after copying. Try again, or make sure this tab has focus.');
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

      console.log('Bookmarklet: Complete —', fileName, '(' + captured.length + ' characters)');
    }).catch(function (err) {
      console.error('Bookmarklet error:', err);
      var hint = err && err.name === 'NotAllowedError'
        ? ' — grant clipboard-read permission for this site and try again.'
        : ': ' + (err && err.message);
      alert('✗ Could not read the clipboard' + hint);
    });
  } catch (e) {
    console.error('Bookmarklet error:', e);
    alert('Operation failed: ' + e.message);
  }
})();
