# get-claude-organization-id

A JavaScript snippet to extract the active organization ID from Claude.ai via its Bootstrap API.

## Purpose

This script is a developer utility designed to retrieve the current user's active organization ID from `claude.ai`. This ID is necessary for making direct API calls to Claude's backend services from the browser console or other bookmarklets.

## Usage

This snippet defines an async function `getOrgId()`.

**Function Signature:**

`async getOrgId() → Promise<string|null>`

**Example:**

```javascript
// Must be used within an async context
const orgId = await getOrgId();

if (orgId) {
  console.log('Found Organization ID:', orgId);
  const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations`;
  // Now you can use the apiUrl for other operations.
} else {
  console.error('Could not determine organization ID.');
}
```

## How it Works

The script calls the `/api/bootstrap` endpoint on `claude.ai` (with credentials included) and extracts the organization UUID from the response at `account.memberships[0].organization.uuid`. This replaced the previous approach of parsing `lastActiveOrg` from inline `<script>` tags, which stopped working when Claude.ai changed its page rendering.

## Returns

-   **{string}**: The organization UUID (e.g., `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) if found.
-   **{null}**: If the organization ID cannot be found, which may happen if the user is not logged in or if the API response structure changes.

## Migration Notes

The previous synchronous `getCurrentOrgId()` function has been replaced by the async `getOrgId()`. Bookmarklets using the old function need to:
1. Wrap their IIFE in `async`: `(async function() { ... })()`
2. Replace `getCurrentOrgId()` calls with `await getOrgId()`
