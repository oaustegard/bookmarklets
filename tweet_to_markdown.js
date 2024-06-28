javascript:(function(){
  /* Copy a Tweet page's url, author and tweet in Markdown format */
  const urlRegex = /^https?:\/\/(twitter\.com|x\.com)\/.+\/status\/\d+/;
  
  /* Regular expression for X.com page titles */
  const titleRegex = /^(.+) on X: "(.+)" \/ X$/;
  
  const url = window.location.href;
  const title = window.document.title;
  
  /* Check if we're on an X.com tweet page */
  if (!urlRegex.test(url)) {
    alert('This bookmarklet only works on X.com (formerly Twitter) tweet pages');
    return;
  }
  
  const match = title.match(titleRegex);
  
  /* If the title doesn't match the expected format, alert the user */
  if (!match) {
    alert('Unable to parse the tweet. The page format might have changed.');
    return;
  }
  
  const personName = match[1];
  const tweetBody = match[2].replace(/https?:\/\/t\.co\/\w+/, '').trim();
  
  /* Create the markdown formatted string */
  const markdown = `[${personName} on X:](${url})\n> ${tweetBody}`;
  
  /* Copy the markdown to clipboard */
  navigator.clipboard.writeText(markdown).catch(function() {
    alert('Failed to copy to clipboard. Your browser might not support this feature.');
  });
})();
