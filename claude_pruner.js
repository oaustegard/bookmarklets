javascript:(function() {
    /* Configuration */
    const PRUNER_DOMAIN = 'austegard.com';
    const PRUNER_URL = `https://${PRUNER_DOMAIN}/claude-pruner.html`;

    /* Check if we're on a Claude page */
    if (!window.location.hostname.includes('claude.ai')) {
        alert('This bookmarklet only works on claude.ai pages');
        return;
    }

    /* Constants */
    const API_URL = `https://claude.ai/api/organizations/${
        localStorage.getItem('lastActiveOrg')
    }/chat_conversations/${
        window.location.pathname.split('/').pop()
    }?tree=True&rendering_mode=messages&render_all_tools=true`;

    /* Open pruner in new window */
    const prunerWindow = window.open(PRUNER_URL, '_blank');
    
    /* Fetch conversation data */
    fetch(API_URL, {
        headers: {
            'accept': '*/*',
            'content-type': 'application/json',
            'anthropic-client-platform': 'web_claude_ai'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        /* Give the pruner window time to load */
        setTimeout(() => {
            prunerWindow.postMessage({
                type: 'claude-conversation',
                data: data
            }, `https://${PRUNER_DOMAIN}`);
        }, 1000);
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
})();
