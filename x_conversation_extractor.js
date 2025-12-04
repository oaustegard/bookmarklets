javascript:(function() {
  /* @title: Extract X Conversation */
  /* @description: Scrolls through and extracts all tweets from an X/Twitter conversation thread */
  let collectedTweets = new Set();

  function collectData() {
    document.querySelectorAll('article').forEach(article => {
      const tweetDiv = article.querySelector('div[data-testid="tweetText"]');
      const popularityDiv = article.querySelector('div[role="group"]');
      if (tweetDiv && popularityDiv) {
        const tweetText = tweetDiv.innerText.trim();
        const popularityData = popularityDiv.ariaLabel ? popularityDiv.ariaLabel.trim() : 'No popularity data';
        const tweetData = `${tweetText} - ${popularityData}`;
        collectedTweets.add(tweetData);
      }
    });
  }

  function scrollAndCollect() {
    collectData();
    window.scrollBy(0, window.innerHeight);
    if ((window.innerHeight + window.pageYOffset) < document.body.scrollHeight) {
      setTimeout(scrollAndCollect, 200);
    } else {
      const newWindow = window.open("", "_blank");
      newWindow.document.write("<pre>" + Array.from(collectedTweets).join("\n\n") + "</pre>");
    }
  }

  scrollAndCollect();
})();
