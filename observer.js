javascript:
/* @title: Observer */
/* @description: Toggles on/off an observer mode in which user mouse and keyboard actions are logged to the console. Useful as a companion to other tools like Gemini/Claude browser plugins for debugging webpages/scripts */
(function(){
  if(window.__obsActive){
    window.__obsListeners.forEach(function(item){
      document.removeEventListener(item.ev, item.fn, true);
    });
    window.__obsActive = false;
    window.__obsListeners = [];
    console.log(JSON.stringify({type:"OBSERVER_OFF",ts:Date.now()}));
    return;
  }
  window.__obsListeners = [];
  window.__obsActive = true;
  var debounceTimers = {};
  function bestTarget(t){
    // Walk up DOM to find most meaningful element
    var el = t;
    for(var i=0; i<5; i++){
      if(!el || el===document.body) break;
      if(el.id || el.tagName==='BUTTON' || el.tagName==='A' ||
         el.tagName==='INPUT' || el.tagName==='SELECT' || el.tagName==='TEXTAREA' ||
         (el.getAttribute && el.getAttribute('role')) ||
         (el.innerText && el.innerText.trim().length > 0 && el.innerText.trim().length < 60)){
        return el;
      }
      el = el.parentElement;
    }
    return t;
  }
  function logNow(data){
    console.log('__OBS__'+JSON.stringify(data));
  }
  function makeData(e, t){
    return {
      type: e.type, ts: Date.now(), tag: t.tagName,
      id: t.id||null,
      role: (t.getAttribute && t.getAttribute('role'))||null,
      cls: (typeof t.className==='string' ? t.className.split(' ').filter(function(c){return c&&!c.match(/^(css-|Mui)/);}).join(' ') : null)||null,
      text: (t.innerText||t.value||'').trim().slice(0,80)||null,
      href: t.href||null, url: location.href
    };
  }
  function log(e){
    var t = bestTarget(e.target);
    var isTyping = (e.type==='keydown' || e.type==='input');
    var isScroll = (e.type==='scroll');
    if(isTyping){
      var key = 'type_'+(t.id||t.tagName+(t.name||''));
      clearTimeout(debounceTimers[key]);
      debounceTimers[key] = setTimeout(function(){
        logNow(makeData(e, t));
      }, 600);
    } else if(isScroll){
      clearTimeout(debounceTimers['scroll']);
      debounceTimers['scroll'] = setTimeout(function(){
        logNow({type:'scroll', ts:Date.now(), url:location.href});
      }, 400);
    } else {
      logNow(makeData(e, t));
    }
  }
  ['click','change','input','submit','scroll','keydown'].forEach(function(ev){
    document.addEventListener(ev, log, true);
    window.__obsListeners.push({ev:ev, fn:log});
  });
  console.log(JSON.stringify({type:"OBSERVER_ON",url:location.href,ts:Date.now()}));
})();
