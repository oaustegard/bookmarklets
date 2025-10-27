# Bookmarklets Repository

## Project Overview
Collection of JavaScript bookmarklets for enhancing browser functionality. Each bookmarklet is a self-contained JavaScript snippet that runs in the browser context to add features, extract data, or modify web pages.

## Agent Commands
This repository contains commands specifically for AI agents, located in the `.claude/commands/` directory. These commands provide structured guidance for common development tasks, ensuring consistency with project standards.

- **`/bookmarklet`**: Use this command to create a new bookmarklet. It outlines the required structure for both the JavaScript file and its corresponding README, ensuring all project conventions are met from the start.
- **`/document`**: Use this command to generate or improve the README file for an existing bookmarklet. It provides a template and checklist to ensure the documentation is comprehensive and follows the project's standards.

## Commands

### Development
- Test: Load bookmarklet in browser and test on target sites
- Create bookmark: Add `javascript:` prefix and paste code as bookmark URL
- Debug: Use browser dev tools console (bookmarklets log extensively)
- Install: Use [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=FILENAME.js)
  - Replace `FILENAME.js` with actual bookmarklet filename in URL

### JavaScript Execution
- No build step required - bookmarklets run directly in browser
- No minification needed - browser handles compression
- Test by creating browser bookmark with `javascript:` prefix
- Use browser dev tools console for debugging

## Code Style

### Language
- JavaScript (ES6+)
- Python 3.x for automation scripts

### Bookmarklet Pattern
```javascript
javascript:(function(){
    /* Bookmarklet code here */
    /* Always use IIFE pattern */
    /* Avoid inline event handlers (CSP issues) */
})();
```

### JavaScript Conventions
- Use IIFE (Immediately Invoked Function Expression) pattern
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Modern DOM APIs: `querySelector`, `addEventListener`
- Async/await for API calls

### Naming
- Files: lowercase with underscores (e.g., `bsky_advanced_search.js`)
- READMEs: match JS file with `_README.md` suffix
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS classes: kebab-case with prefix (e.g., `bsky-modal`)

### Error Handling
- Always wrap bookmarklet code in try-catch for critical operations
- Provide user feedback via `alert()` or custom UI
- Console.log debugging info (users can check dev tools)
- Validate DOM elements exist before manipulation

### CSP Compliance
- Never use inline event handlers (`onclick="..."`)
- Use `addEventListener()` instead
- Avoid `eval()` and inline scripts
- Create style elements, don't use inline styles where possible

## Project Structure

### Core Files
- `*.js` - Bookmarklet JavaScript files
- `*_README.md` - Documentation for each bookmarklet
- `CONTENT_SUMMARY.md` - Master index of all bookmarklets
- `README.md` - Repository landing page

### Archived Files
- `generate_md_files.py` - No longer used (archive/delete)
- `github_folder_summary.py` - No longer used (archive/delete)

### Utilities
- Bookmarklet Installer: https://austegard.com/web-utilities/bookmarklet-installer.html
  - Use with `?bookmarklet=FILENAME.js` parameter to preload specific bookmarklet

## Dependencies

### JavaScript (Runtime)
- Browser APIs only (no npm packages)
- External libraries loaded dynamically when needed:
  - Turndown.js (HTML to Markdown conversion)
  - Prism.js (syntax highlighting)
  - Pico.css (minimal styling)
  - marked.js (Markdown parsing)
  - highlight.js (code highlighting)

## Testing Approach

### Manual Testing
1. Create browser bookmark with bookmarklet code
2. Navigate to target website
3. Click bookmark to execute
4. Verify functionality in browser dev tools
5. Test edge cases (empty pages, different URL formats, etc.)

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Test on actual target websites (Bitbucket, Jira, Strava, BlueSky, etc.)
- Verify CSP compliance on strict sites

### Common Test Cases
- Page not loaded/wrong site
- Missing DOM elements
- Network errors for API calls
- Large datasets (performance)
- Mobile browser compatibility

## Development Workflow

### Creating New Bookmarklets
1. Write JavaScript in standalone `.js` file
2. Test thoroughly on target site(s)
3. Document with README following project template
4. Update `CONTENT_SUMMARY.md`
5. Commit with descriptive message
6. Add to Bookmarklet Installer with QSP link:
   - `https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=FILENAME.js`

### README Structure
Each README should include:
- **Purpose**: What problem does it solve?
- **Features**: Bullet list of capabilities
- **Installation**: Easy install link + manual steps
  - Easy Install: Link to installer with `?bookmarklet=FILENAME.js` parameter
  - Manual Install: Step-by-step bookmark creation
- **Usage**: Step-by-step instructions
- **How It Works**: Technical explanation
- **Technical Notes**: Browser/site-specific issues
- **License**: MIT
- **Author**: Link to austegard.com

### Git Workflow
- Direct commits to main branch
- Descriptive commit messages
- Keep `.gitignore` updated for IDE files

## API Integration Patterns

### Fetch Requests
```javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch data: ' + error.message);
    }
}
```

### Clipboard Operations
```javascript
async function copyToClipboard(html, text) {
    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            })
        ]);
    } catch (err) {
        /* Fallback for older browsers */
        const listener = (e) => {
            e.clipboardData.setData('text/html', html);
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
    }
}
```

### Modal/Dialog Pattern
```javascript
/* Create overlay and modal */
const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';

const modal = document.createElement('div');
modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:10000;';

/* Close handlers */
overlay.addEventListener('click', () => { overlay.remove(); modal.remove(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { overlay.remove(); modal.remove(); }
});
```

## Site-Specific Notes

### BlueSky (bsky.app)
- Uses AT Protocol API at `bsky.social/xrpc/`
- Need to resolve handles to DIDs: `com.atproto.identity.resolveHandle`
- Public API available without auth for some endpoints
- App passwords required for posting (stored in localStorage)

### Bitbucket
- DataCenter/Server version has different DOM from Cloud
- CodeMirror editor for file viewing
- Project/repo URLs: `/projects/{project}/repos/{repo}/`

### Jira
- DataCenter version uses specific DOM selectors
- Permissions page: `jira-permissions-table` element
- REST API available but requires auth

### Strava
- Global `strava.activity_object` JavaScript object available
- Segment data in tables with specific classes
- GPX export URLs follow pattern

### Confluence
- Atlassian Connect framework
- Content in specific macro containers
- Attachment tables have `.tableview.attachments` class

## Common Patterns

**IMPORTANT FOR AI AGENTS**: Check the `snippets/` folder for reusable code patterns before writing new implementations. The snippets folder contains:
- Site-specific utilities (authentication, API patterns)
- DOM manipulation helpers
- CSP/CORS workarounds
- UI patterns (modals, overlays)
- Common helper functions

Browse `snippets/README.md` for the complete catalog and usage examples.

### Basic Patterns (Always Use These)

#### URL Pattern Detection
```javascript
if (!window.location.hostname.includes('expected-site.com')) {
    alert('This bookmarklet only works on expected-site.com');
    return;
}
```

#### Safe DOM Element Selection
```javascript
const element = document.querySelector('.target-class');
if (!element) {
    console.error('Required element not found');
    return;
}
```

#### Loading External Libraries
```javascript
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

await loadScript('https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.min.js');
```

## CSP/CORS Workaround Pattern

### Problem
Many sites have strict Content Security Policy (CSP) or Cross-Origin Resource Sharing (CORS) restrictions that prevent bookmarklets from:
- Fetching data from APIs
- Creating certain UI elements
- Processing large amounts of data
- Using certain browser features

### Solution: Hosted Page Communication
Use `window.postMessage()` to communicate with a hosted page that handles the restricted operations.

**Example: claude_pruner.js Pattern**

```javascript
javascript:(function() {
    const PRUNER_DOMAIN = 'austegard.com';
    const PRUNER_URL = `https://${PRUNER_DOMAIN}/ai-tools/claude-pruner.html`;
    
    /* 1. Extract data from current page */
    const orgId = getCurrentOrgId();
    const conversationId = window.location.pathname.split('/').pop();
    const API_URL = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}`;
    
    /* 2. Open hosted page in new window */
    const prunerWindow = window.open(PRUNER_URL, '_blank');
    
    /* 3. Fetch data (still has access to cookies) */
    fetch(API_URL, {
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        /* 4. Send data to hosted page via postMessage */
        setTimeout(() => {
            prunerWindow.postMessage({
                type: 'claude-conversation',
                data: data
            }, `https://${PRUNER_DOMAIN}`);
        }, 1000); /* Wait for hosted page to load */
    });
})();
```

**Hosted Page (claude-pruner.html):**
```javascript
/* Listen for data from bookmarklet */
window.addEventListener('message', (event) => {
    /* Verify origin */
    if (event.origin !== window.location.origin) {
        return;
    }
    
    if (event.data.type === 'claude-conversation') {
        /* Process the data with full DOM/API access */
        const data = event.data.data;
        processConversation(data);
    }
});
```

### When to Use This Pattern
- **API calls blocked by CORS**: Fetch data in bookmarklet context (has cookies), send to hosted page
- **Complex UI needed**: Hosted page has full control over styling and layout
- **Large data processing**: Offload processing to hosted page to avoid blocking main site
- **File downloads**: Generate and download files from hosted page
- **Advanced features**: Use features that might be blocked by CSP

### Benefits
1. **Cookie Access**: Bookmarklet runs in original page context, has access to auth cookies
2. **No CSP Restrictions**: Hosted page is on your domain with permissive CSP
3. **Better UX**: Full control over UI on hosted page
4. **Maintainability**: Can update hosted page without republishing bookmarklet
5. **Debugging**: Easier to debug on your own domain

### Implementation Checklist
- [ ] Bookmarklet extracts necessary data from current page
- [ ] Bookmarklet opens hosted page with `window.open()`
- [ ] Hosted page sets up `message` event listener
- [ ] Bookmarklet sends data via `postMessage()` after delay
- [ ] Hosted page validates message origin
- [ ] Hosted page processes data and provides UI
- [ ] Both pages log extensively for debugging

### Security Considerations
- Always validate `event.origin` in message listener
- Use specific message types to avoid confusion
- Don't send sensitive data if hosted page is not HTTPS
- Consider origin allowlist if multiple domains might send messages

## Troubleshooting

### Common Issues

1. **CSP/CORS Violations** ⚠️ MOST COMMON ISSUE
   - **Symptoms**: Fetch fails, inline handlers blocked, external resources blocked
   - **Solutions**:
     - Use `addEventListener`, not inline handlers
     - Use hosted page communication pattern (see CSP/CORS Workaround Pattern section)
     - Inject styles as `<style>` elements, not inline
     - Avoid `eval()` and inline scripts
   - **Example**: See `claude_pruner.js` for complete workaround implementation

2. **Missing Elements**: Always check if `querySelector` returns null

3. **Async Issues**: Use `await` for all fetch calls

4. **Scope Issues**: Use IIFE to avoid polluting global namespace

5. **Mobile Issues**: Test touch events, viewport considerations

### Debugging Tips
- Use `console.log()` liberally (visible in dev tools)
- Create `_lg` or `_c` global aliases for console access
- Test in private/incognito mode to avoid extension conflicts
- Check Network tab for failed API calls
- Inspect element to verify DOM structure
- Look for CSP violations in Console tab (blocked resource messages)

## Documentation Standards

### README Template
See existing files for reference. Key sections:
1. Title with clear name
2. Purpose (2-3 sentences)
3. Features (bullet list)
4. Installation (Easy Install link + manual)
5. Usage (numbered steps)
6. How It Works (technical details)
7. Technical Notes (limitations, compatibility)
8. License
9. Author with link

### Code Comments
- Explain WHY, not WHAT
- Document complex regex patterns
- Note browser-specific workarounds
- Reference related issues or discussions

## Security Considerations

### User Data
- Never send user data to external servers without consent
- Use localStorage cautiously (XSS risk)
- Clear sensitive data when no longer needed
- Validate all user inputs

### API Keys
- Never hardcode API keys in bookmarklets
- Prompt users for credentials when needed
- Use app passwords, not main passwords
- Store encrypted if possible

## Performance

### Best Practices
- Minimize DOM queries (cache selectors)
- Debounce/throttle event handlers
- Use event delegation for dynamic content
- Remove event listeners when cleaning up
- Avoid synchronous operations that block UI

### Optimization
- Lazy load external libraries
- Use `textContent` instead of `innerHTML` when possible
- Batch DOM updates
- Profile with browser dev tools

## Author Information
- GitHub: oaustegard
- Website: austegard.com
- Bluesky: austegard.com
- License: MIT
