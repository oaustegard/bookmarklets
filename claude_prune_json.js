javascript:(function() {
  /* Utility functions */
  function estimateTokens(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.round(words * 1.35);
  }

  function formatTimestamp(isoString) {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function processMessageContent(message) {
    return message.content?.filter(part => part.type === 'text')
      .map(part => part.text)
      .join('') || message.text || '';
  }

  function getConversationPath(data) {
    const messageMap = new Map(data.chat_messages.map(msg => [msg.uuid, msg]));
    const path = [];
    let currentMsg = messageMap.get(data.current_leaf_message_uuid);
    while (currentMsg) {
      path.unshift(currentMsg);
      currentMsg = messageMap.get(currentMsg.parent_message_uuid);
    }
    return path;
  }

  /* Create the UI components */
  function createStyles() {
    return `
      :root {
        font-size: 14px;
      }
      body {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0.5rem;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .action-buttons {
        position: fixed;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        background: #fff;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 1000;
      }
      .controls {
        position: sticky;
        top: 0;
        background: #fff;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid #ddd;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        z-index: 100;
      }
      .message {
        margin: 0.5rem 0;
        padding: 0.5rem;
        border: 1px solid transparent;
        max-height: 500px;
        overflow-y: auto;
        cursor: pointer;
        transition: all 0.2s;
      }
      .message:not(.selected) {
        border: 2px solid #ff4444;
        background: #fff0f0;
      }
      .message.selected {
        border: 2px solid #4CAF50;
        background: #E8F5E9;
      }
      .human { background: #f8f9fa; }
      .assistant { background: #fff; }
      .artifact {
        margin: 0.5rem 0;
        padding: 0.5rem;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .artifact:not(.selected) {
        border: 2px solid #ff4444;
        background: #fff0f0;
      }
      .artifact.selected {
        border: 2px solid #4CAF50;
        background: #E8F5E9;
      }
      pre {
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: #f8f9fa;
        border: 1px solid #e2e8f0;
        border-radius: 0.25rem;
        overflow-x: auto;
        font-size: 0.9rem;
      }
      code {
        font-family: monospace;
        white-space: pre;
      }
      button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.25rem;
        background: #fff;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s;
      }
      button:hover {
        background: #f5f5f5;
        border-color: #bbb;
      }
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .message-header h2 {
        margin: 0;
        font-size: 1rem;
        color: #666;
      }
      .timestamp {
        font-size: 0.8rem;
        color: #666;
      }
    `;
  }

  function formatMessage(message) {
    let processedText = processMessageContent(message);
    
    /* Handle artifacts */
    processedText = processedText.replace(
      /<antArtifact[^>]*identifier="([^"]*)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/antArtifact>/g,
      (match, identifier, title, content) => {
        const cleanContent = content
          .trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        return `<div class="artifact selected" onclick="event.stopPropagation()">
          <div class="message-header">
            <h2>${title}</h2>
          </div>
          <pre><code>${cleanContent}</code></pre>
        </div>`;
      }
    );

    /* Format code blocks */
    processedText = processedText.replace(
      /```(?:\w+)?\n([\s\S]*?)```/g,
      (match, code) => {
        const escapedCode = code
          .trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre><code>${escapedCode}</code></pre>`;
      }
    );

    return `<div class="message ${message.sender} selected">
      <div class="message-header">
        <h2>${message.sender}</h2>
        <span class="timestamp">${formatTimestamp(message.created_at)}</span>
      </div>
      ${processedText}
    </div>`;
  }

  function createUI(data) {
    const title = data.name || 'Conversation';
    const pathMessages = getConversationPath(data);
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title}</title>
    <style>${createStyles()}</style>
</head>
<body>
    <div class="action-buttons">
      <div id="token-counter">Words: 0 | Tokens: ~0</div>
      <button id="copy-selected">Copy</button>
      <button id="download-selected">Download</button>
    </div>
    <div class="controls">
      <button id="toggle-all">Toggle All</button>
      <button id="toggle-human">Toggle Human</button>
      <button id="toggle-assistant">Toggle Assistant</button>
      <button id="toggle-artifacts">Toggle Artifacts</button>
    </div>
    <h1>${title}</h1>
    <div id="conversation">
    ${pathMessages.map(msg => formatMessage(msg)).join('')}
    </div>
    <script>
    /* UI interaction handlers */
    function updateCounters() {
      const selectedText = Array.from(document.querySelectorAll('.message.selected, .artifact.selected'))
        .map(el => el.textContent)
        .join(' ');
      const words = selectedText.trim().split(/\\s+/).length;
      const tokens = Math.round(words * 1.35);
      document.getElementById('token-counter').textContent = 
        \`Words: \${words} | Tokens: ~\${tokens}\`;
    }

    function formatSelectedContent() {
      const selected = document.querySelectorAll('.message.selected, .artifact.selected');
      let content = [];
      let processedArtifacts = new Set(); // Track processed artifacts
      
      selected.forEach(el => {
        if (el.classList.contains('message')) {
          const role = el.classList.contains('human') ? 'Human' : 'Assistant';
          const timestamp = el.querySelector('.timestamp').textContent;
          
          // Get text content excluding timestamp and role label
          let text = el.textContent
            .replace(timestamp, '')
            .replace(role, '')
            .trim();
            
          // Remove leading/trailing whitespace from each line
          text = text.split('\n')
            .map(line => line.trim())
            .filter(line => line) // Remove empty lines
            .join('\n');
            
          content.push(`<${role}>${text}</${role}>`);
          
        } else if (el.classList.contains('artifact') && !processedArtifacts.has(el)) {
          const title = el.querySelector('h2').textContent;
          const code = el.querySelector('code').textContent.trim();
          content.push(`<Artifact title="${title}">${code}</Artifact>`);
          processedArtifacts.add(el); // Mark this artifact as processed
        }
      });
      
      return content.join('\n\n');
    }

    function setupEventListeners() {
      /* Message selection */
      document.querySelectorAll('.message, .artifact').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          el.classList.toggle('selected');
          updateCounters();
        });
      });

      /* Control buttons */
      document.getElementById('toggle-all').onclick = () => {
        const allElements = document.querySelectorAll('.message, .artifact');
        const allSelected = Array.from(allElements).every(el => el.classList.contains('selected'));
        allElements.forEach(el => el.classList.toggle('selected', !allSelected));
        updateCounters();
      };

      document.getElementById('toggle-human').onclick = () => {
        document.querySelectorAll('.message.human')
          .forEach(el => el.classList.toggle('selected'));
        updateCounters();
      };

      document.getElementById('toggle-assistant').onclick = () => {
        document.querySelectorAll('.message.assistant')
          .forEach(el => el.classList.toggle('selected'));
        updateCounters();
      };

      document.getElementById('toggle-artifacts').onclick = () => {
        document.querySelectorAll('.artifact')
          .forEach(el => el.classList.toggle('selected'));
        updateCounters();
      };

      document.getElementById('copy-selected').onclick = () => {
        const text = formatSelectedContent();
        navigator.clipboard.writeText(text);
        const btn = document.getElementById('copy-selected');
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy';
        }, 2000);
      };

      document.getElementById('download-selected').onclick = () => {
        const text = formatSelectedContent();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selected-conversation.txt';
        a.click();
        URL.revokeObjectURL(url);
      };

      updateCounters();
    }

    setupEventListeners();
    </script>
</body>
</html>`;

    return html;
  }

  /* Main execution */
  try {
    const conversationData = JSON.parse(document.body.textContent);
    const formattedHTML = createUI(conversationData);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(formattedHTML);
    newWindow.document.close();
  } catch (error) {
    alert('Error processing conversation: ' + error.message);
  }
})();
