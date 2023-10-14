/* The following is a utility snippet for logging statements to the console as console.log does not work in bookmarklets -- 
include it in a bookmarklet and sprinkle the bookmarklet with _lg statements for aiding in debugging */
document.body.appendChild(Object.assign(document.createElement('script'), { textContent: 'window._lg = function(msg) { console.log(msg); }' }));