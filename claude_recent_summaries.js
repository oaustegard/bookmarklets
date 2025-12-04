javascript:(function() {
  /* @title: Recent Conversation Summaries */
  /* @description: Generate AI-powered summaries of recently updated Claude conversations */
  /* @domains: claude.ai */
  /* Configuration */
  const RATE_LIMIT_TICK = 200; /* Base delay unit. Set to 1 for instant, 200 for polite */
  const BATCH_DELAY_MULTIPLIER = 1; /* Delay between API requests */
  
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

  /* Extract conversation UUIDs from visible chat links */
  const getVisibleChatIds = () => {
    const chatLinks = document.querySelectorAll('a[href^="/chat/"]');
    const chatIds = [];
    
    chatLinks.forEach(link => {
      const href = link.getAttribute('href');
      const match = href.match(/\/chat\/([a-f0-9-]{36})/);
      if (match) {
        chatIds.push({
          uuid: match[1],
          element: link.closest('.group')
        });
      }
    });
    
    return chatIds;
  };

  /* Check if a chat already has a summary displayed */
  const hasSummaryDisplayed = (chatElement) => {
    return chatElement.querySelector('.injected-summary') !== null;
  };

  /* Fetch conversations in batches (they already include summaries) */
  const fetchConversationsWithSummaries = async (orgId, visibleCount, statusCallback) => {
    const allConversations = [];
    let offset = 0;
    const batchSize = 30; /* Match the page's default limit */
    const maxToFetch = Math.ceil(visibleCount / batchSize) * batchSize; /* Fetch enough batches to cover visible items */

    console.log(`Need to fetch ${maxToFetch} conversations to cover ${visibleCount} visible chats`);

    while (offset < maxToFetch) {
      try {
        const url = `https://claude.ai/api/organizations/${orgId}/chat_conversations?limit=${batchSize}&offset=${offset}`;
        
        if (statusCallback) {
          statusCallback(`Fetching batch at offset ${offset}...`);
        }
        
        console.log(`Fetching: ${url}`);
        
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
        console.log(`Received ${batch.length} conversations in batch`);
        
        if (batch.length === 0) {
          break;
        }

        allConversations.push(...batch);

        /* Check if we got a full batch */
        if (batch.length < batchSize) {
          break;
        }

        offset += batchSize;

      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
    }

    console.log(`Total fetched: ${allConversations.length} conversations`);
    return allConversations;
  };

  /* Simple markdown to HTML converter for summaries */
  const markdownToHtml = (markdown) => {
    let html = markdown;
    
    /* Bold: **text** only (not single asterisks or underscores) */
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    /* Line breaks: convert to <br> tags */
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  /* Inject summary into the chat element */
  const injectSummary = (chatElement, summary) => {
    console.log('Attempting to inject summary:', summary.substring(0, 50) + '...');
    
    /* Find the w-full container that holds the conversation info */
    const contentContainer = chatElement.querySelector('.w-full');
    if (!contentContainer) {
      console.error('Could not find .w-full container', chatElement);
      return false;
    }

    /* Find the parent card to ensure proper height */
    const cardContainer = chatElement.querySelector('.rounded-xl.bg-gradient-to-b');
    if (cardContainer) {
      /* Remove any height constraints */
      cardContainer.style.minHeight = 'auto';
      cardContainer.style.height = 'auto';
    }

    /* Convert markdown to HTML */
    const htmlSummary = markdownToHtml(summary);

    /* Create summary element */
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'injected-summary text-text-400 font-small mt-2 mr-8';
    summaryDiv.style.cssText = `
      line-height: 1.5;
      word-wrap: break-word;
      white-space: normal;
      padding-right: 2rem;
    `;
    summaryDiv.innerHTML = htmlSummary;

    /* Append to the content container */
    contentContainer.appendChild(summaryDiv);
    console.log('Successfully injected summary');
    return true;
  };

  /* Create status indicator */
  const createStatusIndicator = () => {
    const indicator = document.createElement('div');
    indicator.id = 'summary-injector-status';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      min-width: 200px;
    `;
    document.body.appendChild(indicator);
    return indicator;
  };

  const updateStatus = (indicator, message) => {
    if (indicator) {
      indicator.textContent = message;
    }
  };

  const removeStatus = (indicator) => {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  };

  /* Main execution */
  const main = async () => {
    const statusIndicator = createStatusIndicator();
    
    try {
      updateStatus(statusIndicator, 'Initializing...');
      
      /* Get organization ID */
      const orgId = getCurrentOrgId();
      if (!orgId) {
        removeStatus(statusIndicator);
        alert('Could not find organization ID. Make sure you are logged into Claude.');
        return;
      }

      /* Get visible chat IDs */
      const chats = getVisibleChatIds();
      console.log(`Found ${chats.length} visible chats`);
      
      /* Filter chats that don't already have summaries */
      const chatsNeedingSummaries = chats.filter(chat => !hasSummaryDisplayed(chat.element));
      
      if (chatsNeedingSummaries.length === 0) {
        updateStatus(statusIndicator, 'All summaries already displayed!');
        setTimeout(() => removeStatus(statusIndicator), 2000);
        return;
      }

      console.log(`Need to inject summaries for ${chatsNeedingSummaries.length} chats`);

      /* Fetch conversations in batches (already includes summaries) */
      updateStatus(statusIndicator, 'Fetching conversation data...');
      const conversations = await fetchConversationsWithSummaries(
        orgId,
        chatsNeedingSummaries.length,
        (msg) => updateStatus(statusIndicator, msg)
      );

      console.log(`Fetched ${conversations.length} conversations total`);

      /* Create a map of UUID to conversation data */
      const conversationMap = {};
      conversations.forEach(conv => {
        conversationMap[conv.uuid] = conv;
      });

      console.log(`Created map with ${Object.keys(conversationMap).length} entries`);

      /* Inject summaries for visible chats */
      updateStatus(statusIndicator, 'Injecting summaries...');
      let injected = 0;
      let failed = 0;
      
      for (const chat of chatsNeedingSummaries) {
        const conversation = conversationMap[chat.uuid];
        
        if (conversation && conversation.summary) {
          const success = injectSummary(chat.element, conversation.summary);
          if (success) {
            injected++;
          } else {
            failed++;
          }
        } else if (conversation) {
          console.log(`No summary available for chat ${chat.uuid}`);
        } else {
          console.log(`Conversation ${chat.uuid} not found in fetched data`);
        }
      }

      console.log(`Injection complete: ${injected} succeeded, ${failed} failed`);
      updateStatus(statusIndicator, `Complete! Injected ${injected} summaries.`);
      setTimeout(() => removeStatus(statusIndicator), 3000);

    } catch (error) {
      console.error('Fatal error:', error);
      removeStatus(statusIndicator);
      alert(`Error: ${error.message}`);
    }
  };

  /* Run */
  main();
})();
