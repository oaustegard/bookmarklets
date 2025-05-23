javascript:(function(){
var d=document,b=d.body;
var STORAGE_PREFIX = 'bsky_app_pass_';

function getCurrentHandle() {
  try {
    var storedHandle = localStorage.getItem('bsky-handle');
    if (storedHandle && storedHandle.includes('.')) {
      return storedHandle;
    }
  } catch (e) {
    console.log('Could not access localStorage:', e);
  }
  return null;
}

function getStoredPassword(handle) {
  if (!handle) return null;
  try {
    var stored = localStorage.getItem(STORAGE_PREFIX + handle);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

function storePassword(handle, password) {
  if (!handle || !password) return false;
  try {
    var data = { password: password, stored: Date.now(), handle: handle };
    localStorage.setItem(STORAGE_PREFIX + handle, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

var currentHandle = getCurrentHandle();
var storedAuth = currentHandle ? getStoredPassword(currentHandle) : null;
var hasStoredPassword = !!(storedAuth && storedAuth.password);

var o=d.createElement('div');
o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif';
var m=d.createElement('div');
m.style.cssText='background:white;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3)';

var handleDisplay = currentHandle ? currentHandle : 'Unable to detect';
var handleColor = currentHandle ? 'green' : 'red';
var authStatus = hasStoredPassword ? '🔐 Password stored' : '🔑 Password needed';

m.innerHTML='<h3 style="margin:0 0 16px 0;color:#333">🦋 Post to Bluesky</h3><div style="font-size:13px;margin-bottom:12px"><span style="color:'+handleColor+'">Handle: '+handleDisplay+'</span><br><span style="color:'+(hasStoredPassword?'green':'orange')+'">'+authStatus+'</span></div>'+(hasStoredPassword?'':'<div style="margin-bottom:12px"><input id="app-pass" type="password" placeholder="App Password (from Settings → Privacy)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box"><div style="font-size:11px;color:#666;margin-top:4px">Create at: Settings → Privacy & Security → App Passwords</div></div>')+'<textarea id="bsky-txt" style="width:100%;height:90px;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;margin-bottom:12px;resize:vertical" placeholder="Write with [text](url) markdown links"></textarea><div style="display:flex;gap:8px"><button id="bsky-post" style="flex:1;background:#1d9bf0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px"'+(currentHandle?'':'disabled')+'>Post with Links</button><button id="bsky-cancel" style="background:#6c757d;color:white;border:none;padding:12px 16px;border-radius:6px;cursor:pointer;font-size:14px">Cancel</button></div><div id="bsky-status" style="margin-top:12px;font-size:12px;color:#666;text-align:center"></div>';

o.appendChild(m);b.appendChild(o);

function status(msg, isError) {
  var statusEl = d.getElementById('bsky-status');
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#dc3545' : '#28a745';
}

function parseLinks(text) {
  var encoder = new TextEncoder();
  var facets = [];
  var processedText = text;
  var offset = 0;
  
  var markdownRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  var match;
  while ((match = markdownRegex.exec(text)) !== null) {
    var linkText = match[1];
    var linkUrl = match[2];
    var fullMatch = match[0];
    var linkStart = match.index - offset;
    var linkEnd = linkStart + encoder.encode(linkText).byteLength;
    
    facets.push({
      index: { byteStart: linkStart, byteEnd: linkEnd },
      features: [{ '$type': 'app.bsky.richtext.facet#link', uri: linkUrl }]
    });
    
    processedText = processedText.replace(fullMatch, linkText);
    offset += fullMatch.length - linkText.length;
  }
  
  return { text: processedText, facets: facets.length > 0 ? facets : undefined };
}

async function postToBluesky(handle, password, content) {
  try {
    status('Authenticating...');
    
    var loginResp = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: handle, password: password })
    });
    
    if (!loginResp.ok) {
      var loginError = await loginResp.json().catch(function() { return {}; });
      throw new Error('Authentication failed: ' + (loginError.message || 'Invalid credentials'));
    }
    
    var session = await loginResp.json();
    status('Posting...');
    
    var postData = {
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record: {
        '$type': 'app.bsky.feed.post',
        text: content.text,
        createdAt: new Date().toISOString()
      }
    };
    
    if (content.facets) {
      postData.record.facets = content.facets;
    }
    
    var postResp = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.accessJwt
      },
      body: JSON.stringify(postData)
    });
    
    if (!postResp.ok) {
      var postError = await postResp.json().catch(function() { return {}; });
      throw new Error('Post failed: ' + (postError.message || postResp.status));
    }
    
    status('Posted successfully! 🎉');
    setTimeout(function() { o.remove(); }, 2000);
    
  } catch (error) {
    status('Error: ' + error.message, true);
    console.error('Post error:', error);
  }
}

d.getElementById('bsky-post').onclick = function() {
  if (!currentHandle) {
    status('Could not detect your handle. Make sure you\'re on bsky.app', true);
    return;
  }
  
  var text = d.getElementById('bsky-txt').value.trim();
  if (!text) {
    status('Please enter some text', true);
    return;
  }
  
  var password;
  if (hasStoredPassword) {
    password = storedAuth.password;
  } else {
    var appPassEl = d.getElementById('app-pass');
    if (!appPassEl) {
      status('App password input not found', true);
      return;
    }
    password = appPassEl.value.trim();
    if (!password) {
      status('Please enter your app password', true);
      return;
    }
    
    if (storePassword(currentHandle, password)) {
      console.log('Stored app password for future use');
    }
  }
  
  var content = parseLinks(text);
  postToBluesky(currentHandle, password, content);
};

d.getElementById('bsky-cancel').onclick = function() { o.remove(); };
o.onclick = function(e) { if (e.target === o) o.remove(); };

if (hasStoredPassword) {
  d.getElementById('bsky-txt').focus();
} else {
  var appPassEl = d.getElementById('app-pass');
  if (appPassEl) appPassEl.focus();
}

if (!currentHandle) {
  status('Navigate to bsky.app first, then try again', true);
} else if (hasStoredPassword) {
  status('Ready to post with stored credentials');
} else {
  status('Enter your app password (created in Settings)');
}
})();
