javascript:(function() {
  /* Configuration */
  const DAYS_TO_FETCH = 7;
  const BATCH_SIZE = 50;
  
  /* Rate limiting configuration (milliseconds) */
  const RATE_LIMIT_TICK = 200; /* Base delay unit. Set to 1 for instant, 200 for polite */
  const DELAY_MULTIPLIERS = {
    initial: 1,    /* Requests 1-3: RATE_LIMIT_TICK * 1 */
    moderate: 1.75, /* Requests 4-6: RATE_LIMIT_TICK * 1.75 */
    heavy: 2.5     /* Requests 7+: RATE_LIMIT_TICK * 2.5 */
  };
  const BETWEEN_WEEKS_DELAY = RATE_LIMIT_TICK * 2.5; /* Delay between current and prior week fetches */
  
  /* Get Organization ID */
  const getCurrentOrgId = () => {
    /* Method 1: Extract from lastActiveOrg preference (escaped JSON) */
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

  /* Calculate cutoff date */
  const getCutoffDate = (days) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return cutoff;
  };

  /* Fetch conversations with pagination, supporting date range filtering */
  const fetchAllConversations = async (orgId, startDate, endDate = null, statusCallback = null) => {
    const allConversations = [];
    let offset = 0;
    let hasMore = true;
    let requestCount = 0;

    console.log(`Fetching conversations from ${startDate.toISOString()}${endDate ? ` to ${endDate.toISOString()}` : ''}`);

    while (hasMore) {
      try {
        const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations?limit=${BATCH_SIZE}&offset=${offset}`;
        console.log(`Fetching batch: offset=${offset}`);
        
        if (statusCallback) {
          statusCallback(`Fetching conversations... (${allConversations.length} found so far)`);
        }
        
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const batch = await response.json();
        console.log(`Received ${batch.length} conversations`);
        requestCount++;

        if (batch.length === 0) {
          hasMore = false;
          break;
        }

        /* Filter by date range and add to results */
        for (const conv of batch) {
          const updatedAt = new Date(conv.updated_at);
          
          /* Check if before the start date (stop pagination) */
          if (updatedAt < startDate) {
            hasMore = false;
            break;
          }
          
          /* Check if within range */
          if (updatedAt >= startDate && (!endDate || updatedAt < endDate)) {
            allConversations.push(conv);
          }
        }

        /* Check if we got a full batch (might have more) */
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        }

        offset += BATCH_SIZE;

        /* Progressive rate limiting using tick-based delays */
        if (hasMore) {
          const multiplier = requestCount <= 3 ? DELAY_MULTIPLIERS.initial : 
                           requestCount <= 6 ? DELAY_MULTIPLIERS.moderate : 
                           DELAY_MULTIPLIERS.heavy;
          const delay = RATE_LIMIT_TICK * multiplier;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.error('Error fetching conversations:', error);
        alert(`Error fetching conversations: ${error.message}`);
        hasMore = false;
      }
    }

    return allConversations;
  };

  /* Group conversations by project */
  const groupByProject = (conversations) => {
    const grouped = {};
    
    for (const conv of conversations) {
      const projectName = conv.project?.name || '(No Project)';
      if (!grouped[projectName]) {
        grouped[projectName] = [];
      }
      grouped[projectName].push(conv);
    }

    /* Sort conversations within each project by date (newest first) */
    for (const projectName in grouped) {
      grouped[projectName].sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      );
    }

    return grouped;
  };

  /* Calculate project-level statistics */
  const calculateProjectStats = (conversations) => {
    const stats = {};
    
    for (const conv of conversations) {
      const projectName = conv.project?.name || '(No Project)';
      if (!stats[projectName]) {
        stats[projectName] = {
          conversationCount: 0,
          totalSummaryLength: 0,
          conversationsWithSummary: 0
        };
      }
      
      stats[projectName].conversationCount++;
      
      if (conv.summary) {
        stats[projectName].conversationsWithSummary++;
        stats[projectName].totalSummaryLength += conv.summary.length;
      }
    }

    return stats;
  };

  /* Format as markdown */
  const formatAsMarkdown = (groupedConversations, days, currentStats, priorStats) => {
    let markdown = `# Claude Conversations - Last ${days} Days\n\n`;
    markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    /* Add week-over-week statistics summary */
    markdown += `## Usage Statistics (Week-over-Week)\n\n`;
    
    const allProjects = new Set([
      ...Object.keys(currentStats),
      ...Object.keys(priorStats)
    ]);
    
    markdown += `| Project | Current Week | Prior Week | Change |\n`;
    markdown += `|---------|--------------|------------|--------|\n`;
    
    for (const projectName of Array.from(allProjects).sort()) {
      const current = currentStats[projectName]?.conversationCount || 0;
      const prior = priorStats[projectName]?.conversationCount || 0;
      const change = current - prior;
      const changeStr = change > 0 ? `+${change}` : change.toString();
      const changePercent = prior > 0 ? ` (${((change / prior) * 100).toFixed(0)}%)` : '';
      
      markdown += `| ${projectName} | ${current} | ${prior} | ${changeStr}${changePercent} |\n`;
    }
    
    markdown += `\n---\n\n`;

    const projectNames = Object.keys(groupedConversations).sort();

    for (const projectName of projectNames) {
      const conversations = groupedConversations[projectName];
      markdown += `## Project: ${projectName}\n\n`;
      markdown += `**Total Conversations:** ${conversations.length}\n\n`;

      for (const conv of conversations) {
        const date = new Date(conv.updated_at).toLocaleString();
        markdown += `### ${conv.name}\n\n`;
        markdown += `- **Updated:** ${date}\n`;
        markdown += `- **UUID:** ${conv.uuid}\n\n`;
        
        if (conv.summary) {
          markdown += `**Summary:**\n\n${conv.summary}\n\n`;
        }
        
        markdown += `---\n\n`;
      }
    }

    return markdown;
  };

  /* Create and display status overlay */
  const createStatusOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'claude-fetch-status';
    overlay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 9999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      min-width: 250px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(overlay);
    return overlay;
  };

  const updateStatus = (overlay, message) => {
    if (overlay) {
      overlay.textContent = message;
    }
  };

  const removeStatus = (overlay) => {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };

  /* Display results in a modal */
  const displayResults = (markdown) => {
    /* Create modal overlay */
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    /* Create modal content */
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    `;

    /* Create textarea */
    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.cssText = `
      width: 100%;
      min-width: 600px;
      height: 500px;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
    `;

    /* Create buttons container */
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      margin-top: 15px;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    `;

    /* Copy button */
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy to Clipboard';
    copyButton.style.cssText = `
      padding: 8px 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    copyButton.onclick = () => {
      textarea.select();
      document.execCommand('copy');
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy to Clipboard';
      }, 2000);
    };

    /* Close button */
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
      padding: 8px 16px;
      background: #666;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    closeButton.onclick = () => {
      document.body.removeChild(overlay);
    };

    /* Assemble modal */
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    modal.appendChild(textarea);
    modal.appendChild(buttonContainer);
    overlay.appendChild(modal);

    /* Add to page */
    document.body.appendChild(overlay);

    /* Select all text for easy copying */
    textarea.select();
  };

  /* Main execution */
  const main = async () => {
    const statusOverlay = createStatusOverlay();
    
    try {
      updateStatus(statusOverlay, 'Starting conversation fetch...');
      console.log('Starting Claude conversation fetch...');

      /* Get organization ID */
      const orgId = getCurrentOrgId();
      if (!orgId) {
        removeStatus(statusOverlay);
        alert('Could not find organization ID. Make sure you are logged into Claude.');
        return;
      }
      console.log(`Organization ID: ${orgId}`);

      /* Calculate date ranges */
      const now = new Date();
      const currentWeekStart = getCutoffDate(DAYS_TO_FETCH);
      const priorWeekStart = new Date(currentWeekStart);
      priorWeekStart.setDate(priorWeekStart.getDate() - DAYS_TO_FETCH);

      console.log(`Current week: ${currentWeekStart.toISOString()} to ${now.toISOString()}`);
      console.log(`Prior week: ${priorWeekStart.toISOString()} to ${currentWeekStart.toISOString()}`);

      /* Fetch current week conversations */
      updateStatus(statusOverlay, 'Fetching current week conversations...');
      console.log('Fetching current week conversations...');
      const currentConversations = await fetchAllConversations(
        orgId, 
        currentWeekStart, 
        null,
        (msg) => updateStatus(statusOverlay, `Current week: ${msg}`)
      );
      console.log(`Current week: ${currentConversations.length} conversations`);

      /* Brief pause between the two major fetch operations */
      updateStatus(statusOverlay, 'Pausing briefly before fetching prior week...');
      await new Promise(resolve => setTimeout(resolve, BETWEEN_WEEKS_DELAY));

      /* Fetch prior week conversations */
      updateStatus(statusOverlay, 'Fetching prior week conversations...');
      console.log('Fetching prior week conversations...');
      const priorConversations = await fetchAllConversations(
        orgId, 
        priorWeekStart, 
        currentWeekStart,
        (msg) => updateStatus(statusOverlay, `Prior week: ${msg}`)
      );
      console.log(`Prior week: ${priorConversations.length} conversations`);

      if (currentConversations.length === 0) {
        removeStatus(statusOverlay);
        alert(`No conversations found in the last ${DAYS_TO_FETCH} days.`);
        return;
      }

      /* Calculate statistics for both weeks */
      updateStatus(statusOverlay, 'Analyzing conversations...');
      const currentStats = calculateProjectStats(currentConversations);
      const priorStats = calculateProjectStats(priorConversations);

      /* Group current week by project */
      const grouped = groupByProject(currentConversations);

      /* Format as markdown */
      updateStatus(statusOverlay, 'Generating report...');
      const markdown = formatAsMarkdown(grouped, DAYS_TO_FETCH, currentStats, priorStats);

      /* Display results */
      removeStatus(statusOverlay);
      displayResults(markdown);

    } catch (error) {
      console.error('Fatal error:', error);
      removeStatus(statusOverlay);
      alert(`Fatal error: ${error.message}`);
    }
  };

  /* Run */
  main();
})();
