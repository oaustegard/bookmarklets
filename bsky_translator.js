javascript:
/* @title: BSky Translator */
/* @description: Translates non-english posts on a bsky feed */
/* @domains: bsky.app */
(function() {
  var W = window,
    C = document;
  /* Second click of the bookmarklet tears everything down */
  if (W.__bskyTr) {
    W.__bskyTr.stop();
    return
  }
  var TL = 'en',
    /* Feed posts expose data-testid="postText"; thread detail posts don't, so
       match the wrapped text inside a postThreadItem-by-* container too */
    SEL = '[data-testid="postText"],[data-testid^="postThreadItem-by-"] [data-word-wrap]',
    cache = new Map,
    queue = [],
    busy = 0,
    live = 1,
    timer,
    badge = C.createElement('div');
  badge.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:%230a7aff;color:%23fff;font:12px sans-serif;padding:6px 10px;border-radius:14px;cursor:pointer';
  badge.textContent = 'EN translate: ON (click to stop)';
  badge.onclick = function() {
    W.__bskyTr.stop()
  };
  C.body.appendChild(badge);

  /* Skip nodes that are in the DOM but not rendered (virtualized list slots) */
  var vis = function(e) {
      return !!(e.offsetParent || e.getClientRects().length)
    },
    tr = function(t) {
      return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + TL + '&dt=t&q=' + encodeURIComponent(t)).then(function(r) {
        return r.json()
      }).then(function(j) {
        return {
          text: j[0].map(function(x) {
            return x[0]
          }).join(''),
          src: j[2]
        }
      })
    },
    clr = function(e) {
      var n = e.nextElementSibling;
      n && n.dataset.bskyTr && n.remove()
    },
    show = function(e, r) {
      if (clr(e), !r.skip) {
        var d = C.createElement('div');
        d.dataset.bskyTr = 1;
        d.style.cssText = 'margin-top:6px;padding:6px 8px;border-left:3px solid %230a7aff;background:rgba(10,122,255,.08);font-size:.95em;white-space:pre-wrap';
        d.textContent = '[' + r.src + '\u2192' + TL + '] ' + r.text;
        e.insertAdjacentElement('afterend', d)
      }
    },
    scan = function() {
      C.querySelectorAll(SEL).forEach(function(e) {
        if (vis(e)) {
          var t = e.innerText.trim();
          /* trKey doubles as "already handled" marker and staleness check */
          if (t && e.dataset.trKey !== t) {
            e.dataset.trKey = t;
            clr(e);
            var c = cache.get(t);
            c ? show(e, c) : queue.push({
              el: e,
              text: t
            })
          }
        }
      });
      /* Single drainer: serializes the queue so we never burst the endpoint */
      (async function() {
        if (!busy) {
          for (busy = 1; queue.length && live;) {
            var j = queue.shift(),
              e = j.el,
              t = j.text;
            if (e.isConnected && e.dataset.trKey === t) {
              var c = cache.get(t);
              if (!c) {
                try {
                  var r = await tr(t);
                  /* Cache the negative result too, so already-English text is
                     never re-fetched on the next scan */
                  c = r.src !== TL && r.text.trim() && r.text.trim() !== t ? r : {
                    skip: 1
                  };
                  cache.set(t, c)
                } catch (x) {
                  continue
                }
                await new Promise(function(f) {
                  setTimeout(f, 200)
                })
              }
              /* Node may have been recycled while awaiting */
              e.dataset.trKey === t && show(e, c)
            }
          }
          busy = 0
        }
      })()
    },
    kick = function() {
      clearTimeout(timer);
      timer = setTimeout(scan, 250)
    },
    mo = new MutationObserver(kick);
  mo.observe(C.body, {
    childList: 1,
    subtree: 1,
    characterData: 1
  });
  addEventListener('scroll', kick, 1);
  scan();

  W.__bskyTr = {
    stop: function() {
      live = 0;
      mo.disconnect();
      removeEventListener('scroll', kick, 1);
      badge.remove();
      C.querySelectorAll('[data-bsky-tr]').forEach(function(e) {
        e.remove()
      });
      C.querySelectorAll(SEL).forEach(function(e) {
        delete e.dataset.trKey
      });
      delete W.__bskyTr
    }
  }
})();
