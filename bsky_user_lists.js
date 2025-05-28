javascript: (function() {
  /* Bluesky Lists Viewer with Native UX */
  console.log('Starting Bluesky Lists Viewer...');
  
  let currentUrl = window.location.href;
  console.log('Current URL:', currentUrl);
  let didMatch = currentUrl.match(/profile\/([^\/\?]+)/);
  if (!didMatch) {
    alert('Please navigate to a Bluesky profile page first!');
    return;
  }
  let profileIdentifier = didMatch[1];
  console.log('Profile identifier:', profileIdentifier);
  
  /* Remove existing modal if present */
  let existingModal = document.getElementById('bsky-lists-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  /* Create styles matching native Bsky theme */
  const styles = `
    #bsky-lists-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }
    
    #bsky-lists-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #16202A;
      border: 1px solid #2A3F4F;
      border-radius: 12px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);
      font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #F1F3F5;
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      overflow: hidden;
    }
    
    #bsky-lists-header {
      padding: 20px;
      border-bottom: 1px solid #2A3F4F;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #bsky-lists-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #F1F3F5;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    #bsky-lists-close {
      cursor: pointer;
      background: transparent;
      border: none;
      color: #788E9F;
      font-size: 20px;
      padding: 4px 8px;
      border-radius: 4px;
      line-height: 1;
    }
    
    #bsky-lists-close:hover {
      background: #1E293B;
      color: #F1F3F5;
    }
    
    #bsky-lists-content {
      padding: 20px;
      overflow-y: auto;
      max-height: calc(80vh - 80px);
    }
    
    .bsky-list-item {
      background: #1E293B;
      border: 1px solid #2A3F4F;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .bsky-list-item:hover {
      background: #253344;
      border-color: #3A4F5F;
      transform: translateY(-1px);
    }
    
    .bsky-list-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .bsky-list-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
      border: 1px solid #2A3F4F;
    }
    
    .bsky-list-name {
      margin: 0;
      color: #F1F3F5;
      font-size: 16px;
      font-weight: 600;
    }
    
    .bsky-list-date {
      margin: 4px 0 0 0;
      color: #788E9F;
      font-size: 12px;
    }
    
    .bsky-list-description {
      margin: 0;
      color: #93ADC8;
      font-size: 14px;
      line-height: 1.4;
    }
    
    .bsky-list-count {
      color: #788E9F;
      font-size: 14px;
      margin-bottom: 15px;
    }
    
    .bsky-loading {
      text-align: center;
      color: #788E9F;
      padding: 40px 0;
    }
    
    .bsky-loading-icon {
      font-size: 24px;
      margin-bottom: 10px;
      animation: spin 1s linear infinite;
    }
    
    .bsky-empty {
      text-align: center;
      color: #788E9F;
      padding: 40px 20px;
    }
    
    .bsky-empty-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    .bsky-error {
      text-align: center;
      color: #EF4444;
      padding: 40px 20px;
    }
    
    .bsky-error-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .bsky-error-details {
      font-size: 14px;
      color: #788E9F;
      margin-top: 8px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  /* Add styles to page */
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  /* Create overlay */
  const overlay = document.createElement('div');
  overlay.id = 'bsky-lists-overlay';
  document.body.appendChild(overlay);
  
  /* Create modal */
  let modal = document.createElement('div');
  modal.id = 'bsky-lists-modal';
  modal.innerHTML = `
    <div id="bsky-lists-header">
      <h2>📋 Bluesky Lists</h2>
      <button id="bsky-lists-close">&times;</button>
    </div>
    <div id="bsky-lists-content">
      <div class="bsky-loading">
        <div class="bsky-loading-icon">🔄</div>
        <div>Loading lists...</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  /* Close function */
  function closeModal() {
    modal.remove();
    overlay.remove();
    styleElement.remove();
  }

  /* Event listeners */
  document.getElementById('bsky-lists-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  /* Escape key */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  async function resolveDid(identifier) {
    if (identifier.startsWith('did:')) {
      return identifier;
    }
    try {
      console.log('Resolving DID for:', identifier);
      let response = await fetch(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${identifier}`);
      let data = await response.json();
      console.log('Resolved DID:', data.did);
      return data.did;
    } catch (error) {
      console.error('Error resolving DID:', error);
      throw error;
    }
  }
  
  async function fetchLists() {
    try {
      let did = await resolveDid(profileIdentifier);
      console.log('Final DID:', did);
      let response = await fetch(`https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=app.bsky.graph.list`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      let data = await response.json();
      console.log('Lists data:', data);
      let content = document.getElementById('bsky-lists-content');
      
      if (!data.records || data.records.length === 0) {
        content.innerHTML = `
          <div class="bsky-empty">
            <div class="bsky-empty-icon">📝</div>
            <p>No lists found for this user.</p>
          </div>
        `;
        return;
      }
      
      let listsHtml = data.records.map(record => {
        let list = record.value;
        let createdDate = new Date(list.createdAt).toLocaleDateString();
        let listUrl = `https://bsky.app/profile/${did}/lists/${record.uri.split('/').pop()}`;
        let description = list.description || 'No description';
        if (description.length > 100) {
          description = description.substring(0, 100) + '...';
        }
        
        let avatarHtml = '';
        if (list.avatar) {
          avatarHtml = `<img src="https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${list.avatar.ref.$link}" class="bsky-list-avatar" alt="List avatar">`;
        }
        
        return `
          <div class="bsky-list-item" onclick="window.open('${listUrl}','_blank')">
            <div class="bsky-list-header">
              ${avatarHtml}
              <div>
                <h3 class="bsky-list-name">${list.name}</h3>
                <p class="bsky-list-date">Created ${createdDate}</p>
              </div>
            </div>
            <p class="bsky-list-description">${description}</p>
          </div>
        `;
      }).join('');
      
      content.innerHTML = `
        <div class="bsky-list-count">
          <strong>${data.records.length}</strong> list${data.records.length === 1 ? '' : 's'} found
        </div>
        ${listsHtml}
      `;
    } catch (error) {
      console.error('Error fetching lists:', error);
      let content = document.getElementById('bsky-lists-content');
      content.innerHTML = `
        <div class="bsky-error">
          <div class="bsky-error-icon">⚠️</div>
          <p><strong>Error loading lists</strong></p>
          <div class="bsky-error-details">
            ${error.message}<br>
            <small>Check the browser console for more details.</small>
          </div>
        </div>
      `;
    }
  }
  
  fetchLists();
})();
