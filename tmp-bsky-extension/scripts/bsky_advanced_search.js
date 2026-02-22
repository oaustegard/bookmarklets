(function () {
  /* @title: BlueSky Advanced Search */
  /* @description: Opens an advanced search form for BlueSky with filtering options */
  /* @domains: bsky.app */
  /* Redirect if not on BlueSky */
  if (!window.location.hostname.includes('bsky.app')) {
    alert('Redirecting to BlueSky search. Please click the bookmarklet again once the page loads.');
    window.location.href = 'https://bsky.app/search';
    return;
  }

  /* Check if panel already exists */
  if (document.getElementById('advanced-search-panel')) {
    document.getElementById('advanced-search-panel').style.display = 'block';
    return;
  }

  /* Create styles */
  const styles = `
    #advanced-search-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #16202A;
      border: 1px solid #2A3F4F;
      border-radius: 12px;
      padding: 20px;
      z-index: 10000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);
      font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #F1F3F5;
      width: 420px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    #advanced-search-panel h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    #advanced-search-panel .close-btn {
      cursor: pointer;
      background: transparent;
      border: none;
      color: #788E9F;
      font-size: 20px;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    #advanced-search-panel .close-btn:hover {
      background: #1E293B;
      color: #F1F3F5;
    }
    
    #advanced-search-panel .form-group {
      margin-bottom: 16px;
    }
    
    #advanced-search-panel label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #93ADC8;
      margin-bottom: 6px;
    }
    
    #advanced-search-panel input,
    #advanced-search-panel select {
      width: 100%;
      padding: 10px 12px;
      background: #1E293B;
      border: 1px solid #2A3F4F;
      border-radius: 6px;
      color: #F1F3F5;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    #advanced-search-panel input:focus,
    #advanced-search-panel select:focus {
      outline: none;
      border-color: #0783FF;
    }
    
    #advanced-search-panel .date-group {
      display: flex;
      gap: 12px;
    }
    
    #advanced-search-panel .date-group .form-group {
      flex: 1;
    }
    
    #advanced-search-panel .search-btn {
      width: 100%;
      padding: 12px;
      background: #0783FF;
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
    }
    
    #advanced-search-panel .search-btn:hover {
      background: #0572D9;
    }
    
    #advanced-search-panel .tip {
      font-size: 12px;
      color: #788E9F;
      margin-top: 4px;
    }
    
    #advanced-search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }
  `;

  /* Add styles to page */
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);

  /* Create overlay */
  const overlay = document.createElement('div');
  overlay.id = 'advanced-search-overlay';
  document.body.appendChild(overlay);

  /* Create panel */
  const panel = document.createElement('div');
  panel.id = 'advanced-search-panel';
  panel.innerHTML = `
    <h2>
      Advanced Search
      <button class="close-btn">&times;</button>
    </h2>
    
    <div class="form-group">
      <label for="search-query">Search Terms</label>
      <input type="text" id="search-query" placeholder="Enter keywords...">
      <div class="tip">Use quotes for exact phrases, e.g., "hello world"</div>
    </div>
    
    <div class="form-group">
      <label for="search-hashtag">Hashtag</label>
      <input type="text" id="search-hashtag" placeholder="e.g., technology">
      <div class="tip">Don't include the # symbol</div>
    </div>
    
    <div class="form-group">
      <label for="search-from">Posts From User</label>
      <input type="text" id="search-from" placeholder="e.g., austegard.com">
      <div class="tip">Enter username without @</div>
    </div>
    
    <div class="form-group">
      <label for="search-mentions">Posts Mentioning User</label>
      <input type="text" id="search-mentions" placeholder="e.g., bsky.team">
      <div class="tip">Enter username without @</div>
    </div>
    
    <div class="form-group">
      <label for="search-url">URL or Domain</label>
      <input type="text" id="search-url" placeholder="e.g., npr.org or full URL">
      <div class="tip">Use domain:npr.org to find all links from npr.org</div>
    </div>
    
    <div class="form-group">
      <label for="search-language">Language</label>
      <select id="search-language">
        <option value="">Any language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="zh">Chinese</option>
        <option value="ar">Arabic</option>
        <option value="no">Norwegian</option>
      </select>
    </div>
    
    <div class="date-group">
      <div class="form-group">
        <label for="search-since">Since Date</label>
        <input type="date" id="search-since">
      </div>
      
      <div class="form-group">
        <label for="search-until">Until Date</label>
        <input type="date" id="search-until">
      </div>
    </div>
    
    <button class="search-btn">Search</button>
  `;

  document.body.appendChild(panel);

  /* Close function */
  function closePanel() {
    panel.style.display = 'none';
    overlay.style.display = 'none';
  }

  /* Event listeners */
  panel.querySelector('.close-btn').addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.style.display !== 'none') {
      closePanel();
    }
  });

  /* Build search query */
  function buildSearchQuery() {
    const parts = [];

    const query = document.getElementById('search-query').value.trim();
    if (query) {
      /* Check if already has quotes */
      if (query.startsWith('"') && query.endsWith('"')) {
        parts.push(query);
      } else {
        parts.push(query);
      }
    }

    const hashtag = document.getElementById('search-hashtag').value.trim();
    if (hashtag) {
      parts.push(`#${hashtag.replace('#', '')}`);
    }

    const from = document.getElementById('search-from').value.trim();
    if (from) {
      parts.push(`from:${from.replace('@', '')}`);
    }

    const mentions = document.getElementById('search-mentions').value.trim();
    if (mentions) {
      parts.push(`mentions:${mentions.replace('@', '')}`);
    }

    const url = document.getElementById('search-url').value.trim();
    if (url) {
      if (url.includes('://')) {
        parts.push(url);
      } else {
        parts.push(`domain:${url}`);
      }
    }

    const language = document.getElementById('search-language').value;
    if (language) {
      parts.push(`lang:${language}`);
    }

    const since = document.getElementById('search-since').value;
    if (since) {
      parts.push(`since:${since}`);
    }

    const until = document.getElementById('search-until').value;
    if (until) {
      parts.push(`until:${until}`);
    }

    return parts.join(' ');
  }

  /* Search button handler */
  panel.querySelector('.search-btn').addEventListener('click', function () {
    const searchQuery = buildSearchQuery();
    if (searchQuery) {
      window.location.href = `https://bsky.app/search?q=${encodeURIComponent(searchQuery)}`;
    } else {
      alert('Please enter at least one search criterion');
    }
  });

  /* If URL has existing query, try to populate fields */
  const urlParams = new URLSearchParams(window.location.search);
  const existingQuery = urlParams.get('q');
  if (existingQuery) {
    const decoded = decodeURIComponent(existingQuery);

    /* Simple parsing of existing query - more complex patterns might need regex */
    const parts = decoded.split(' ');
    const mainQuery = [];

    parts.forEach(part => {
      if (part.startsWith('from:')) {
        document.getElementById('search-from').value = part.substring(5);
      } else if (part.startsWith('mentions:') || part.startsWith('to:')) {
        document.getElementById('search-mentions').value = part.replace(/^(mentions:|to:)/, '');
      } else if (part.startsWith('#')) {
        document.getElementById('search-hashtag').value = part.substring(1);
      } else if (part.startsWith('lang:')) {
        document.getElementById('search-language').value = part.substring(5);
      } else if (part.startsWith('since:')) {
        document.getElementById('search-since').value = part.substring(6);
      } else if (part.startsWith('until:')) {
        document.getElementById('search-until').value = part.substring(6);
      } else if (part.startsWith('domain:')) {
        document.getElementById('search-url').value = part.substring(7);
      } else {
        mainQuery.push(part);
      }
    });

    if (mainQuery.length) {
      document.getElementById('search-query').value = mainQuery.join(' ');
    }
  }

})();
