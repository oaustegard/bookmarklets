javascript: (function() {
  /* Capture the current Claude conversation tree as JSON */
  /* Get the organization ID from localStorage */
  var orgId = localStorage.getItem('lastActiveOrg'); 
  /* Get the conversation ID from the current URL */
  var conversationId = window.location.pathname.split('/').pop(); 
  var timestamp = new Date().getTime(); 
  /* Construct the API URL with timestamp, turning off tool mode to get the artifacts */
  var apiUrl = 'https://api.claude.ai/api/organizations/' + orgId + '/chat_conversations/' + conversationId + '?tree=True&rendering_mode=raw&render_all_tools=false&t=%27 + timestamp;    
  window.open(apiUrl, '_blank');
})();
