javascript: (function() {
  /* Claude Skills Viewer - Display active skills with quick copy */

  /* Check if we're on Claude.ai */
  if (!window.location.hostname.includes('claude.ai')) {
    alert('This bookmarklet only works on claude.ai');
    return;
  }

  /* Get Organization ID */
  const getCurrentOrgId = () => {
    const getLastActiveOrg = () => {
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        const content = script.textContent;
        if (content?.includes('lastActiveOrg')) {
          const match = content.match(/\\"lastActiveOrg\\",\\"value\\":\\"([a-f0-9-]{36})\\"/);
          if (match?.[1]) {
            return { id: match[1], source: 'lastActiveOrg' };
          }
        }
      }
      return null;
    };

    const org = getLastActiveOrg();
    if (org) {
      return org.id;
    }
    return null;
  };

  /* Get the organization ID */
  const orgId = getCurrentOrgId();

  if (!orgId) {
    alert('Could not find organization ID. Please ensure you are logged in to Claude.ai.');
    return;
  }

  /* Remove existing modal if present (idempotent) */
  const existingModal = document.getElementById('claude-skills-modal');
  const existingOverlay = document.getElementById('claude-skills-overlay');
  const existingStyle = document.getElementById('claude-skills-style');
  if (existingModal) existingModal.remove();
  if (existingOverlay) existingOverlay.remove();
  if (existingStyle) existingStyle.remove();

  /* Create styles */
  const styles = `
    #claude-skills-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }

    #claude-skills-modal {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #e0e0e0;
      width: 450px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 40px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    #claude-skills-header {
      padding: 16px 20px;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    #claude-skills-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #claude-skills-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #claude-skills-sort-toggle {
      cursor: pointer;
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      color: #b0b0b0;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: inherit;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    #claude-skills-sort-toggle:hover {
      background: #333;
      border-color: #4a4a4a;
      color: #fff;
    }

    #claude-skills-close {
      cursor: pointer;
      background: transparent;
      border: none;
      color: #888;
      font-size: 24px;
      padding: 0;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #claude-skills-close:hover {
      background: #2a2a2a;
      color: #fff;
    }

    #claude-skills-content {
      padding: 12px 16px;
      overflow-y: auto;
      flex: 1;
    }

    #claude-skills-footer {
      padding: 10px 16px;
      border-top: 1px solid #333;
      background: #1a1a1a;
      flex-shrink: 0;
      text-align: center;
    }

    #claude-skills-footer a {
      color: #888;
      text-decoration: none;
      font-size: 12px;
      transition: color 0.2s ease;
    }

    #claude-skills-footer a:hover {
      color: #fff;
    }

    .claude-skill-item {
      background: #2a2a2a;
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .claude-skill-item:hover {
      background: #333;
      border-color: #4a4a4a;
      transform: translateX(-2px);
    }

    .claude-skill-name {
      margin: 0 0 4px 0;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .claude-skill-description {
      margin: 0 0 4px 0;
      color: #b0b0b0;
      font-size: 12px;
      line-height: 1.3;
    }

    .claude-skill-date {
      margin: 0;
      color: #777;
      font-size: 10px;
    }

    .claude-skill-count {
      color: #888;
      font-size: 12px;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #333;
    }

    .claude-loading {
      text-align: center;
      color: #888;
      padding: 40px 20px;
    }

    .claude-loading-icon {
      font-size: 24px;
      margin-bottom: 10px;
      animation: spin 1s linear infinite;
    }

    .claude-empty {
      text-align: center;
      color: #888;
      padding: 40px 20px;
    }

    .claude-empty-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .claude-error {
      text-align: center;
      color: #ef4444;
      padding: 40px 20px;
    }

    .claude-error-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .claude-error-details {
      font-size: 13px;
      color: #888;
      margin-top: 8px;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .claude-copy-feedback {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #2a2a2a;
      color: #fff;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10001;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      animation: fadeInOut 1.5s ease;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    }
  `;

  /* Add styles to page */
  const styleElement = document.createElement('style');
  styleElement.id = 'claude-skills-style';
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  /* Create overlay */
  const overlay = document.createElement('div');
  overlay.id = 'claude-skills-overlay';
  document.body.appendChild(overlay);

  /* Create modal */
  const modal = document.createElement('div');
  modal.id = 'claude-skills-modal';
  modal.innerHTML = `
    <div id="claude-skills-header">
      <h2>🔧 Active Skills</h2>
      <div id="claude-skills-controls">
        <button id="claude-skills-sort-toggle">Sort: A-Z</button>
        <button id="claude-skills-close">&times;</button>
      </div>
    </div>
    <div id="claude-skills-content">
      <div class="claude-loading">
        <div class="claude-loading-icon">⏳</div>
        <div>Loading skills...</div>
      </div>
    </div>
    <div id="claude-skills-footer">
      <a href="https://claude.ai/settings/capabilities" target="_blank">Manage Skills →</a>
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
  document.getElementById('claude-skills-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  /* Escape key */
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  /* Copy to clipboard function */
  async function copyToClipboard(text, skillName) {
    try {
      await navigator.clipboard.writeText(text);

      /* Show feedback */
      const feedback = document.createElement('div');
      feedback.className = 'claude-copy-feedback';
      feedback.textContent = `Copied: ${skillName}`;
      document.body.appendChild(feedback);

      setTimeout(() => {
        feedback.remove();
      }, 1500);

      /* Close modal after brief delay */
      setTimeout(() => {
        closeModal();
      }, 500);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert(`Failed to copy. Skill name: ${text}`);
    }
  }

  /* Sort mode state - default to alphabetical */
  const SORT_KEY = 'claude-skills-sort-mode';
  let currentSortMode = localStorage.getItem(SORT_KEY) || 'alphabetical';
  let enabledSkills = [];

  /* Update sort toggle button text */
  function updateSortButton() {
    const button = document.getElementById('claude-skills-sort-toggle');
    if (button) {
      button.textContent = currentSortMode === 'alphabetical' ? 'Sort: A-Z' : 'Sort: Recent';
    }
  }

  /* Render skills with current sort */
  function renderSkills() {
    const content = document.getElementById('claude-skills-content');

    if (enabledSkills.length === 0) {
      content.innerHTML = `
        <div class="claude-empty">
          <div class="claude-empty-icon">📭</div>
          <p>No active skills found in this organization.</p>
        </div>
      `;
      return;
    }

    /* Sort skills based on current mode */
    let sortedSkills;
    if (currentSortMode === 'alphabetical') {
      sortedSkills = [...enabledSkills].sort((a, b) => {
        const nameA = (a.name || 'Unnamed skill').toLowerCase();
        const nameB = (b.name || 'Unnamed skill').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      /* Reverse chronological (newest first) */
      sortedSkills = [...enabledSkills].sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB - dateA;
      });
    }

    /* Generate skills HTML */
    const skillsHtml = sortedSkills.map(skill => {
      const name = skill.name || 'Unnamed skill';
      const description = skill.description || 'No description';
      const updateDate = skill.updated_at || skill.created_at;

      let dateStr = 'Unknown date';
      if (updateDate) {
        const date = new Date(updateDate);
        dateStr = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      /* Truncate long descriptions */
      let displayDesc = description;
      if (description.length > 120) {
        displayDesc = description.substring(0, 120) + '...';
      }

      /* Escape HTML in text */
      const escapeHtml = (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      };

      return `
        <div class="claude-skill-item" data-skill-name="${escapeHtml(name)}">
          <h3 class="claude-skill-name">${escapeHtml(name)}</h3>
          <p class="claude-skill-description">${escapeHtml(displayDesc)}</p>
          <p class="claude-skill-date">Updated: ${dateStr}</p>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div class="claude-skill-count">
        <strong>${sortedSkills.length}</strong> skill${sortedSkills.length === 1 ? '' : 's'} found
      </div>
      ${skillsHtml}
    `;

    /* Add click handlers to skill items */
    document.querySelectorAll('.claude-skill-item').forEach(item => {
      item.addEventListener('click', () => {
        const skillName = item.getAttribute('data-skill-name');
        copyToClipboard(skillName, skillName);
      });
    });

    updateSortButton();
  }

  /* Toggle sort mode */
  function toggleSort() {
    currentSortMode = currentSortMode === 'alphabetical' ? 'chronological' : 'alphabetical';
    localStorage.setItem(SORT_KEY, currentSortMode);
    renderSkills();
  }

  /* Add sort toggle handler */
  setTimeout(() => {
    const sortButton = document.getElementById('claude-skills-sort-toggle');
    if (sortButton) {
      sortButton.addEventListener('click', toggleSort);
    }
  }, 0);

  /* Fetch skills */
  async function fetchSkills() {
    try {
      const apiUrl = `https://claude.ai/api/organizations/${orgId}/skills/list-skills`;
      const response = await fetch(apiUrl, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      /* Check if we have skills */
      const skills = data.skills || data || [];

      /* Filter to only show enabled skills */
      enabledSkills = Array.isArray(skills) ? skills.filter(skill => skill.enabled === true) : [];

      renderSkills();

    } catch (error) {
      console.error('Error fetching skills:', error);
      const content = document.getElementById('claude-skills-content');
      content.innerHTML = `
        <div class="claude-error">
          <div class="claude-error-icon">⚠️</div>
          <p><strong>Error loading skills</strong></p>
          <div class="claude-error-details">
            ${error.message}<br>
            <small>Check the browser console for more details.</small>
          </div>
        </div>
      `;
    }
  }

  fetchSkills();
})();
