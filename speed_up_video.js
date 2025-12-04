javascript:(function() {
  /* @title: Speed Up Video */
  /* @description: Increases video playback speed and enables controls, including in iframes */
  var MULTIPLIER = 1.5;
  var found = 0;
  var blocked = [];

  function searchVideos(doc, depth) {
    if (!doc) return;
    
    /* Speed up any videos at this level and enable controls */
    var videos = doc.getElementsByTagName('video');
    for (var i = 0; i < videos.length; i++) {
      videos[i].playbackRate *= MULTIPLIER;
      videos[i].controls = true;
      found++;
    }
    
    /* Check shadow roots */
    var all = doc.querySelectorAll('*');
    for (var j = 0; j < all.length; j++) {
      if (all[j].shadowRoot) searchVideos(all[j].shadowRoot, depth + 1);
    }
    
    /* Recurse into iframes */
    var iframes = doc.getElementsByTagName('iframe');
    for (var k = 0; k < iframes.length; k++) {
      try {
        if (iframes[k].contentDocument) {
          searchVideos(iframes[k].contentDocument, depth + 1);
        }
      } catch (e) {
        blocked.push(iframes[k].src || '(embedded frame)');
      }
    }
  }

  searchVideos(document, 0);

  if (found) {
    alert('Sped up ' + found + ' video(s) to ' + MULTIPLIER + 'x\nNative controls enabled.');
  } else {
    var code = 'document.querySelectorAll("video").forEach(v => { v.playbackRate *= ' + MULTIPLIER + '; v.controls = true; })';
    console.log('%c VIDEO SPEED WORKAROUND ', 'background: #4CAF50; color: white; font-size: 14px;');
    console.log('1. In the dropdown above (shows "top"), select the most deeply nested frame');
    console.log('2. Paste this code:\n\n' + code + '\n');
    prompt('Video is in a cross-origin iframe. Press F12 → Console → change "top" dropdown to nested frame → paste this code:', code);
  }
})();
