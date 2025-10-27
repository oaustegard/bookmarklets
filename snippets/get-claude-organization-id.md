# get-claude-organization-id

A JavaScript snippet to extract the active organization ID from the Claude.ai web interface.

## Purpose

This script is a developer utility designed to retrieve the current user's active organization ID from the DOM on `claude.ai`. This ID is necessary for making direct API calls to Claude's backend services from the browser console or other bookmarklets.

## Usage

This snippet defines a function `getCurrentOrgId()` in the global scope.

**Function Signature:**

`getCurrentOrgId()`

**Example:**

```javascript
// Ensure this snippet's code has been loaded.
const orgId = getCurrentOrgId();

if (orgId) {
  console.log('Found Organization ID:', orgId);
  const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations`;
  // Now you can use the apiUrl for other operations.
} else {
  console.error('Could not determine organization ID.');
}
```

## How it Works

The script searches through the inline `<script>` tags on the `claude.ai` page for a specific JSON key-value pair (`"lastActiveOrg"`) where the organization ID is stored. It uses a regular expression to parse this value from the script's text content.

## Returns

-   **{string}**: The organization UUID (e.g., `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) if found.
-   **{null}**: If the organization ID cannot be found, which may happen if the user is not logged in or if Claude.ai changes its internal page structure.
