javascript: (async function() {
  /* @title: Export Conversation as JSON */
  /* @description: Extract and open the current Claude conversation tree as JSON for analysis or backup */
  /* @domains: claude.ai */

  /* Get Organization ID via Bootstrap API */
  const getOrgId = async () => {
    try {
      const resp = await fetch('https://claude.ai/api/bootstrap', {
        headers: { 'accept': '*/*', 'content-type': 'application/json', 'anthropic-client-platform': 'web_claude_ai' },
        credentials: 'include'
      });
      const d = await resp.json();
      return d?.account?.memberships?.[0]?.organization?.uuid ?? null;
    } catch (e) {
      console.error('Error fetching org ID:', e.message);
      return null;
    }
  };

  /* Get the organization ID */
  const orgId = await getOrgId();

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
