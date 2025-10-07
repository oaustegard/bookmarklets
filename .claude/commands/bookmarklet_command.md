# /bookmarklet - Create New Bookmarklet

Create a new bookmarklet following project conventions and best practices.

## Task
1. Ask for the bookmarklet's purpose and target website(s)
2. Generate a complete, working bookmarklet JavaScript file
3. Follow these requirements:
   - Use IIFE pattern: `javascript:(function(){ ... })()`
   - Include site detection/validation at the start
   - Use CSP-compliant code (no inline handlers)
   - Add proper error handling with user feedback
   - Include console logging for debugging
   - Follow naming conventions (camelCase functions, kebab-case CSS)
   - Add cleanup functions where needed
4. Generate matching README file with:
   - Clear purpose statement
   - Feature list
   - Installation instructions (including Easy Install link)
   - Usage steps
   - "How It Works" technical explanation
   - Browser/site compatibility notes
   - MIT License section
   - Author credit to Oskar Austegard with austegard.com link
5. Suggest appropriate filename (lowercase with underscores)
6. Provide testing instructions for the target site

## Code Standards
- Modern JavaScript (ES6+): const/let, arrow functions, template literals
- Async/await for API calls
- Safe DOM queries (check for null)
- User feedback via modal/alert
- Event listeners, not inline handlers
- Proper cleanup on close/escape

## Example Structure
```javascript
javascript:(function(){
    /* Validate we're on the correct site */
    if (!window.location.hostname.includes('target-site.com')) {
        alert('This bookmarklet only works on target-site.com');
        return;
    }
    
    /* Main functionality */
    try {
        /* Your code here */
    } catch (error) {
        console.error('Bookmarklet error:', error);
        alert('Error: ' + error.message);
    }
})();
```

## Output
1. Complete JavaScript file content
2. Complete README markdown
3. Suggested filename
4. Testing checklist
