# Claude Conversation Pruner

A sophisticated tool for managing and pruning Claude.ai conversations, preserving selected messages and artifacts for continuation in new chats.

## Overview

The Claude Conversation Pruner helps users handle Claude.ai's context window limitations by enabling selective export of conversation elements. This tool consists of three components working together to overcome browser security restrictions while maintaining privacy:

1. **[Bookmarklet** (`claude_pruner.js`)](https://github.com/oaustegard/bookmarklets/blob/main/claude_pruner.js) - Runs in the Claude.ai context
2. **[Static Pruner Interface** (`claude-pruner.html`)](https://github.com/oaustegard/oaustegard.github.io/blob/main/claude-pruner.html) - Hosted separately
3. **Cross-Origin Communication** - Uses secure `postMessage` API

## Why This Architecture?

Due to browser security (Same-Origin Policy), websites can't directly access data from other domains. This system works around these restrictions:

1. The bookmarklet runs within claude.ai's domain, allowing API access
2. It opens a separate window with the pruner interface
3. Data is securely transferred via `postMessage`
4. All processing happens client-side for privacy

## Features

- **Selective Export**: Choose specific messages and artifacts to preserve
- **Message Organization**: Messages and artifacts displayed in separate columns
- **Bulk Controls**: Toggle buttons for different message types
- **Real-time Statistics**: Word and token count estimates
- **Export Options**: Copy to clipboard or download as a file
- **Privacy-First**: All processing happens in your browser
- **No Server Required**: Works entirely client-side

## Security Model

### Data Privacy
- No data is sent to any external server
- All processing happens locally in your browser
- The static pruner interface is a simple HTML file with embedded JavaScript
- The bookmarklet only communicates with the pruner interface using secure messaging

### Cross-Origin Communication
- Uses the `postMessage` API with origin verification
- Data transmission restricted to specific domains
- Prevents unauthorized access to conversation data

## Installation

### Easy Install
1. Visit [Claude Pruner Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_pruner.js)
2. Drag the created bookmarklet to your bookmarks bar

### Manual Install
1. Create a new bookmark
2. Set the name to "Claude Pruner"
3. Set the URL to [the bookmarklet code (see repository)](https://github.com/oaustegard/bookmarklets/blob/main/claude_pruner.js)

## Usage

1. **Open Claude.ai**: Navigate to the conversation you want to prune
2. **Click Bookmarklet**: This extracts conversation data and opens the pruner
3. **Select Content**: Click messages and artifacts to toggle selection
4. **Use Controls**: 
   - Toggle All: Select/deselect everything
   - Toggle Human/Assistant: Filter by sender
   - Toggle Artifacts: Select/deselect all artifacts
5. **Export**: Use Copy or Download to get your pruned conversation
6. **Start New Chat**: Paste the pruned content as context

## System Components

### 1. Bookmarklet (`claude_pruner.js`)
Responsibilities:
- Verify it's running on claude.ai
- Extract organization and conversation IDs from the URL
- Fetch conversation data via Claude's API
- Open the pruner interface in a new window
- Send data using secure messaging

### 2. Pruner Interface (`claude-pruner.html`)
Features:
- Two-column layout (messages and artifacts)
- Interactive selection interface
- Real-time word/token counting
- Export functionality
- Handles message formatting and chronological ordering

### 3. Security Measures
Implementations:
- Origin checking for messages
- No external dependencies
- Client-side only processing
- Secure cross-domain communication

## Technical Details

### API Endpoint
The bookmarklet accesses Claude's conversation API:
```
/api/organizations/{orgId}/chat_conversations/{conversationId}?tree=True&rendering_mode=messages&render_all_tools=false
```

### Message Format
Selected content is formatted with proper tags:
```
<Human>Message content</Human>
<Assistant>Response content</Assistant>
<Artifact title="Title">Code content</Artifact>
```

### Cross-Origin Workaround
1. Bookmarklet runs in Claude's domain (has API access)
2. Opens pruner in separate domain (where we control the code)
3. Uses `postMessage` to securely transfer data between domains
4. Pruner verifies message origin for security

## Self-Hosting Options

### Host Your Own Pruner
1. Download `[claude-pruner.html](https://github.com/oaustegard/oaustegard.github.io/blob/main/claude-pruner.html)` from the repository
2. Host it on your domain
3. Modify the bookmarklet's `PRUNER_DOMAIN` constant
4. Update your bookmarklet to point to your hosted version

### Two-Step Alternative
For maximum transparency, use these separate bookmarklets:
1. Use [Export Conversation](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_conversation_tree_json.js) to open a new window with the conversation as JSON
2. From that window run [Process JSON](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_prune_json.js)

## Contributing

Contributions welcome! The project consists of:
- `[https://github.com/oaustegard/bookmarklets/blob/main/claude_pruner.js](claude_pruner.js)` - The bookmarklet
- `[claude-pruner.html](https://github.com/oaustegard/oaustegard.github.io/blob/main/claude-pruner.html)` - The pruner interface
- Supporting documentation

## Security Considerations

- The bookmarklet requires access to your Claude.ai cookies
- Data never leaves your browser
- Cross-origin communication is secured by `postMessage` origin checking
- The pruner interface is static and has no server-side components

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com) with Claude 3.7 Sonnet

## Troubleshooting

### Common Issues
1. **Bookmarklet doesn't work**: Ensure you're on claude.ai
2. **No data appears**: Check browser console for errors
3. **Export issues**: Try the alternative two-step method

### Browser Compatibility
- Used by author and confirmed to work well in Chrome and Edge, YMMV in Firefox and Safari
- Requires JavaScript enabled
- Must allow pop-ups from claude.ai

## Future Enhancements

Potential improvements:
- Export to different formats (JSON, Markdown)
- Advanced filtering options
- Token count optimization
- Conversation summarization

## Acknowledgments

Thanks to the Claude.ai team for their excellent platform and API.


