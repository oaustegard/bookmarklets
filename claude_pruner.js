/* Simple test script to verify external loading and data access */
document.addEventListener('DOMContentLoaded', () => {
  if (window.conversationData) {
    const count = window.conversationData.chat_messages.length;
    document.getElementById('messageCount').textContent = 
      `Successfully loaded ${count} messages`;
    
    const output = document.getElementById('testOutput');
    output.innerHTML = `
      <h2>First Message:</h2>
      <pre>${JSON.stringify(window.conversationData.chat_messages[0], null, 2)}</pre>
    `;
  } else {
    document.body.innerHTML = '<h1>Error: No conversation data found</h1>';
  }
});
