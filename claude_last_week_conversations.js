javascript:(function() {
  /* Configuration */
  const DAYS_TO_FETCH = 7;
  const BATCH_SIZE = 50;
  
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

  /* Fetch conversations with pagination */
  const fetchAllConversations = async (orgId, cutoffDate) => {
    const allConversations = [];
    let offset = 0;
    let hasMore = true;

    console.log(`Fetching conversations since ${cutoffDate.toISOString()}`);

    while (hasMore) {
      try {
        const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations?limit=${BATCH_SIZE}&offset=${offset}`;
        console.log(`Fetching batch: offset=${offset}`);
        
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

        if (batch.length === 0) {
          hasMore = false;
          break;
        }

        /* Filter by date and add to results */
        for (const conv of batch) {
          const updatedAt = new Date(conv.updated_at);
          if (updatedAt >= cutoffDate) {
            allConversations.push(conv);
          } else {
            /* Stop pagination if we've passed the cutoff date */
            hasMore = false;
            break;
          }
        }

        /* Check if we got a full batch (might have more) */
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        }

        offset += BATCH_SIZE;

        /* Rate limiting: small delay between requests */
        await new Promise(resolve => setTimeout(resolve, 100));

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

  /* Format as markdown */
  const formatAsMarkdown = (groupedConversations, days) => {
    let markdown = `# Claude Conversations - Last ${days} Days\n\n`;
    markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

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
    try {
      console.log('Starting Claude conversation fetch...');

      /* Get organization ID */
      const orgId = getCurrentOrgId();
      if (!orgId) {
        alert('Could not find organization ID. Make sure you are logged into Claude.');
        return;
      }
      console.log(`Organization ID: ${orgId}`);

      /* Calculate cutoff date */
      const cutoffDate = getCutoffDate(DAYS_TO_FETCH);

      /* Fetch conversations */
      const conversations = await fetchAllConversations(orgId, cutoffDate);
      console.log(`Total conversations fetched: ${conversations.length}`);

      if (conversations.length === 0) {
        alert(`No conversations found in the last ${DAYS_TO_FETCH} days.`);
        return;
      }

      /* Group by project */
      const grouped = groupByProject(conversations);

      /* Format as markdown */
      const markdown = formatAsMarkdown(grouped, DAYS_TO_FETCH);

      /* Display results */
      displayResults(markdown);

    } catch (error) {
      console.error('Fatal error:', error);
      alert(`Fatal error: ${error.message}`);
    }
  };

  /* Run */
  main();
})();
