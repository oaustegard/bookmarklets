javascript:(function() {
/* Creates a firework and text eruption effect on a webpage when clicked. */  
    /* Style reset to prevent interference */
    const style = document.createElement('style');
    style.textContent = `
        .erupting-text {
            position: relative !important;
            transition: transform 0.3s ease-out !important;
        }
    `;
    document.head.appendChild(style);

    /* Create firework effect */
    function createFirework(x, y) {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 100;
        
        x = Math.max(margin, Math.min(x, viewportWidth - margin));
        y = Math.max(margin, Math.min(y, viewportHeight - margin));
        
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        for(let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 3 + Math.random() * 3;
            const size = 4 + Math.random() * 4;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 2147483647;
            `;
            
            document.body.appendChild(particle);
            
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            let opacity = 1;
            
            function animate() {
                const left = parseFloat(particle.style.left);
                const top = parseFloat(particle.style.top);
                particle.style.left = (left + dx) + 'px';
                particle.style.top = (top + dy + 0.5) + 'px';
                opacity *= 0.98;
                particle.style.opacity = opacity;
                
                if(opacity > 0.01) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            }
            
            requestAnimationFrame(animate);
        }
    }
    
    /* Find all text-containing elements */
    function getTextElements() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    /* Check if element has direct text content and is visible */
                    if (node.childNodes.length === 0) return NodeFilter.FILTER_SKIP;
                    if (window.getComputedStyle(node).display === 'none') return NodeFilter.FILTER_SKIP;
                    
                    for (let child of node.childNodes) {
                        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
        
        const elements = [];
        let node;
        while (node = walker.nextNode()) {
            elements.push(node);
        }
        return elements;
    }
    
    /* Create eruption effect */
    let isErupting = false;
    function erupt(e) {
        if(isErupting) return;
        isErupting = true;
        
        /* Calculate firework position */
        const x = e ? e.clientX : window.innerWidth / 2;
        const y = e ? e.clientY : window.innerHeight / 2;
        
        /* Find visible text elements */
        const elements = getTextElements().filter(el => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && 
                   rect.bottom > 0 && 
                   rect.width > 0 && 
                   rect.height > 0;
        });
        
        /* Add erupting class for animation */
        elements.forEach(el => {
            if (!el.classList.contains('erupting-text')) {
                el.classList.add('erupting-text');
            }
        });
        
        /* Trigger fireworks */
        createFirework(x, y);
        
        /* Animate visible elements */
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.style.transform = `translateY(-10px)`;
                setTimeout(() => {
                    el.style.transform = 'none';
                }, 300);
            }, i * 50);
        });
        
        setTimeout(() => {
            isErupting = false;
        }, Math.max(1000, elements.length * 50 + 300));
    }
    
    /* Track user interaction */
    document.body.addEventListener('click', erupt);
    
    /* Initial eruption */
    setTimeout(() => erupt(), 500);
    
    /* Cleanup function */
    window._cleanupEruption = function() {
        document.body.removeEventListener('click', erupt);
        style.remove();
        document.querySelectorAll('.erupting-text').forEach(el => {
            el.classList.remove('erupting-text');
            el.style.transform = 'none';
        });
    };
})();
