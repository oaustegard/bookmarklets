/**
 * Extract Claude.ai Organization ID via the Bootstrap API
 *
 * Fetches the org ID from Claude's /api/bootstrap endpoint,
 * which returns account membership data including the organization UUID.
 *
 * Usage:
 *   const orgId = await getOrgId();
 *   if (!orgId) {
 *     alert('Could not determine organization ID');
 *     return;
 *   }
 *   const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations`;
 *
 * Returns:
 *   {Promise<string|null>} - The organization UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) or null if not found
 *
 * Dependencies:
 *   - Requires user to be logged in (uses credentials: 'include')
 *
 * Notes:
 *   - Only works on claude.ai domain
 *   - Must be called with await (async function)
 *   - For multi-org accounts, returns the first membership's org UUID
 */

const getOrgId = async () => {
  try {
    const resp = await fetch('https://claude.ai/api/bootstrap', {
      headers: {
        'accept': '*/*',
        'content-type': 'application/json',
        'anthropic-client-platform': 'web_claude_ai'
      },
      credentials: 'include'
    });
    const d = await resp.json();
    return d?.account?.memberships?.[0]?.organization?.uuid ?? null;
  } catch (e) {
    console.error('Error fetching org ID:', e.message);
    return null;
  }
};
