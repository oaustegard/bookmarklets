javascript:
/* @title: Scrape XCancel Thread */
/* @description: Scrapes the currently visible xcancel thread replies, adding them to any previously stored replies (Step 1/2 - see xcancel_render_scraped_thread.js */
/* @domains: xcancel.com */
(function() {
  var KEY = 'xcancelScrape';
  var raw = sessionStorage.getItem(KEY);
  var stored = raw ? JSON.parse(raw) : {
    url: '',
    tweets: []
  };
  var path = window.location.pathname;
  var parts = path.split('/status/');
  var opId = parts.length > 1 ? parts[1].split('/')[0] : '';
  if (stored.url && stored.url !== path) {
    stored = {
      url: path,
      tweets: []
    };
  }
  stored.url = path;
  var seen = new Set(stored.tweets.map(function(t) {
    return t.id;
  }));
  var added = 0;
  var items = document.querySelectorAll('div.timeline-item:not(.more-replies)');
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var tweetLink = item.querySelector('a.tweet-link');
    var href = tweetLink ? tweetLink.getAttribute('href') : '';
    var hparts = href.split('/status/');
    var tid = hparts.length > 1 ? hparts[1].split('#')[0] : (item.classList.contains('thread-line') ? opId : '');
    if (!tid || seen.has(tid)) continue;
    seen.add(tid);
    var uel = item.querySelector('a.username');
    var fel = item.querySelector('a.fullname');
    var del = item.querySelector('span.tweet-date a');
    var cel = item.querySelector('.tweet-content');
    var cl = item.classList;
    stored.tweets.push({
      id: tid,
      username: uel ? uel.textContent.trim() : '',
      fullname: fel ? fel.textContent.trim() : '',
      timestamp: del ? del.getAttribute('title') : '',
      content: cel ? cel.textContent.trim() : '',
      isThreadLine: cl.contains('thread-line'),
      isThread: cl.contains('thread') && !cl.contains('thread-line'),
      isThreadLast: cl.contains('thread-last')
    });
    added++;
  }
  sessionStorage.setItem(KEY, JSON.stringify(stored));
  alert('Added ' + added + ' tweets. Total: ' + stored.tweets.length + '. Click Load more then run again.');
})();
