javascript:(function(){
var d=document,b=d.body;
var STORAGE_PREFIX = 'bsky_app_pass_';

function getCurrentHandle() {
  try {
    /* Try to get from bsky.app localStorage first */
    var storedHandle = localStorage.getItem('bsky-handle');
    if (storedHandle && storedHandle.includes('.')) {
      return storedHandle;
    }
    
    /* Fallback: find any stored credentials and use that handle */
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          var stored = JSON.parse(localStorage.getItem(key));
          if (stored && stored.handle && stored.handle.includes('.')) {
            return stored.handle;
          }
        } catch (e) {
          /* Skip invalid entries */
        }
      }
    }
  } catch (e) {
    console.log('Could not access localStorage:', e);
  }
  return null;
}

function getStoredCredentials(handle) {
  if (!handle) return null;
  try {
    var stored = localStorage.getItem(STORAGE_PREFIX + handle);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

function storeCredentials(handle, password) {
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
var storedAuth = currentHandle ? getStoredCredentials(currentHandle) : null;

function needsCredentials() {
  /* Check what we're missing based on current state */
  var handle = d.getElementById('bsky-handle') ? d.getElementById('bsky-handle').value.trim() : currentHandle;
  var password = d.getElementById('app-pass') ? d.getElementById('app-pass').value.trim() : (storedAuth ? storedAuth.password : '');
  
  return {
    handle: !handle || !handle.includes('.'),
    password: !password,
    currentHandle: handle,
    currentPassword: password
  };
}

/* Check if we're on a post page */
var currentUrl = window.location.href;
var postInfo = parseBlueskyUrl(currentUrl);
var isOnPostPage = !!postInfo;

console.log('Current URL:', currentUrl);
console.log('Post info:', postInfo);
console.log('Is on post page:', isOnPostPage);
console.log('Current handle:', currentHandle);
console.log('Needs handle:', needsHandle);
console.log('Needs password:', needsPassword);

var o=d.createElement('div');
o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif';
var m=d.createElement('div');
m.style.cssText='background:white;border-radius:12px;padding:24px;max-width:420px;width:90%;box-shadow:0 10px 40px rgba(0,0,0,0.3)';

var handleDisplay = currentHandle ? currentHandle : 'Not detected';
var handleColor = currentHandle ? 'green' : 'orange';
var authStatus = (storedAuth && storedAuth.password) ? '🔐 Password stored' : '🔑 Password needed';

var needsHandle = !currentHandle;
var needsPassword = !(storedAuth && storedAuth.password);

/* Build credential inputs */
var credentialInputs = '';
if (needsHandle) {
  credentialInputs += '<div style="margin-bottom:12px"><input id="bsky-handle" type="text" placeholder="Your Bluesky handle (e.g., username.bsky.social)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box" value="'+(currentHandle||'')+'"><div style="font-size:11px;color:#666;margin-top:4px">Your full Bluesky handle</div></div>';
}
if (needsPassword) {
  credentialInputs += '<div style="margin-bottom:12px"><input id="app-pass" type="password" placeholder="App Password (from Settings → Privacy)" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box"><div style="font-size:11px;color:#666;margin-top:4px">Create at: Settings → Privacy & Security → App Passwords</div></div>';
}

/* Build action buttons based on context */
var actionButtons = '';
if (isOnPostPage) {
  /* On post page: show Reply and Quote buttons */
  actionButtons = '<div style="display:flex;gap:8px"><button id="bsky-reply" style="flex:1;background:#1d9bf0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px">Reply</button><button id="bsky-quote" style="flex:1;background:#28a745;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px">Quote</button><button id="bsky-cancel" style="background:#6c757d;color:white;border:none;padding:12px 16px;border-radius:6px;cursor:pointer;font-size:14px">Cancel</button></div>';
} else {
  /* Not on post page: show Post button */
  actionButtons = '<div style="display:flex;gap:8px"><button id="bsky-post" style="flex:1;background:#1d9bf0;color:white;border:none;padding:12px;border-radius:6px;cursor:pointer;font-weight:500;font-size:14px">Post</button><button id="bsky-cancel" style="background:#6c757d;color:white;border:none;padding:12px 16px;border-radius:6px;cursor:pointer;font-size:14px">Cancel</button></div>';
}

function updateButtonStates() {
  var creds = needsCredentials();
  var canPost = !creds.handle && !creds.password;
  
  var postBtn = d.getElementById('bsky-post');
  var replyBtn = d.getElementById('bsky-reply');
  var quoteBtn = d.getElementById('bsky-quote');
  
  if (postBtn) postBtn.disabled = !canPost;
  if (replyBtn) replyBtn.disabled = !canPost;
  if (quoteBtn) quoteBtn.disabled = !canPost;
  
  /* Update status */
  if (creds.handle && creds.password) {
    status('Enter your handle and app password to get started');
  } else if (creds.handle) {
    status('Enter your Bluesky handle');
  } else if (creds.password) {
    status('Enter your app password');
  } else {
    if (isOnPostPage) {
      status('Ready to reply or quote this post');
    } else {
      status('Ready to create new post');
    }
  }
}

m.innerHTML='<h3 style="margin:0 0 16px 0;color:#333">🦋 Post to Bluesky</h3><div style="font-size:13px;margin-bottom:12px"><span style="color:'+handleColor+'">Handle: '+handleDisplay+'</span><br><span style="color:'+((storedAuth && storedAuth.password)?'green':'orange')+'">'+authStatus+'</span>'+(isOnPostPage ? '<br><span style="color:blue">On post: '+postInfo.handle+'/'+postInfo.rkey+'</span>' : '')+'</div>'+credentialInputs+'<textarea id="bsky-txt" style="width:100%;height:90px;padding:10px;border:1px solid #ddd;border-radius:6px;font-size:14px;box-sizing:border-box;margin-bottom:12px;resize:vertical" placeholder="Write with [text](url) markdown links"></textarea>'+actionButtons+'<div id="bsky-status" style="margin-top:12px;font-size:12px;color:#666;text-align:center"></div>';

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
    
    /* Store credentials for future use */
    storeCredentials(handle, password);
    
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
  var text = d.getElementById('bsky-txt').value.trim();
  if (!text) {
    status('Please enter some text', true);
    return;
  }
  
  var creds = needsCredentials();
  
  if (creds.handle) {
    status('Please enter your Bluesky handle', true);
    return;
  }
  
  if (creds.password) {
    status('Please enter your app password', true);
    return;
  }
  
  var content = parseLinks(text);
  postToBluesky(creds.currentHandle, creds.currentPassword, content, postType, null);
}

/* Set up button click handlers based on context */
if (isOnPostPage) {
  /* On post page: Reply and Quote buttons */
  if (d.getElementById('bsky-reply')) {
    d.getElementById('bsky-reply').onclick = function() { handleAction('reply'); };
  }
  if (d.getElementById('bsky-quote')) {
    d.getElementById('bsky-quote').onclick = function() { handleAction('quote'); };
  }
} else {
  /* Not on post page: Post button */
  if (d.getElementById('bsky-post')) {
    d.getElementById('bsky-post').onclick = function() { handleAction('new'); };
  }
}

d.getElementById('bsky-cancel').onclick = function() { o.remove(); };
o.onclick = function(e) { if (e.target === o) o.remove(); };

/* Add input listeners for dynamic updates */
if (d.getElementById('bsky-handle')) {
  d.getElementById('bsky-handle').oninput = updateButtonStates;
}
if (d.getElementById('app-pass')) {
  d.getElementById('app-pass').oninput = updateButtonStates;
}

/* Set initial focus */
if (needsHandle) {
  d.getElementById('bsky-handle').focus();
} else if (needsPassword) {
  d.getElementById('app-pass').focus();
} else {
  d.getElementById('bsky-txt').focus();
}

/* Set initial button states and status */
updateButtonStates();
})();
