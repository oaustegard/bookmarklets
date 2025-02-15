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
    /* Separate handling of text and artifacts */
    const parts = [];
    
    if (message.content) {
      message.content.forEach(part => {
        if (part.type === 'text') {
          parts.push({
            type: 'text',
            content: part.text.trim()
          });
        } else if (part.text) {
          /* Handle artifact pattern in text */
          const artifactMatch = part.text.match(/<antArtifact[^>]*identifier="([^"]*)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/antArtifact>/);
          if (artifactMatch) {
            parts.push({
              type: 'artifact',
              identifier: artifactMatch[1],
              title: artifactMatch[2],
              content: artifactMatch[3].trim()
            });
          } else {
            parts.push({
              type: 'text',
              content: part.text.trim()
            });
          }
        }
      });
    } else if (message.text) {
      parts.push({
        type: 'text',
        content: message.text.trim()
      });
    }
    
    return parts;
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
    const parts = processMessageContent(message);
    let html = `<div class="message ${message.sender} selected">
      <div class="message-header">
        <h2>${message.sender}</h2>
        <span class="timestamp">${formatTimestamp(message.created_at)}</span>
      </div>`;
    
    parts.forEach(part => {
      if (part.type === 'text') {
        /* Format code blocks within text */
        let processedText = part.content.replace(
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
        html += `<div class="text-content">${processedText}</div>`;
      } else if (part.type === 'artifact') {
        const cleanContent = part.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        html += `<div class="artifact selected" data-identifier="${part.identifier}" onclick="event.stopPropagation()">
          <div class="message-header">
            <h2>${part.title}</h2>
          </div>
          <pre><code>${cleanContent}</code></pre>
        </div>`;
      }
    });
    
    html += '</div>';
    return html;
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
      const selected = document.querySelectorAll('.message.selected');
      let content = [];
      let processedArtifacts = new Set();
      
      selected.forEach(el => {
        const role = el.classList.contains('human') ? 'Human' : 'Assistant';
        const timestamp = el.querySelector('.timestamp').textContent;
        
        /* Get text content excluding artifacts */
        const textContent = Array.from(el.querySelectorAll('.text-content'))
          .map(textEl => textEl.textContent.trim())
          .filter(text => text)
          .join('\n');
        
        /* Process artifacts */
        const artifacts = Array.from(el.querySelectorAll('.artifact.selected'))
          .filter(artifactEl => !processedArtifacts.has(artifactEl.dataset.identifier))
          .map(artifactEl => {
            processedArtifacts.add(artifactEl.dataset.identifier);
            const title = artifactEl.querySelector('h2').textContent;
            const code = artifactEl.querySelector('code').textContent.trim();
            return `<Artifact title="${title}">${code}</Artifact>`;
          });
        
        /* Combine text and artifacts */
        let messageContent = textContent;
        if (artifacts.length > 0) {
          messageContent += '\n' + artifacts.join('\n');
        }
        
        if (messageContent.trim()) {
          content.push(`<${role}>${messageContent.trim()}</${role}>`);
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
