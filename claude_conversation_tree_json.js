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

  /* Detect if this is a shared conversation */
  const pathname = window.location.pathname;
  const isShared = pathname.includes('/share/');

  /* Get the conversation/share ID from the current URL */
  const conversationId = pathname.split('/').pop();

  /* Construct the appropriate API URL */
  const apiUrl = isShared
    ? `https://claude.ai/api/organizations/${orgId}/chat_snapshots/${conversationId}?rendering_mode=messages&render_all_tools=true`
    : `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=True`;

  window.open(apiUrl, '_blank');
})();
