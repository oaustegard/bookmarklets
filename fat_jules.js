javascript: (function() {
if (window.location.hostname === 'jules.google.com') {
const style = document.createElement('style');
style.textContent = '.chat-only[_ngcontent-ng-c387783336]{max-width:1000px!important}';
document.head.appendChild(style);
} else {
alert('This bookmarklet only works on jules.google.com');
}
})();
