javascript:(() => {
  /* Bsky Post Processor Bookmarklet
   * This bookmarklet extracts the current Bsky post URL and opens
   * the Austegard Bsky processor in a new window with the appropriate 
   * parameters. Use on any bsky.app post page.
   */
  
  /* Check if we're on a Bsky post page */
  if (!window.location.hostname.includes('bsky.app') || !window.location.pathname.includes('/post/')) {
    alert('This bookmarklet only works on Bsky post pages');
    return;
  }
  
  /* Get the current URL and encode it */
  const currentUrl = encodeURIComponent(window.location.href);
  
  /* Construct the processor URL */
  const processorUrl = `https://austegard.com/bsky/processor.html?tab=post-tab&url=${currentUrl}&quotes=false`;
  
  /* Open the processor in a new window */
  window.open(processorUrl, '_blank');
})();
