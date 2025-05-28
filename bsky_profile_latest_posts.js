javascript: (function() {
  /* Bluesky Profile Hover Posts Viewer */
  console.log('Starting Bluesky Profile Hover Posts Viewer...');
  
  /* Remove existing styles if present */
  let existingStyles = document.getElementById('bsky-hover-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  /* Create styles matching native Bsky theme */
  const styles = `
    #bsky-hover-dialog {
      position: fixed;
      background: #16202A;
      border: 1px solid #2A3F4F;
      border-radius: 12px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);
      font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #F1F3F5;
      width: 400px;
      max-width: 90vw;
      max-height: 500px;
      overflow: hidden;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    #bsky-hover-dialog.visible {
      pointer-events: auto;
      opacity: 1;
    }
    
    #bsky-hover-header {
      padding: 16px;
      border-bottom: 1px solid #2A3F4F;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    #bsky-hover-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #2A3F4F;
    }
    
    #bsky-hover-user {
      flex: 1;
    }
    
    #bsky-hover-name {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #F1F3F5;
    }
    
    #bsky-hover-handle {
      margin: 0;
      font-size: 13px;
      color: #93ADC8;
    }
    
    #bsky-hover-content {
      padding: 0;
      overflow-y: auto;
      max-height: 400px;
    }
    
    .bsky-post-item {
      padding: 16px;
      border-bottom: 1px solid #2A3F4F;
    }
    
    .bsky-post-item:last-child {
      border-bottom: none;
    }
    
    .bsky-post-date {
      font-size: 12px;
      color: #788E9F;
      margin-bottom: 8px;
    }
    
    .bsky-post-text {
      color: #F1F3F5;
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      word-wrap: break-word;
    }
    
    .bsky-post-stats {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      font-size: 12px;
      color: #788E9F;
    }
    
    .bsky-post-stat {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .bsky-loading {
      text-align: center;
      color: #788E9F;
      padding: 20px;
    }
    
    .bsky-loading-icon {
      font-size: 16px;
      margin-bottom: 8px;
      animation: spin 1s linear infinite;
    }
    
    .bsky-empty {
      text-align: center;
      color: #788E9F;
      padding: 20px;
    }
    
    .bsky-error {
      text-align: center;
      color: #EF4444;
      padding: 20px;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  /* Add styles to page */
  const styleElement = document.createElement('style');
  styleElement.id = 'bsky-hover-styles';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  /* Create dialog element */
  let dialog = document.createElement('div');
  dialog.id = 'bsky-hover-dialog';
  document.body.appendChild(dialog);

  let currentHoverTimeout;
  let currentProfile = null;
  let hoverEnabled = true;

  /* Function to show/hide hover functionality */
  function toggleHoverFunctionality() {
    hoverEnabled = !hoverEnabled;
    if (!hoverEnabled) {
      hideDialog();
      if (currentHoverTimeout) {
        clearTimeout(currentHoverTimeout);
      }
      console.log('Bluesky hover functionality disabled. Press Esc again to re-enable.');
    } else {
      console.log('Bluesky hover functionality enabled.');
    }
  }

  /* Function to extract profile identifier from link */
  function extractProfileIdentifier(linkElement) {
    const href = linkElement.getAttribute('href');
    if (!href) return null;
    
    const match = href.match(/\/profile\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  /* Function to format relative time */
  function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  }

  /* Function to fetch and display posts */
  async function showProfilePosts(profileId, mouseX, mouseY, profileElement) {
    if (!hoverEnabled || currentProfile === profileId) return; /* Skip if disabled or duplicate */
    
    currentProfile = profileId;
    console.log('Fetching posts for profile:', profileId);

    /* Position dialog to the right of cursor */
    dialog.style.left = `${mouseX + 20}px`;
    dialog.style.top = `${mouseY - 50}px`;
    
    /* Adjust position if dialog would go off screen */
    const dialogRect = dialog.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    if (mouseX + 420 > windowWidth) {
      dialog.style.left = `${mouseX - 420}px`;
    }
    if (mouseY + 400 > windowHeight) {
      dialog.style.top = `${windowHeight - 450}px`;
    }

    /* Extract profile info from hovered element */
    const avatarImg = profileElement.querySelector('img[alt*="avatar"], img[data-testid="userAvatarImage"]');
    const nameElement = profileElement.querySelector('[style*="font-weight: 600"], [class*="font-weight"]');
    const handleElement = profileElement.querySelector('[dir="auto"]:last-child, [style*="color: rgb(147, 165, 183)"]');
    
    const avatarSrc = avatarImg ? avatarImg.src : '';
    const displayName = nameElement ? nameElement.textContent.trim() : profileId;
    const handle = handleElement ? handleElement.textContent.trim() : `@${profileId}`;

    /* Show loading state */
    dialog.innerHTML = `
      <div id="bsky-hover-header">
        ${avatarSrc ? `<img id="bsky-hover-avatar" src="${avatarSrc}" alt="Avatar">` : ''}
        <div id="bsky-hover-user">
          <h3 id="bsky-hover-name">${displayName}</h3>
          <p id="bsky-hover-handle">${handle}</p>
        </div>
      </div>
      <div id="bsky-hover-content">
        <div class="bsky-loading">
          <div class="bsky-loading-icon">🔄</div>
          <div>Loading posts...</div>
        </div>
      </div>
    `;
    
    dialog.classList.add('visible');

    try {
      const response = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${profileId}&limit=5&filter=posts_no_replies`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Posts data:', data);
      
      const content = document.getElementById('bsky-hover-content');
      
      if (!data.feed || data.feed.length === 0) {
        content.innerHTML = `
          <div class="bsky-empty">
            <p>No recent posts found.</p>
          </div>
        `;
        return;
      }
      
      const postsHtml = data.feed.map(item => {
        const post = item.post;
        const record = post.record;
        const stats = {
          replies: post.replyCount || 0,
          reposts: post.repostCount || 0,
          likes: post.likeCount || 0,
          quotes: post.quoteCount || 0
        };
        
        const relativeTime = formatRelativeTime(record.createdAt);
        const postText = record.text || 'No text content';
        
        return `
          <div class="bsky-post-item">
            <div class="bsky-post-date">${relativeTime}</div>
            <p class="bsky-post-text">${postText}</p>
            <div class="bsky-post-stats">
              <span class="bsky-post-stat">💬 ${stats.replies}</span>
              <span class="bsky-post-stat">🔄 ${stats.reposts}</span>
              <span class="bsky-post-stat">❤️ ${stats.likes}</span>
              ${stats.quotes > 0 ? `<span class="bsky-post-stat">💭 ${stats.quotes}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');
      
      content.innerHTML = postsHtml;
      
    } catch (error) {
      console.error('Error fetching posts:', error);
      const content = document.getElementById('bsky-hover-content');
      content.innerHTML = `
        <div class="bsky-error">
          <p><strong>Error loading posts</strong></p>
          <p style="font-size: 12px;">${error.message}</p>
        </div>
      `;
    }
  }

  /* Function to hide dialog */
  function hideDialog() {
    dialog.classList.remove('visible');
    currentProfile = null;
  }

  /* Add hover listeners to profile links */
  function addHoverListeners() {
    const profileLinks = document.querySelectorAll('a[href*="/profile/"]');
    console.log(`Found ${profileLinks.length} profile links`);
    
    profileLinks.forEach(link => {
      if (link.dataset.bskyHoverAdded) return; /* Skip if already processed */
      link.dataset.bskyHoverAdded = 'true';
      
      link.addEventListener('mouseenter', function(e) {
        if (!hoverEnabled) return; /* Skip if hover is disabled */
        
        const profileId = extractProfileIdentifier(this);
        if (!profileId) return;
        
        /* Clear any existing timeout */
        if (currentHoverTimeout) {
          clearTimeout(currentHoverTimeout);
        }
        
        /* Set timeout to show dialog after brief delay */
        currentHoverTimeout = setTimeout(() => {
          showProfilePosts(profileId, e.clientX, e.clientY, this);
        }, 500);
      });
      
      link.addEventListener('mouseleave', function(e) {
        /* Clear timeout if mouse leaves before delay */
        if (currentHoverTimeout) {
          clearTimeout(currentHoverTimeout);
        }
        
        /* Hide dialog after short delay */
        setTimeout(() => {
          const dialogRect = dialog.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          
          /* Only hide if mouse is not over dialog */
          if (mouseX < dialogRect.left || mouseX > dialogRect.right || 
              mouseY < dialogRect.top || mouseY > dialogRect.bottom) {
            hideDialog();
          }
        }, 100);
      });
    });
  }

  /* Add escape key listener with capture and priority handling */
  function handleEscapeKey(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toggleHoverFunctionality();
    }
  }
  
  document.addEventListener('keydown', handleEscapeKey, true); /* Use capture phase */
  document.addEventListener('keyup', handleEscapeKey, true); /* Also capture keyup */

  /* Add listener for dialog mouse events */
  dialog.addEventListener('mouseenter', function() {
    /* Keep dialog visible when hovering over it */
    if (currentHoverTimeout) {
      clearTimeout(currentHoverTimeout);
    }
  });
  
  dialog.addEventListener('mouseleave', function() {
    hideDialog();
  });

  /* Initial setup */
  addHoverListeners();

  /* Re-run when page content changes (for dynamic loading) */
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldUpdate = true;
      }
    });
    if (shouldUpdate) {
      setTimeout(addHoverListeners, 100);
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('Bluesky Profile Hover Posts Viewer initialized! Press Esc to toggle hover functionality.');
  
  /* Cleanup function (for development) */
  window.bskyHoverCleanup = function() {
    observer.disconnect();
    document.removeEventListener('keydown', handleEscapeKey, true);
    document.removeEventListener('keyup', handleEscapeKey, true);
    dialog.remove();
    styleElement.remove();
    console.log('Bluesky Profile Hover Posts Viewer cleaned up');
  };
})();
