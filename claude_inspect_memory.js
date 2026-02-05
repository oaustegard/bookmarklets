javascript:
/* @title: Inspect Claude Memory */
/* @description: Shows the current project (or general organization) memory for inspection */
/* @domains: claude.ai */
(function(){  
  const flightData = self.__next_f
    .filter(item => item[0] === 1)
    .map(item => item[1])
    .join("");
  
  /* Extract org ID from lastActiveOrg in flight data */
  const orgMatch = flightData.match(/"lastActiveOrg","value":"([0-9a-f-]{36})"/);
  const orgId = orgMatch ? orgMatch[1] : null;
  
  if (!orgId) {
    alert("Could not find organization ID");
    return;
  }
  
  /* Check if we're in a chat or on a project page */
  const chatMatch = window.location.pathname.match(/\/chat\/([0-9a-f-]{36})/);
  const projectPageMatch = window.location.pathname.match(/\/project\/([0-9a-f-]{36})/);
  
  console.log("Org ID:", orgId);
  
  /* Function to display memory */
  function showMemory(projectId) {
    const apiUrl = projectId
      ? `https://claude.ai/api/organizations/${orgId}/memory?project_uuid=${projectId}`
      : `https://claude.ai/api/organizations/${orgId}/memory`;
    
    console.log("Project ID:", projectId);
    console.log("Fetching memory from:", apiUrl);
    
    fetch(apiUrl, { credentials: "include" })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log("Memory data:", data);
        
        const overlay = document.createElement("div");
        overlay.id = "claude-memory-overlay";
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999999;display:flex;align-items:center;justify-content:center";
        
        const modal = document.createElement("div");
        modal.style.cssText = "background:#1a1a1a;color:#e0e0e0;border-radius:12px;max-width:800px;max-height:80vh;overflow:auto;padding:24px;position:relative;font-family:-apple-system,BlinkMacSystemFont,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,0.4)";
        
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.style.cssText = "position:absolute;top:12px;right:12px;background:none;border:none;color:#888;font-size:28px;cursor:pointer;padding:0;line-height:1";
        closeBtn.onclick = () => overlay.remove();
        
        const title = document.createElement("h2");
        title.textContent = projectId ? "Project Memory" : "Organization Memory";
        title.style.cssText = "margin:0 0 20px 0;color:#fff;font-size:20px;border-bottom:1px solid #333;padding-bottom:12px";
        
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        
        /* Render memory section */
        if (data.memory) {
          const memSection = document.createElement("div");
          memSection.style.cssText = "margin-bottom:24px";
          
          const memTitle = document.createElement("h3");
          memTitle.textContent = "Synthesized Memory";
          memTitle.style.cssText = "color:#888;font-size:14px;text-transform:uppercase;margin:0 0 12px 0";
          
          const memContent = document.createElement("div");
          memContent.style.cssText = "line-height:1.6;white-space:pre-wrap";
          memContent.innerHTML = data.memory
            .replace(/\*\*([^*]+)\*\*/g, "<strong style='color:#fff'>$1</strong>")
            .replace(/\n\n/g, "</p><p style='margin:12px 0'>")
            .replace(/^/, "<p style='margin:12px 0'>")
            .replace(/$/, "</p>");
          
          memSection.appendChild(memTitle);
          memSection.appendChild(memContent);
          modal.appendChild(memSection);
        }
        
        /* Render controls section */
        if (data.controls && data.controls.length > 0) {
          const ctrlSection = document.createElement("div");
          ctrlSection.style.cssText = "background:#252525;border-radius:8px;padding:16px";
          
          const ctrlTitle = document.createElement("h3");
          ctrlTitle.textContent = "User Corrections";
          ctrlTitle.style.cssText = "color:#888;font-size:14px;text-transform:uppercase;margin:0 0 12px 0";
          
          ctrlSection.appendChild(ctrlTitle);
          
          data.controls.forEach((ctrl, i) => {
            const item = document.createElement("div");
            item.style.cssText = "padding:10px 12px;background:#1a1a1a;border-radius:6px;margin-bottom:8px;border-left:3px solid #666";
            item.textContent = ctrl;
            if (i === data.controls.length - 1) item.style.marginBottom = "0";
            ctrlSection.appendChild(item);
          });
          
          modal.appendChild(ctrlSection);
        }
        
        /* Updated timestamp */
        if (data.updated_at) {
          const ts = document.createElement("div");
          ts.style.cssText = "margin-top:16px;color:#666;font-size:12px;text-align:right";
          ts.textContent = "Last updated: " + new Date(data.updated_at).toLocaleString();
          modal.appendChild(ts);
        }
        
        /* No data case */
        if (!data.memory && (!data.controls || data.controls.length === 0)) {
          const empty = document.createElement("p");
          empty.textContent = "No memory data found for this " + (projectId ? "project" : "organization") + ".";
          empty.style.cssText = "color:#888;font-style:italic";
          modal.appendChild(empty);
        }
        
        overlay.appendChild(modal);
        overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
      })
      .catch(err => {
        console.error("Memory fetch error:", err);
        alert("Failed to fetch memory: " + err.message);
      });
  }
  
  /* Determine project ID based on context */
  if (projectPageMatch) {
    /* On a project page - use URL */
    showMemory(projectPageMatch[1]);
  } else if (chatMatch) {
    /* In a chat - fetch chat metadata to get project_uuid */
    const chatId = chatMatch[1];
    console.log("Chat ID:", chatId);
    
    fetch(`https://claude.ai/api/organizations/${orgId}/chat_conversations/${chatId}`, {
      credentials: "include"
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(chat => {
        console.log("Chat project_uuid:", chat.project_uuid);
        showMemory(chat.project_uuid || null);
      })
      .catch(err => {
        console.error("Chat fetch error:", err);
        /* Fall back to org memory */
        showMemory(null);
      });
  } else {
    /* Not in chat or project - show org memory */
    showMemory(null);
  }
})();
