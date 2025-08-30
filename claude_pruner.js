javascript:(function() {
    /* Configuration */
    const PRUNER_DOMAIN = 'austegard.com';
    const PRUNER_URL = `https://${PRUNER_DOMAIN}/ai-tools/claude-pruner.html`;
    
    /* Logging utility */
    function log(message) {
        console.log(`[Claude Pruner] ${message}`);
    }
    
    function logError(message) {
        console.error(`[Claude Pruner Error] ${message}`);
    }

    /* Check if we're on a Claude page */
    if (!window.location.hostname.includes('claude.ai')) {
        alert('This bookmarklet only works on claude.ai pages');
        return;
    }

    /* Get organization and conversation IDs */
    const orgId = localStorage.getItem('lastActiveOrg');
    const conversationId = window.location.pathname.split('/').pop();
    
    log(`Organization ID: ${orgId}`);
    log(`Conversation ID: ${conversationId}`);

    /* Constants */
    const API_URL = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=true`;
    
    log(`API URL: ${API_URL}`);

    /* Open pruner in new window */
    const prunerWindow = window.open(PRUNER_URL, '_blank');
    
    if (!prunerWindow) {
        log('Failed to open pruner window');
        alert('Failed to open pruner window. Please check your popup blocker settings.');
        return;
    }
    
    log('Pruner window opened');
    
    /* Fetch conversation data */
    log('Fetching conversation data...');
    fetch(API_URL, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'anthropic-client-platform': 'web_claude_ai'
        },
        credentials: 'include'
    })
    .then(response => {
        log(`Response status: ${response.status}`);
        if (!response.ok) {
            logError('API response not OK');
            console.log(response);
        }
        return response.json();
    })
    .then(data => {
        log('Data received');
        if (data.chat_messages) {
            log(`Message count: ${data.chat_messages.length}`);
        } else {
            logError('No chat_messages found in data');
            console.log(Object.keys(data));
        }
        
        /* Give the pruner window time to load */
        log('Waiting for pruner window to load...');
        setTimeout(() => {
            try {
                log('Sending data to pruner window');
                prunerWindow.postMessage({
                    type: 'claude-conversation',
                    data: data
                }, `https://${PRUNER_DOMAIN}`);
                log('Data sent to pruner window');
            } catch (error) {
                logError(`Error sending data: ${error.message}`);
                console.error(error);
            }
        }, 1000);
    })
    .catch(error => {
        logError(`Fetch error: ${error.message}`);
        console.error(error);
        alert(`Error fetching conversation: ${error.message}`);
    });
})();
