# Reusable Bookmarklet Snippets

This folder contains reusable code patterns for bookmarklet development. Each snippet is a self-contained, copy-paste-ready function or pattern.

## Usage for AI Agents

When creating or modifying bookmarklets:
1. **Check this folder first** before implementing common functionality
2. Copy the relevant snippet and adapt to your use case
3. **Add new snippets** when you create reusable patterns
4. Keep snippets focused and well-documented

## Snippet Categories

### Authentication & Sessions
- [get-claude-organization-id.js](./get-claude-organization-id.js) - Extract Claude.ai organization ID from page context

### API Integration
- See [../AGENTS.md](../AGENTS.md#api-integration-patterns) for fetch patterns

### Browser APIs & Utilities
- [copy-html-and-text-to-clipboard.js](./copy-html-and-text-to-clipboard.js) - Copy both HTML and plain text to clipboard using execCommand fallback
- [load-turndown-library-minified.js](./load-turndown-library-minified.js) - Minified Turndown.js v7.12 for HTML-to-Markdown conversion

### Debugging & Console
- [create-console-alias.js](./create-console-alias.js) - Create `_c` alias for console object in bookmarklet context
- [create-console-log-helper.js](./create-console-log-helper.js) - Create `_lg()` helper function for logging from bookmarklets

### DOM Manipulation
- Coming soon

### UI Patterns
- [create-modal-overlay.js](./create-modal-overlay.js) - Create modal dialogs with escape/click-to-close
- Coming soon (loading indicators)

### CSP/CORS Workarounds
- See [../AGENTS.md](../AGENTS.md#cspcors-workaround-pattern) for postMessage pattern

## Adding New Snippets

### Naming Convention
- Use descriptive verb-noun format: `{verb}-{what-it-does}.js`
- Make the purpose obvious without reading the file
- Examples:
  - `get-claude-organization-id.js` (not `claude-org.js`)
  - `create-modal-overlay.js` (not `modal.js`)
  - `fetch-with-retry-and-timeout.js` (not `fetch-retry.js`)

### Snippet Template
```javascript
/**
 * [Brief description]
 *
 * Usage:
 *   [Example usage code]
 *
 * Returns:
 *   [Description of return value]
 *
 * Dependencies:
 *   - [Any required external libraries or browser APIs]
 *
 * Notes:
 *   - [Any important caveats or browser compatibility notes]
 */

// Snippet code here
```

### When to Create a Snippet

Create a snippet when:
- ✅ Pattern is used in 2+ bookmarklets
- ✅ Pattern solves a specific, common problem
- ✅ Pattern is site-specific (Claude, Bitbucket, etc.)
- ✅ Pattern handles complex browser APIs (clipboard, storage, etc.)

Don't create snippets for:
- ❌ One-off implementations
- ❌ Trivial one-liners
- ❌ Highly bookmarklet-specific code

## Snippet Index

| Snippet | Purpose | Used In |
|---------|---------|---------|
| [copy-html-and-text-to-clipboard.js](./copy-html-and-text-to-clipboard.js) | Copy HTML & text to clipboard | Multiple bookmarklets |
| [create-console-alias.js](./create-console-alias.js) | Console alias for debugging | Bookmarklets needing console access |
| [create-console-log-helper.js](./create-console-log-helper.js) | Logging helper for debugging | Bookmarklets needing debug logging |
| [create-modal-overlay.js](./create-modal-overlay.js) | Create dismissible modal | Multiple bookmarklets |
| [get-claude-organization-id.js](./get-claude-organization-id.js) | Get Claude.ai org ID | claude_last_week_conversations.js, claude_recent_summaries.js |
| [load-turndown-library-minified.js](./load-turndown-library-minified.js) | HTML-to-Markdown converter | Bookmarklets converting HTML content |

*This index should be updated when adding new snippets*
