# /document - Generate Bookmarklet README

Generate or improve a README file for an existing bookmarklet, following the project's documentation standards.

## Task
Analyze the provided bookmarklet JavaScript code and create a comprehensive README following this exact structure:

### Required Sections

1. **Title**: Clear, descriptive name
2. **Purpose**: 2-3 sentence explanation of what problem it solves
3. **Features**: Bullet list of key capabilities
4. **Installation**: 
   - Easy Install section with link to https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=[filename].js
   - Manual Install section with step-by-step instructions
5. **Usage**: Numbered steps for using the bookmarklet
6. **How It Works**: Technical explanation of the implementation
7. **Technical Notes**: Browser compatibility, site-specific issues, limitations
8. **License**: MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)
9. **Author**: Created by [Oskar Austegard](https://austegard.com)

### Style Guidelines
- Use clear, concise language
- Include code examples where helpful
- Explain technical concepts for non-developers
- Note any external dependencies
- Highlight security/privacy considerations
- Link to related bookmarklets if relevant

### Example Installation Section
```markdown
## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=example.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "Example Bookmarklet".
3. Set the URL to the JavaScript code found in [`example.js`](https://github.com/oaustegard/bookmarklets/blob/main/example.js).
4. Save the bookmark.
```

## Output Format
Generate the complete README in markdown format, ready to save as `[filename]_README.md`
