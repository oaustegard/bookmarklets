/**
 * Create Console Alias (_c)
 *
 * Utility snippet that ensures the console object is available to the bookmarklet
 * and aliases it to a more concise _c for easier debugging.
 *
 * See create-console-alias.md for full documentation.
 *
 * Usage: After running, use _c.log(), _c.error(), etc. instead of console.log()
 */
document.body.appendChild(Object.assign(document.createElement('script'), {textContent: '_c=window.console||{};Object.keys(console).forEach(k=>{_c[k]=console[k];});'}));
