javascript:(function(){
  /* Load required libraries dynamically */
  async function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadScripts() {
    console.log('Loading scripts...');
    await loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    console.log('Marked loaded');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/languages/javascript.min.js');
    console.log('Highlight.js loaded');
  }  

  /* Fetch conversation data with auth headers */
  async function fetchConversation() {
    const orgId = localStorage.getItem('lastActiveOrg');
    const conversationId = window.location.pathname.split('/').pop();
    const timestamp = new Date().getTime();
    const apiUrl = `https://claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.status}`);
    }

    return response.json();
  }

  /* Process the conversation data into HTML */
  function getConversationPath(data) {
    const messageMap = new Map(data.chat_messages.map(msg => [msg.uuid, msg]));
    const path = [];
    let currentMsg = messageMap.get(data.current_leaf_message_uuid);
    while(currentMsg) {
      path.unshift(currentMsg);
      currentMsg = messageMap.get(currentMsg.parent_message_uuid);
    }
    return path;
  }

  /* Format the conversation with markdown support */
  function formatConversation(data, marked) {
    const pathMessages = getConversationPath(data);
    const title = data.name || 'Conversation';
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.fluid.classless.green.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">
    <style>
      :root {
        --human-bg: #f0f4f8;
        --assistant-bg: #fff;
        --border-color: #e2e8f0;
        --text-color: #2d3748;
        --meta-color: #718096;
      }
      body {
        padding: 1rem;
        max-width: 1280px;
        margin: 0 auto;
        background-color: #f8fafc;
        color: var(--text-color);
        line-height: 1.6;
      }
      @media(min-width: 768px) { body { padding: 2rem; } }
      h1 { color: var(--text-color); font-size: 1.875rem; margin-bottom: 1rem; }
      .meta {
        color: var(--meta-color);
        font-size: 0.875rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
      }
      .meta-info { flex: 1; }
      .download-btn {
        background-color: #4a5568;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
      }
      .download-btn:hover { background-color: #2d3748; }
      #conversation { display: flex; flex-direction: column; gap: 1rem; }
      .message {
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        overflow-x: auto;
      }
      .human { background-color: var(--human-bg); margin-right: 2rem; }
      .assistant { background-color: var(--assistant-bg); margin-left: 2rem; }
      .sender {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .content { margin: 0; }
      .content p { margin: 0.5em 0; }
      pre { margin: 1em 0; }
      pre code {
        border-radius: 0.375rem;
        font-size: 0.875rem;
        padding: 1rem !important;
        background-color: #f7fafc !important;
        border: 1px solid var(--border-color);
        display: block;
        overflow-x: auto;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.9em;
        background: #f1f5f9;
        padding: 0.2em 0.4em;
        border-radius: 0.25em;
      }
      pre code {
        background: transparent;
        padding: 0;
        border-radius: 0;
      }
      .artifact {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background-color: #f8fafc;
      }
      .artifact-header {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #4a5568;
      }
      .artifact-content { margin-top: 0.5rem; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">
        <div class="meta-info">
            <p>Created: <span style="margin-left:4px;">
                <a href="https://claude.ai/chat/${data.uuid}" target="_blank">
                    ${new Date(data.created_at).toLocaleString('en-US', {dateStyle:'full', timeStyle:'long'})}
                </a>
            </span></p>
            ${data.project ? `<p>Project: ${data.project.name}</p>` : ''}
        </div>
        <a href="#" class="download-btn" onclick="downloadHTML()">
            Download HTML
        </a>
    </div>
    <div id="conversation">`;

    /* Process each message */
    pathMessages.forEach(message => {
      let processedText = message.text;
      console.log('Processing message:', processedText);
      
      /* Handle artifacts */
      processedText = processedText.replace(
        /<antArtifact[^>]*identifier="([^"]*)"[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/antArtifact>/g,
        (match, identifier, title, content) => {
          return `<div class="artifact">
            <div class="artifact-header">${title}</div>
            <div class="artifact-content">
              <pre><code>${content}</code></pre>
            </div>
          </div>`;
        }
      );

      /* Convert markdown to HTML */
      processedText = marked.parse(processedText);

      html += `<div class="message ${message.sender}">
        <div class="sender">${message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}</div>
        <div class="content">${processedText}</div>
      </div>`;
    });

    html += `</div>
    <script>
      document.addEventListener('DOMContentLoaded', (event) => {
        hljs.highlightAll();
      });
      
      function downloadHTML() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    </script>
</body>
</html>`;

    return html;
  }

  /* Main execution */
async function main() {
    try {
      await loadScripts();
      marked.setOptions({ breaks: true, gfm: true, headerIds: false });
      const conversationData = await fetchConversation();
      const formattedHTML = formatConversation(conversationData, marked);
      const newWindow = window.open('', '_blank');
      console.log('Document written');
      newWindow.document.write(formattedHTML);
      console.log('Highlight.js object:', newWindow.hljs);
      newWindow.document.querySelector('script').onload = () => {
        console.log('Script running, hljs:', window.hljs);
        hljs.highlightAll();
        console.log('Highlighting complete');
        newWindow.document.close();
      };
      
    } catch(error) {
      alert('Error processing conversation: ' + error.message);
    }
  }

  main();
})();
