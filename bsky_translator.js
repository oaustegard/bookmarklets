javascript:
/* @title: BSky Translator */
/* @description: Translates non-english posts on a bsky feed */
/* @domains: bsky.app */
(function() {
  var W = window;
  if (W.__bskyTr) {
    W.__bskyTr.stop();
    return
  }
  var T = 'en',
    S = '[data-testid="postText"]',
    C = new Map,
    Q = [],
    busy = 0,
    on = 1,
    tm, D = document,
    b = D.createElement('div');
  b.style.cssText = 'position:fixed;z-index:99999;bottom:12px;right:12px;background:%230a7aff;color:%23fff;font:12px sans-serif;padding:6px 10px;border-radius:14px;cursor:pointer';
  b.textContent = 'EN translate: ON (click to stop)';
  b.onclick = function() {
    W.__bskyTr.stop()
  };
  D.body.appendChild(b);
  var api = function(t) {
    return fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + T + '&dt=t&q=' + encodeURIComponent(t)).then(function(r) {
      return r.json()
    }).then(function(j) {
      return {
        text: j[0].map(function(s) {
          return s[0]
        }).join(''),
        src: j[2]
      }
    })
  };
  var clr = function(e) {
    var n = e.nextElementSibling;
    if (n && n.dataset.bskyTr) n.remove()
  };
  var put = function(e, r) {
    clr(e);
    if (r.skip) return;
    var d = D.createElement('div');
    d.dataset.bskyTr = 1;
    d.style.cssText = 'margin-top:6px;padding:6px 8px;border-left:3px solid %230a7aff;background:rgba(10,122,255,.08);font-size:.95em;white-space:pre-wrap';
    d.textContent = '[' + r.src + '>' + T + '] ' + r.text;
    e.insertAdjacentElement('afterend', d)
  };
  var pump = async function() {
    if (busy) return;
    busy = 1;
    while (Q.length && on) {
      var i = Q.shift(),
        e = i.el,
        t = i.text;
      if (!e.isConnected || e.dataset.trKey !== t) continue;
      var r = C.get(t);
      if (!r) {
        try {
          var o = await api(t);
          r = (o.src === T || !o.text.trim() || o.text.trim() === t) ? {
            skip: 1
          } : o;
          C.set(t, r)
        } catch (x) {
          continue
        }
        await new Promise(function(f) {
          setTimeout(f, 200)
        })
      }
      if (e.dataset.trKey === t) put(e, r)
    }
    busy = 0
  };
  var scan = function() {
    D.querySelectorAll(S).forEach(function(e) {
      var t = e.innerText.trim();
      if (!t || e.dataset.trKey === t) return;
      e.dataset.trKey = t;
      clr(e);
      var h = C.get(t);
      h ? put(e, h) : Q.push({
        el: e,
        text: t
      })
    });
    pump()
  };
  var go = function() {
    clearTimeout(tm);
    tm = setTimeout(scan, 200)
  };
  var mo = new MutationObserver(go);
  mo.observe(D.body, {
    childList: 1,
    subtree: 1,
    characterData: 1
  });
  addEventListener('scroll', go, 1);
  scan();
  W.__bskyTr = {
    stop: function() {
      on = 0;
      mo.disconnect();
      removeEventListener('scroll', go, 1);
      b.remove();
      D.querySelectorAll('[data-bsky-tr]').forEach(function(n) {
        n.remove()
      });
      D.querySelectorAll(S).forEach(function(e) {
        delete e.dataset.trKey
      });
      delete W.__bskyTr
    }
  }
})()
