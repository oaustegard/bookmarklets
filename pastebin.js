javascript:(function() {
    /* EDIT THIS: Replace with your actual Pastebin API developer key from https://pastebin.com/doc_api */
    const API_DEV_KEY = 'YOUR_API_KEY_HERE';
    
    /* Get text content - selected text or full document */
    let textContent = '';
    const selection = window.getSelection().toString().trim();
    
    if (selection) {
        textContent = selection;
        console.log('Using selected text, length:', textContent.length);
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
    formData.append('api_paste_private', '1');
    formData.append('api_paste_name', document.title || 'Bookmarklet Paste');
    formData.append('api_paste_expire_date', '1M');
    formData.append('api_paste_format', 'text');
    
    console.log('Sending via CORS proxy to Pastebin...');
    
    /* Use CORS proxy to bypass browser restrictions */
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://pastebin.com/api/api_post.php';
    
    fetch(proxyUrl + encodeURIComponent(targetUrl), {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Proxy response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.text();
    })
    .then(result => {
        console.log('Pastebin API response:', result);
        
        if (result.startsWith('https://pastebin.com/')) {
            /* Success - copy URL to clipboard, open in new tab, and show alert */
            const pasteUrl = result.trim();
            
            navigator.clipboard.writeText(pasteUrl).then(() => {
                console.log('URL copied to clipboard successfully');
            }).catch(() => {
                console.log('Could not copy to clipboard');
            });
            
            /* Open the paste in a new tab */
            window.open(pasteUrl, '_blank');
            
            alert('✅ Success! Pastebin opened in new tab and URL copied to clipboard:\n' + pasteUrl);
        } else if (result.startsWith('Bad API request')) {
            console.error('Pastebin API error:', result);
            alert('❌ Pastebin API Error:\n' + result);
        } else {
            console.warn('Unexpected response:', result);
            alert('⚠️ Unexpected response:\n' + result);
        }
    })
    .catch(error => {
        console.error('Request failed:', error);
        alert('❌ Failed to create paste: ' + error.message + '\n\nCheck console for details.');
    });
})();
