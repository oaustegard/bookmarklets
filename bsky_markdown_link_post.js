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

/* Parse Bluesky URL to extract handle and rkey for post detection */
function parseBlueskyUrl(url) {
  var match = url.match(/https:\/\/bsky\.app\/profile\/([^\/]+)\/post\/([^\/]+)/);
  if (match) {
    return { handle: match[1], rkey: match[2] };
  }
  return null;
}

/* Resolve handle to DID */
async function resolveToDid(handle) {
  try {
    var resp = await fetch('https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=' + encodeURIComponent(handle));
    if (!resp.ok) throw new Error('Handle resolution failed');
    var data = await resp.json();
    return data.did;
  } catch (e) {
    console.error('Failed to resolve handle:', e);
    return null;
  }
}

/* Get post record from AT URI */
async function getPostRecord(did, rkey) {
  try {
    var params = new URLSearchParams({
      repo: did,
      collection: 'app.bsky.feed.post',
      rkey: rkey
    });
    
    var resp = await fetch('https://bsky.social/xrpc/com.atproto.repo.getRecord?' + params);
    if (!resp.ok) throw new Error('Failed to fetch post record');
    var data = await resp.json();
    
    return {
      uri: data.uri,
      cid: data.cid,
      record: data.value
    };
  } catch (e) {
    console.error('Failed to get post record:', e);
    return null;
  }
}

/* Get reply references for proper threading */
async function getReplyRefs(parentUri, parentCid, parentRecord) {
  /* If parent has a reply field, use its root. Otherwise parent is the root */
  if (parentRecord && parentRecord.reply && parentRecord.reply.root) {
    return {
      root: {
        uri: parentRecord.reply.root.uri,
        cid: parentRecord.reply.root.cid
      },
      parent: {
        uri: parentUri,
        cid: parentCid
      }
    };
  } else {
    /* Parent is a top-level post, so it becomes both root and parent */
    return {
      root: {
        uri: parentUri,
        cid: parentCid
      },
      parent: {
        uri: parentUri,
        cid: parentCid
      }
    };
  }
}

var currentHandle = getCurrentHandle();
var storedAuth = currentHandle ? getStoredPassword(currentHandle) : null;
var hasStoredPassword = !!(storedAuth && storedAuth.password);

/* Check if we're on a post page */
var currentUrl = window.location.href;
var postInfo = parseBlueskyUrl(currentUrl);
var isOnPostPage = !!postInfo;

console.log('Current URL:', currentUrl);
console.log('Post info:', postInfo);
console.log('Is on post page:', isOnPostPage);

var o=d.createElement('div');
o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif';
var m=d.createElement('div');
m.style.cssText='background:white;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3)';

var handleDisplay = currentHandle ? currentHandle : 'Unable to detect';
var handleColor = currentHandle ? 'green' : 'red';
var authStatus = hasStoredPassword ? '🔐 Password stored' : '🔑 Password needed';

/* Build action buttons based on context */
var actionButtons = '';
if (isOnPostPage) {
  /* On post page: show Reply and Quote buttons */
  actionButtons = '<div style="display:flex;gap:8px"><button id="bsky-reply" style="flex:1;background:#1d9bf0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px"'+(currentHandle?'':'disabled')+'>Reply</button><button id="bsky-quote" style="flex:1;background:#28a745;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px"'+(currentHandle?'':'disabled')+'>Quote</button><button id="bsky-cancel" style="background:#6c757d;color:white;border:none;padding:12px 16px;border-radius:6px;cursor:pointer;font-size:14px">Cancel</button></div>';
} else {
  /* Not on post page: show Post button */
  actionButtons = '<div style="display:flex;gap:8px"><button id="bsky-post" style="flex:1;background:#1d9bf0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px"'+(currentHandle?'':'disabled')+'>Post</button><button id="bsky-cancel" style="background:#6c757d;color:white;border:none;padding:12px 16px;border-radius:6px;cursor:pointer;font-size:14px">Cancel</button></div>';
}

m.innerHTML='<h3 style="margin:0 0 16px 0;color:#333">🦋 Post to Bluesky</h3><div style="font-size:13px;margin-bottom:12px"><span style="color:'+handleColor+'">Handle: '+handleDisplay+'</span><br><span style="color:'+(hasStoredPassword?'green':'orange')+'">'+authStatus+'</span>'+(isOnPostPage ? '<br><span style="color:blue">On post: '+postInfo.handle+'/'+postInfo.rkey+'</span>' : '')+'</div>'+(hasStoredPassword?'':'<div style="margin-bottom:12px"><input id="app-pass" type="password" placeholder="App Password (from Settings → Privacy)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box"><div style="font-size:11px;color:#666;margin-top:4px">Create at: Settings → Privacy & Security → App Passwords</div></div>')+'<textarea id="bsky-txt" style="width:100%;height:90px;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;margin-bottom:12px;resize:vertical" placeholder="Write with [text](url) markdown links"></textarea>'+actionButtons+'<div id="bsky-status" style="margin-top:12px;font-size:12px;color:#666;text-align:center"></div>';

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

async function postToBluesky(handle, password, content, postType, postData) {
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
    
    if (postType === 'reply' || postType === 'quote') {
      status('Fetching post data...');
      postData = await preparePostData(postInfo, session.accessJwt);
      if (!postData) {
        throw new Error('Failed to fetch original post data');
      }
    }
    
    status('Posting...');
    
    var postRecord = {
      '$type': 'app.bsky.feed.post',
      text: content.text,
      createdAt: new Date().toISOString()
    };
    
    if (content.facets) {
      postRecord.facets = content.facets;
    }
    
    /* Add reply or embed fields based on post type */
    if (postType === 'reply' && postData) {
      postRecord.reply = postData.replyRefs;
    } else if (postType === 'quote' && postData) {
      postRecord.embed = {
        '$type': 'app.bsky.embed.record',
        record: {
          uri: postData.uri,
          cid: postData.cid
        }
      };
    }
    
    var postResp = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.accessJwt
      },
      body: JSON.stringify({
        repo: session.did,
        collection: 'app.bsky.feed.post',
        record: postRecord
      })
    });
    
    if (!postResp.ok) {
      var postError = await postResp.json().catch(function() { return {}; });
      throw new Error('Post failed: ' + (postError.message || postResp.status));
    }
    
    var successMsg = 'Posted successfully! 🎉';
    if (postType === 'reply') successMsg = 'Reply posted! 💬';
    else if (postType === 'quote') successMsg = 'Quote post created! 🔄';
    
    status(successMsg);
    setTimeout(function() { o.remove(); }, 2000);
    
  } catch (error) {
    status('Error: ' + error.message, true);
    console.error('Post error:', error);
  }
}

async function preparePostData(postInfo, accessToken) {
  try {
    /* First resolve handle to DID */
    var did = await resolveToDid(postInfo.handle);
    if (!did) {
      throw new Error('Could not resolve handle to DID');
    }
    
    /* Get the post record */
    var postRecord = await getPostRecord(did, postInfo.rkey);
    if (!postRecord) {
      throw new Error('Could not fetch post record');
    }
    
    /* Get reply references for proper threading */
    var replyRefs = await getReplyRefs(postRecord.uri, postRecord.cid, postRecord.record);
    
    return {
      uri: postRecord.uri,
      cid: postRecord.cid,
      record: postRecord.record,
      replyRefs: replyRefs
    };
  } catch (e) {
    console.error('Failed to prepare post data:', e);
    return null;
  }
}

function handleAction(postType) {
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
  postToBluesky(currentHandle, password, content, postType, null);
}

/* Set up button click handlers based on context */
if (isOnPostPage) {
  /* On post page: Reply and Quote buttons */
  d.getElementById('bsky-reply').onclick = function() { handleAction('reply'); };
  d.getElementById('bsky-quote').onclick = function() { handleAction('quote'); };
} else {
  /* Not on post page: Post button */
  d.getElementById('bsky-post').onclick = function() { handleAction('new'); };
}

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
  if (isOnPostPage) {
    status('Ready to reply or quote this post');
  } else {
    status('Ready to create new post');
  }
} else {
  status('Enter your app password (created in Settings)');
}
})();
