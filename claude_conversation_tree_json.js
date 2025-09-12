javascript: (function() {
  /* Capture the current Claude conversation tree as JSON */

  /* Get Organization ID */
  const getCurrentOrgId = () => {
    // Method 1: Extract from lastActiveOrg preference (escaped JSON)
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
    alert('Could not find organization ID. The bookmarklet may need to be updated.');
    return;
  }

  /* Get the conversation ID from the current URL */
  const conversationId = window.location.pathname.split('/').pop(); 
  /* Construct the API URL */
  const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=True`;
  window.open(apiUrl, '_blank');
})();
