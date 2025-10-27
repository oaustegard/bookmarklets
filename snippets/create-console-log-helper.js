/**
 * Create Console Log Helper (_lg)
 *
 * Utility snippet for logging statements to the console, as console.log does not always work reliably in bookmarklets.
 * Include it in a bookmarklet and use _lg() statements for debugging.
 *
 * See create-console-log-helper.md for full documentation.
 *
 * Usage: _lg('Debug message'), _lg({data: 'value'})
 */
document.body.appendChild(Object.assign(document.createElement('script'), { textContent: 'window._lg = function(msg) { console.log(msg); }' }));