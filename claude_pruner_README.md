# Claude Conversation Pruner

A bookmarklet tool to help manage Claude.ai conversations by selecting specific messages and artifacts for continuation in new chats.

## Purpose

When having long conversations with Claude.ai, you may hit the context window limit. This tool helps you:
1. Export the current conversation
2. Select specific messages and artifacts you want to keep
3. Copy or download the selected content
4. Use the pruned conversation as context for a new chat

## Features
- Select/deselect individual messages and artifacts
- Bulk selection controls
- Word and token count estimation
- Maintains chronological order
- Preserves formatting and structure
- Handles code artifacts separately from conversation text
  
## Installation

### Easy Install
Visit [austegard.com/bookmarklet-installer.html?bookmarklet=claude_pruner.js](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_pruner.js) and drag the bookmarklet to your bookmarks bar.

### Manual Install
1. Visit the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html)
2. Select "Claude Pruner" from the dropdown menu
3. Drag the created bookmarklet to your bookmarks bar

## Usage

1. While in a Claude.ai conversation, click the bookmarklet
2. A new tab will open with the Pruner interface
3. Select/deselect messages and artifacts by clicking on them
4. Use the toggle buttons to quickly select/deselect all items, human messages, assistant messages, or artifacts
5. Click "Copy" or "Download" to export your selection
6. Start a new Claude conversation and paste the pruned content as context

## Privacy & Security

The pruner runs entirely in your browser - no data is sent to any server. It works by:
1. Fetching the conversation data directly from Claude.ai's API
2. Opening the pruner interface in a new window
3. Using the `postMessage` API to securely transfer the data between windows
4. Processing everything locally in your browser

## Self-Hosting Options

### Option 1: Host the Pruner HTML
1. The pruner source code is available at [GitHub](https://github.com/oaustegard/oaustegard.github.io/blob/main/claude-pruner.html)
2. Host it on your domain
3. Modify the bookmarklet to point to your hosted version

### Option 2: Two-Step Bookmarklet Approach
Alternative bookmarklets are available for a two-step process:
1. [claude_conversation_tree_json.js](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_conversation_tree_json.js) - From Claude.ai: Exports the conversation
2. [claude_prune_json.js](https://austegard.com/bookmarklet-installer.html?bookmarklet=claude_prune_json.js) - From the opened window: Processes the exported JSON


## License
Licensed under the MIT License - see [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)
