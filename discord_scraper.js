javascript:(function() {
/* @title: Scrape Discord Forum */
/* @description: Captures and threads Discord forum messages as you scroll through conversation history */
    /* Initialize storage */
    let messages = new Map();

    /* Create UI */
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2f3136;
        color: white;
        padding: 10px;
        border-radius: 8px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        display: flex;
        gap: 10px;
        align-items: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    const counter = document.createElement('div');
    counter.textContent = 'Messages: 0';
    counter.style.marginRight = '10px';

    /* Extract initial messages from DOM */
    function extractInitialMessages() {
        const messageList = document.querySelector('ol[data-list-id="chat-messages"]');
        if (!messageList) return [];

        let lastKnownAuthor = null;
        const initialMessages = [];

        messageList.querySelectorAll('li[class*="messageListItem"]').forEach(li => {
            const messageDiv = li.querySelector('div[class*="message_"]');
            if (!messageDiv) return;

            const messageId = li.id.split('-').pop();

            /* Extract author with fallback to last known */
            const headerText = messageDiv.querySelector('h3[class*="header_"]');
            const authorElement = headerText ? headerText.querySelector('span[class*="username_"]') : null;
            const author = authorElement ? 
                authorElement.textContent.replace('@', '') : 
                lastKnownAuthor || 'Unknown';
            
            if (authorElement) lastKnownAuthor = author;

            /* Extract timestamp */
            const timeElement = messageDiv.querySelector('time');
            const timestamp = timeElement ? timeElement.getAttribute('datetime') : new Date().toISOString();

            /* Extract content */
            const contentDiv = messageDiv.querySelector('div[id^="message-content-"]');
            const content = contentDiv ? 
                Array.from(contentDiv.querySelectorAll('span'))
                    .map(span => span.textContent)
                    .join('') : '';

            /* Handle reply context */
            const replyDiv = messageDiv.querySelector('div[class*="repliedMessage_"]');
            const messageObj = {
                id: messageId,
                content: content,
                author: author,
                timestamp: timestamp
            };

            if (replyDiv) {
                const replyContent = replyDiv.querySelector('div[class*="repliedTextContent_"]');
                const replyAuthor = replyDiv.querySelector('span[class*="username_"]');
                
                if (replyContent && replyAuthor) {
                    const replyContentText = Array.from(replyContent.querySelectorAll('span'))
                        .map(span => span.textContent)
                        .join('');
                    
                    /* Only add reference if content differs */
                    if (replyContentText !== content) {
                        messageObj.referenced_id = replyContent.id.split('-').pop();
                        messageObj.referenced_author = replyAuthor.textContent.replace('@', '');
                        messageObj.referenced_content = replyContentText;
                    }
                }
            }

            initialMessages.push(messageObj);
        });

        return initialMessages;
    }

    function reconstructThreads() {
        const messagesArray = Array.from(messages.values());
        const threads = new Map();
        const processedIds = new Set();

        /* First pass: identify root messages */
        messagesArray.forEach(msg => {
            if (!msg.referenced_id) {
                threads.set(msg.id, {
                    root: {
                        author: msg.author,
                        content: msg.content,
                        timestamp: msg.timestamp
                    },
                    replies: []
                });
            }
        });

        /* Second pass: attach replies to their threads */
        messagesArray.forEach(msg => {
            if (msg.referenced_id) {
                let threadRoot = msg.referenced_id;
                
                /* Walk up the reference chain to find the root */
                let currentMsg = messages.get(threadRoot);
                while (currentMsg && currentMsg.referenced_id) {
                    threadRoot = currentMsg.referenced_id;
                    currentMsg = messages.get(threadRoot);
                }

                /* If we found a valid thread, add the reply */
                if (threads.has(threadRoot)) {
                    threads.get(threadRoot).replies.push({
                        author: msg.author,
                        content: msg.content,
                        timestamp: msg.timestamp
                    });
                    processedIds.add(msg.id);
                }
            }
        });

        /* Convert to array and clean up empty threads */
        return Array.from(threads.values())
            .filter(thread => thread.replies.length > 0)
            .sort((a, b) => new Date(a.root.timestamp) - new Date(b.root.timestamp));
    }

    function processMessages(data, isFromAPI = true) {
        if (!Array.isArray(data)) return;
        
        /* Convert API messages to our format if needed */
        const processedBatch = isFromAPI ? 
            data.map(msg => ({
                id: msg.id,
                content: msg.content,
                author: msg.author.global_name || msg.author.username,
                timestamp: msg.timestamp,
                ...(msg.referenced_message && {
                    referenced_id: msg.referenced_message.id,
                    referenced_author: msg.referenced_message.author.global_name || msg.referenced_message.author.username,
                    referenced_content: msg.referenced_message.content
                })
            })) : data;

        /* Sort by timestamp */
        const sortedBatch = processedBatch.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        /* Prepend batch to maintain chronological order */
        const oldMessages = Array.from(messages.values());
        messages.clear();
        
        /* Add new batch first, then existing messages */
        sortedBatch.forEach(msg => messages.set(msg.id, msg));
        oldMessages.forEach(msg => messages.set(msg.id, msg));

        counter.textContent = `Messages: ${messages.size}`;
    }

    /* Create buttons */
    const buttonStyle = `
        padding: 5px 10px;
        border: none;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    `;

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.style.cssText = buttonStyle + 'background: #5865F2;';
    downloadBtn.onclick = () => {
        const data = reconstructThreads();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'discord-threads.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.style.cssText = buttonStyle + 'background: #5865F2;';
    copyBtn.onclick = () => {
        const data = reconstructThreads();
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 1000);
        });
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = buttonStyle + 'background: #ed4245;';
    closeBtn.onclick = () => panel.remove();

    /* Assemble UI */
    panel.appendChild(counter);
    panel.appendChild(downloadBtn);
    panel.appendChild(copyBtn);
    panel.appendChild(closeBtn);

    /* Intercept XHR requests */
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        xhr.open = function() {
            this.addEventListener('load', function() {
                if (this.responseURL.includes('/messages?')) {
                    try {
                        const data = JSON.parse(this.responseText);
                        processMessages(data, true);
                    } catch (e) {
                        console.error('Error processing response:', e);
                    }
                }
            });
            originalOpen.apply(this, arguments);
        };
        return xhr;
    };

    /* Intercept fetch requests */
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        const promise = originalFetch(url, options);
        if (url.toString().includes('/messages?')) {
            promise.then(response => response.clone().json())
                .then(data => processMessages(data, true))
                .catch(e => console.error('Error processing fetch:', e));
        }
        return promise;
    };

    /* Process initial messages */
    const initialMessages = extractInitialMessages();
    if (initialMessages.length > 0) {
        processMessages(initialMessages, false);
    }

    /* Add panel to page */
    document.body.appendChild(panel);

    console.log('Discord scraper active. Scroll to capture messages.');
})();
