/**
 * Extract Claude.ai Organization ID from page context
 *
 * Claude.ai stores the active organization ID in escaped JSON within inline scripts.
 * This function extracts it from the lastActiveOrg preference.
 *
 * Usage:
 *   const orgId = getCurrentOrgId();
 *   if (!orgId) {
 *     alert('Could not determine organization ID');
 *     return;
 *   }
 *   const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations`;
 *
 * Returns:
 *   {string|null} - The organization UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) or null if not found
 *
 * Dependencies:
 *   - None (pure DOM parsing)
 *
 * Notes:
 *   - Only works on claude.ai domain
 *   - Requires user to be logged in
 *   - Looks for escaped JSON in inline scripts: \"lastActiveOrg\",\"value\":\"<uuid>\"
 */

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
