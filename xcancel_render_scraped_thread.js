javascript:
/* @title: Render XCancel Scraped Thread */
/* @description: Renders a previously scraped XCancel thread with options to copy/download json or plain text (step 2/2 - see xcancel_scrape_thread.js) */
/* @domains: xcancel.com */
(function(){
  var KEY='xcancelScrape';
  var stored=JSON.parse(sessionStorage.getItem(KEY)||'{"url":"","tweets":[]}');
  var tweets=stored.tweets;
  if(!tweets.length){alert('No data found. Run the collector bookmarklet first.');return;}
  // Build Q&A thread pairs from the thread class structure
  function buildThreads(tweets){
    var threads=[];
    var i=0;
    while(i<tweets.length){
      var t=tweets[i];
      // The OP tweet (thread-line) starts the whole thing
      if(t.isThreadLine){
        var group={question:t,replies:[]};
        i++;
        // Collect subsequent thread / thread-last items as part of OP's thread
        while(i<tweets.length&&(tweets[i].isThread||tweets[i].isThreadLast)){
          group.replies.push(tweets[i]);
          i++;
        }
        threads.push(group);
      } else {
        // A question tweet, followed by thread-last (the answer)
        var group={question:t,replies:[]};
        i++;
        while(i<tweets.length&&(tweets[i].isThread||tweets[i].isThreadLast)){
          group.replies.push(tweets[i]);
          i++;
        }
        threads.push(group);
      }
    }
    return threads;
  }
  var threads=buildThreads(tweets);
  // Render UI
  var overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;overflow:auto;font-family:Arial,sans-serif;color:#e0e0e0;padding:20px;box-sizing:border-box;';
  var header=document.createElement('div');
  header.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;';
  header.innerHTML='<h2 style="margin:0;color:#1d9bf0;">XCancel Scraper — '+tweets.length+' tweets, '+threads.length+' threads</h2>';
  var btnGroup=document.createElement('div');
  btnGroup.style.cssText='display:flex;gap:8px;';
  function makeBtn(label,color,onclick){
    var b=document.createElement('button');
    b.textContent=label;
    b.style.cssText='padding:6px 14px;background:'+color+';color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;';
    b.onclick=onclick;
    return b;
  }
  var jsonData=JSON.stringify(threads,null,2);
  btnGroup.appendChild(makeBtn('Copy JSON','#1d9bf0',function(){
    navigator.clipboard.writeText(jsonData).then(function(){alert('Copied to clipboard!');});
  }));
  btnGroup.appendChild(makeBtn('Download JSON','#17bf7f',function(){
    var blob=new Blob([jsonData],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='xcancel-threads.json';a.click();URL.revokeObjectURL(url);
  }));
  btnGroup.appendChild(makeBtn('Copy Plain Text','#9b59b6',function(){
    var lines=[];
    threads.forEach(function(th,idx){
      lines.push('--- Thread '+(idx+1)+' ---');
      lines.push('['+th.question.fullname+' '+th.question.username+' · '+th.question.timestamp+']');
      lines.push(th.question.content);
      th.replies.forEach(function(r){
        lines.push('  ↳ ['+r.fullname+' '+r.username+' · '+r.timestamp+']');
        lines.push('  '+r.content);
      });
      lines.push('');
    });
    navigator.clipboard.writeText(lines.join('\\n')).then(function(){alert('Plain text copied!');});
  }));
  btnGroup.appendChild(makeBtn('Clear Storage','#e74c3c',function(){
    if(confirm('Clear all stored data?')){sessionStorage.removeItem(KEY);alert('Cleared.');overlay.remove();}
  }));
  btnGroup.appendChild(makeBtn('✕ Close','#555',function(){overlay.remove();}));
  header.appendChild(btnGroup);
  overlay.appendChild(header);
  // Render threads
  var container=document.createElement('div');
  container.style.cssText='max-width:800px;margin:0 auto;';
  threads.forEach(function(th,idx){
    var card=document.createElement('div');
    card.style.cssText='background:#16202a;border:1px solid #2f3f4f;border-radius:8px;padding:12px 16px;margin-bottom:14px;';
    var qMeta='<span style="color:#1d9bf0;font-weight:bold;">'+th.question.fullname+'</span> <span style="color:#888;">'+th.question.username+' · '+th.question.timestamp+'</span>';
    var qText='<div style="margin-top:6px;line-height:1.5;white-space:pre-wrap;">'+th.question.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
    var html='<div>'+qMeta+qText+'</div>';
    th.replies.forEach(function(r){
      var rMeta='<span style="color:#17bf7f;font-weight:bold;">'+r.fullname+'</span> <span style="color:#888;">'+r.username+' · '+r.timestamp+'</span>';
      var rText='<div style="margin-top:4px;line-height:1.5;white-space:pre-wrap;">'+r.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</div>';
      html+='<div style="margin-top:10px;padding-left:14px;border-left:3px solid #1d9bf0;">'+rMeta+rText+'</div>';
    });
    card.innerHTML=html;
    container.appendChild(card);
  });
  overlay.appendChild(container);
  document.body.appendChild(overlay);
})();
