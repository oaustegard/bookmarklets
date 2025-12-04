javascript:(function(){
/* @title: Create New Excalidraw */
/* @description: Generates a new Excalidraw drawing with a random shareable URL */

    /* Generate random hex string of specified length */
    function randomHex(length){
        return Array.from(crypto.getRandomValues(new Uint8Array(length))).map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,length);
    }
    
    /* Generate random base64-like string of specified length */
    function randomBase64(length){
        return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(Math.ceil(length * 3/4)))))
            .replace(/[+/]/g, c => c === '+' ? '-' : '_')
            .substring(0, length);
    }
    
    /* Generate room ID and secret */
    const roomId = randomHex(16);
    const secret = randomBase64(22);
    
    /* Get current timestamp */
    const timestamp = Date.now();
    
    /* Open new Excalidraw window with room ID, secret, and timestamp */
    window.open(`https://excalidraw.com/?_=${timestamp}#room=${roomId},${secret}`, '_blank');
})();
