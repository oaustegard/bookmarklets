javascript: (function() {
  /* Capture the current Claude conversation tree as JSON */
  /* Get the organization ID from localStorage */
  const orgId = localStorage.getItem('lastActiveOrg'); 
  /* Get the conversation ID from the current URL */
  const conversationId = window.location.pathname.split('/').pop(); 
  /* Construct the API URL with timestamp, setting render mode to messages and turning off tool mode to get the artifacts */
  const apiUrl = `https://api.claude.ai/api/organizations/${orgId}/chat_conversations/${conversationId}?tree=True&rendering_mode=messages&render_all_tools=True`;
  window.open(apiUrl, '_blank');
})();
