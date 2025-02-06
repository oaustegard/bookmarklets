javascript: (function() {
/* Shortcut to prompt Claude to create a summary of the current chat and instruct the user to download pertinent artifacts/uploads to copy into a new chat so as to maintain continuity of the conversation */

    const promptText = `<p>Please analyze our conversation history and create two artifacts:</p>
  
  <p>1. Instructions for Claude: An artifact containing specific context, decisions, and implementation patterns needed to continue this conversation effectively in a new chat.</p>
  
  <p>2. Instructions for the user: A separate artifact providing:</p>
  <ul>
    <li>Clear guidance on which messages to reference, using the actual starting words of those messages</li>
    <li>List of all artifacts from our conversation, noting which version is latest</li>
    <li>Instructions for downloading the latest artifacts and re-uploading them along with the Claude instructions</li>
    <li>Exactly what information needs to be carried forward from each message and why</li>
  </ul>
  
  <p>Please make both artifacts concise and actionable. The user artifact should enable easy scrolling through message history while keeping the instructions visible.</p>`;
  
    const inputDiv = document.querySelector('div[contenteditable="true"][translate="no"].ProseMirror');
  
    if (inputDiv) {
      inputDiv.innerHTML = promptText;
      
      inputDiv.focus();
      
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(inputDiv);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      alert('Could not find Claude input field. Please make sure you are on a Claude chat page.');
    }
  })();