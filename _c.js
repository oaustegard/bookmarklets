/* Utility snippet that seeks to ensure that the console object is available to the bookmarklet
and also aliases it to a more concise _c, naively assuming it is available */
document.body.appendChild(Object.assign(document.createElement('script'), {textContent: '_c=window.console||{};Object.keys(console).forEach(k=>{_c[k]=console[k];});'}));
