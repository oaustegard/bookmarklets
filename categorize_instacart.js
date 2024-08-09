javascript:(function() {
    function isInstacartPage() {
        return window.location.hostname.includes('instacart.com');
    }

    function sendToClaude(text) {
        const prefix = "Create an artifact categorizing this Instacart shopping list by type of item:. Don't write a preamble or explanation:\n";
        const message = encodeURIComponent(prefix + text);
        window.open(`https://claude.ai/new?q=${message}`, '_blank');
    }

    function processCartItems() {
        const elements = document.querySelectorAll('#cart-body li h3');
        if (elements.length === 0) {
            alert('No cart items found. Please make sure your cart is open and visible on the page.');
            return;
        }

        const textList = Array.from(elements).map(el => el.textContent.trim());
        const textPerLine = textList.join('\n');

        sendToClaude(textPerLine);
    }

    if (!isInstacartPage()) {
        if (confirm('This is not an Instacart page. Do you want to go to Instacart?')) {
            window.location.href = 'https://www.instacart.com';
        }
        return;
    }

    processCartItems();
})();
