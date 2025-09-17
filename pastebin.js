javascript:(function() {
    /* EDIT THIS: Replace with your actual Pastebin API developer key */
    const API_DEV_KEY = 'YOUR_API_KEY_HERE';
    
    /* Get text content - selected text or full document */
    let textContent = '';
    const selection = window.getSelection().toString().trim();
    
    if (selection) {
        textContent = selection;
        console.log('Using selected text:', textContent.substring(0, 100) + '...');
    } else {
        textContent = document.body.innerText || document.body.textContent || '';
        console.log('Using full document text, length:', textContent.length);
    }
    
    if (!textContent) {
        alert('No text found to paste!');
        return;
    }
    
    /* Prepare form data for Pastebin API */
    const formData = new FormData();
    formData.append('api_option', 'paste');
    formData.append('api_dev_key', API_DEV_KEY);
    formData.append('api_paste_code', textContent);
    formData.append('api_paste_private', '1'); /* 0=public, 1=unlisted, 2=private */
    formData.append('api_paste_name', document.title || 'Bookmarklet Paste');
    formData.append('api_paste_expire_date', '1M'); /* 1 Month expiration */
    formData.append('api_paste_format', 'text');
    
    console.log('Sending to Pastebin...');
    
    /* Send request to Pastebin API */
    fetch('https://pastebin.com/api/api_post.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        console.log('Pastebin API response:', result);
        
        if (result.startsWith('https://pastebin.com/')) {
            /* Success - copy URL to clipboard and show alert */
            navigator.clipboard.writeText(result).then(() => {
                alert('Success! Pastebin URL copied to clipboard:\n' + result);
            }).catch(() => {
                alert('Success! Pastebin URL:\n' + result + '\n\n(Could not copy to clipboard - please copy manually)');
            });
        } else {
            /* Error response from API */
            console.error('Pastebin error:', result);
            alert('Pastebin Error:\n' + result);
        }
    })
    .catch(error => {
        console.error('Request failed:', error);
        alert('Failed to create paste: ' + error.message);
    });
})();
