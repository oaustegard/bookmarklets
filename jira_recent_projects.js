javascript:(function() {
  /* Configuration */
  const config = {
    maxProjects: 20,
    modalWidth: '500px',
    modalMaxHeight: '80vh',
    baseUrl: window.location.origin
  };

  /* Create and inject CSS for the modal */
  function injectStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = 'jira-recent-projects-styles';
    styleEl.textContent = `
      .jrp-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
      }
      .jrp-modal {
        background-color: white;
        border-radius: 4px;
        width: ${config.modalWidth};
        max-width: 90%;
        max-height: ${config.modalMaxHeight};
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .jrp-header {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }
      .jrp-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
      }
      .jrp-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
      }
      .jrp-content {
        padding: 0;
        overflow-y: auto;
        overflow-x: hidden;
        flex-grow: 1;
        max-height: calc(${config.modalMaxHeight} - 60px);
      }
      .jrp-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .jrp-project {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
      }
      .jrp-project:hover {
        background-color: #f5f5f5;
      }
      .jrp-avatar {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        border-radius: 3px;
        flex-shrink: 0;
      }
      .jrp-info {
        flex-grow: 1;
        min-width: 0;
      }
      .jrp-name {
        font-weight: bold;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .jrp-key {
        color: #6b778c;
        font-size: 12px;
      }
      .jrp-category {
        font-size: 12px;
        color: #6b778c;
        background: #f4f5f7;
        padding: 2px 6px;
        border-radius: 3px;
        margin-left: 8px;
        flex-shrink: 0;
        white-space: nowrap;
      }
      .jrp-loading {
        padding: 20px;
        text-align: center;
        color: #6b778c;
      }
      .jrp-error {
        padding: 20px;
        color: #de350b;
        text-align: center;
      }
      .jrp-counter {
        font-size: 12px;
        color: #6b778c;
        margin-left: 10px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  /* Create modal DOM structure */
  function createModal() {
    const overlay = document.createElement('div');
    overlay.className = 'jrp-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'jrp-modal';
    
    const header = document.createElement('div');
    header.className = 'jrp-header';
    
    const title = document.createElement('h2');
    title.className = 'jrp-title';
    title.textContent = 'Recent Projects';
    
    const counter = document.createElement('span');
    counter.className = 'jrp-counter';
    counter.id = 'jrp-counter';
    title.appendChild(counter);
    
    const closeButton = document.createElement('button');
    closeButton.className = 'jrp-close';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', removeModal);
    
    const content = document.createElement('div');
    content.className = 'jrp-content';
    
    const loadingEl = document.createElement('div');
    loadingEl.className = 'jrp-loading';
    loadingEl.textContent = 'Loading recent projects...';
    content.appendChild(loadingEl);
    
    header.appendChild(title);
    header.appendChild(closeButton);
    modal.appendChild(header);
    modal.appendChild(content);
    overlay.appendChild(modal);
    
    document.body.appendChild(overlay);
    
    /* Close modal when clicking outside */
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        removeModal();
      }
    });
    
    /* Close modal when ESC is pressed */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        removeModal();
      }
    });
    
    return { overlay, content, counter };
  }

  /* Remove modal from DOM */
  function removeModal() {
    const overlay = document.querySelector('.jrp-overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
    
    const styles = document.getElementById('jira-recent-projects-styles');
    if (styles) {
      document.head.removeChild(styles);
    }
    
    /* Remove any event listeners added to document */
    document.removeEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        removeModal();
      }
    });
  }

  /* Fetch recent projects from API */
  function fetchRecentProjects() {
    const timestamp = Date.now();
    const url = `${config.baseUrl}/rest/api/2/project?recent=${config.maxProjects}&_=${timestamp}`;
    
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }
      return response.json();
    });
  }

  /* Render projects list */
  function renderProjects(projects, contentEl, counterEl) {
    if (!projects || !projects.length) {
      contentEl.innerHTML = '<div class="jrp-error">No recent projects found.</div>';
      return;
    }
    
    /* Update counter */
    counterEl.textContent = `(${projects.length})`;
    
    const listEl = document.createElement('ul');
    listEl.className = 'jrp-list';
    listEl.setAttribute('role', 'list');
    
    projects.forEach(project => {
      const projectUrl = `${config.baseUrl}/projects/${project.key}/issues`;
      const listItem = document.createElement('li');
      
      const link = document.createElement('a');
      link.className = 'jrp-project';
      link.href = projectUrl;
      
      const avatar = document.createElement('img');
      avatar.className = 'jrp-avatar';
      avatar.src = project.avatarUrls['24x24'];
      avatar.alt = '';
      avatar.setAttribute('aria-hidden', 'true');
      
      const info = document.createElement('div');
      info.className = 'jrp-info';
      
      const name = document.createElement('div');
      name.className = 'jrp-name';
      name.textContent = project.name;
      
      const key = document.createElement('div');
      key.className = 'jrp-key';
      key.textContent = project.key;
      
      info.appendChild(name);
      info.appendChild(key);
      
      link.appendChild(avatar);
      link.appendChild(info);
      
      if (project.projectCategory) {
        const category = document.createElement('div');
        category.className = 'jrp-category';
        category.textContent = project.projectCategory.name;
        link.appendChild(category);
      }
      
      listItem.appendChild(link);
      listEl.appendChild(listItem);
    });
    
    contentEl.innerHTML = '';
    contentEl.appendChild(listEl);
  }

  /* Main function */
  function init() {
    /* Check if already open */
    if (document.querySelector('.jrp-overlay')) {
      return;
    }
    
    /* Inject styles */
    injectStyles();
    
    /* Create UI */
    const { overlay, content, counter } = createModal();
    
    /* Fetch and render projects */
    fetchRecentProjects()
      .then(projects => {
        renderProjects(projects, content, counter);
      })
      .catch(error => {
        content.innerHTML = `<div class="jrp-error">Error loading projects: ${error.message}</div>`;
        console.error('Jira Recent Projects Error:', error);
      });
  }
  
  /* Start the bookmarklet */
  init();
})();
