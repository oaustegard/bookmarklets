javascript:(function(){
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

  /* Process message content parts into a single string */
  function processMessageContent(message) {
    if (message.content && Array.isArray(message.content)) {
      return message.content
        .filter(part => part.type === 'text')
        .map(part => part.text)
        .join('');
    }
    return message.text || '';
  }

  /* Format code blocks with proper HTML escaping */
  function formatCodeBlocks(text) {
    return text.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (match, code) => {
      const escapedCode = code
        .trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre><code>${escapedCode}</code></pre>`;
    });
  }

  /* Format the conversation */
  function formatConversation(data) {
    const pathMessages = getConversationPath(data);
    const title = data.name || 'Conversation';
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.fluid.classless.green.min.css">
    <style>
      body { max-width: 1280px; margin: 0 auto; padding: 1rem; }
      .message { margin: 1rem 0; padding: 1rem; border: 1px solid #eee; }
      .human { background: #f8f9fa; }
      .assistant { background: #fff; }
      .artifact { 
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
      }
      pre { 
        margin: 1rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      code { 
        font-family: monospace;
        white-space: pre;
      }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div id="conversation">`;

    /* Process each message */
    pathMessages.forEach(message => {
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

          return `<div class="artifact">
            <h3>${title}</h3>
            <pre><code>${cleanContent}</code></pre>
          </div>`;
        }
      );

      /* Format code blocks */
      processedText = formatCodeBlocks(processedText);

      html += `<div class="message ${message.sender}">
        <h2>${message.sender}</h2>
        ${processedText}
      </div>`;
    });

    html += `</div>
</body>
</html>`;

    return html;
  }

  /* Main execution */
  try {
    const conversationData = JSON.parse(document.body.textContent);
    const formattedHTML = formatConversation(conversationData);
    const newWindow = window.open('', '_blank');
    newWindow.document.write(formattedHTML);
    newWindow.document.close();
  } catch(error) {
    alert('Error processing conversation: ' + error.message);
  }
})();
