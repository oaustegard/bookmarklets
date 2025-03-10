javascript:(function() {
  /* Check if bookmarklet is already running */
  if (window.__stickyElementBookmarklet) {
    alert('Sticky element selection is already active. Press Esc to cancel.');
    return;
  }

  /* Mark that our bookmarklet is running */
  window.__stickyElementBookmarklet = true;
  
  /* Track our state */
  let state = 'selecting'; /* 'selecting' or 'sticky' */
  let selectedElement = null;
  let cloneElement = null;
  let initialPosition = null;
  let lastScrollY = window.scrollY;
  
  /* Create UI elements */
  const ui = {
    message: createMessageBox(),
    overlay: createSelectionOverlay(),
    highlighter: createHighlighter()
  };
  
  /* Create message box */
  function createMessageBox() {
    const msg = document.createElement('div');
    msg.setAttribute('id', 'sticky-message');
    msg.style.position = 'fixed';
    msg.style.bottom = '10px';
    msg.style.right = '10px';
    msg.style.zIndex = '2147483647';
    msg.style.backgroundColor = 'rgba(0,0,0,0.7)';
    msg.style.color = 'white';
    msg.style.padding = '8px 12px';
    msg.style.borderRadius = '4px';
    msg.style.fontFamily = 'Arial, sans-serif';
    msg.style.fontSize = '12px';
    msg.style.textAlign = 'center';
    msg.style.maxWidth = '250px';
    msg.textContent = 'Hover over an element and click to make it stick while scrolling. Press Esc to cancel.';
    document.body.appendChild(msg);
    return msg;
  }
  
  /* Create selection overlay */
  function createSelectionOverlay() {
    const overlay = document.createElement('div');
    overlay.setAttribute('id', 'sticky-overlay');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '2147483646';
    overlay.style.cursor = 'crosshair';
    overlay.style.backgroundColor = 'transparent';
    document.body.appendChild(overlay);
    
    /* Handle hover effects */
    overlay.addEventListener('mousemove', function(e) {
      const el = getElementUnderCursor(e.clientX, e.clientY);
      if (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
        highlightElement(el);
      }
    });
    
    /* Handle clicks */
    overlay.addEventListener('click', function(e) {
      const el = getElementUnderCursor(e.clientX, e.clientY);
      if (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
        makeElementSticky(el);
      }
      e.preventDefault();
      e.stopPropagation();
    });
    
    return overlay;
  }
  
  /* Create highlighter */
  function createHighlighter() {
    const highlighter = document.createElement('div');
    highlighter.setAttribute('id', 'sticky-highlighter');
    highlighter.style.position = 'absolute';
    highlighter.style.pointerEvents = 'none';
    highlighter.style.zIndex = '2147483645';
    document.body.appendChild(highlighter);
    return highlighter;
  }
  
  /* Get element under cursor, ignoring our UI */
  function getElementUnderCursor(x, y) {
    /* Hide our elements temporarily */
    const uiElements = document.querySelectorAll('#sticky-message, #sticky-overlay, #sticky-highlighter, #sticky-clone-container');
    for (const el of uiElements) {
      el.style.display = 'none';
    }
    
    /* Get element */
    const element = document.elementFromPoint(x, y);
    
    /* Restore our elements */
    for (const el of uiElements) {
      el.style.display = '';
    }
    
    return element;
  }
  
  /* Highlight an element */
  function highlightElement(element) {
    ui.highlighter.innerHTML = '';
    
    const position = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    
    highlight.style.position = 'fixed';
    highlight.style.left = position.left + 'px';
    highlight.style.top = position.top + 'px';
    highlight.style.width = position.width + 'px';
    highlight.style.height = position.height + 'px';
    highlight.style.border = '3px solid #00CCFF';
    highlight.style.boxShadow = '0 0 8px rgba(0, 204, 255, 0.8)';
    highlight.style.borderRadius = '2px';
    highlight.style.pointerEvents = 'none';
    
    /* Add label */
    const label = document.createElement('div');
    label.textContent = 'CLICK TO MAKE STICKY';
    label.style.position = 'absolute';
    label.style.top = '-30px';
    label.style.left = '0';
    label.style.backgroundColor = '#00CCFF';
    label.style.color = 'white';
    label.style.padding = '5px 10px';
    label.style.borderRadius = '3px';
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.style.whiteSpace = 'nowrap';
    
    highlight.appendChild(label);
    ui.highlighter.appendChild(highlight);
  }
  
  /* Get computed background color of an element, checking parents if needed */
  function getEffectiveBackgroundColor(element) {
    let current = element;
    let maxDepth = 10; // Limit parent traversal to prevent infinite loops
    
    while (current && maxDepth > 0) {
      const style = window.getComputedStyle(current);
      const bgColor = style.backgroundColor;
      
      // Check if we have a visible background
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        // Parse the background color components
        let color;
        let alpha = 1;
        
        if (bgColor.startsWith('rgba')) {
          // Extract RGBA components
          const match = bgColor.match(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
          if (match) {
            const [_, r, g, b, a] = match;
            color = `rgb(${r}, ${g}, ${b})`;
            alpha = parseFloat(a);
          } else {
            color = bgColor;
          }
        } else {
          color = bgColor;
        }
        
        // Ensure sufficient opacity for the background (at least 0.95)
        return alpha < 0.95 ? color.replace('rgb', 'rgba').replace(')', ', 0.95)') : bgColor;
      }
      
      // Move up to the parent
      current = current.parentElement;
      maxDepth--;
    }
    
    // Default fallback - a neutral gray that works with both light and dark text
    return 'rgba(240, 240, 240, 0.95)';
  }
  
  /* Make element sticky */
  function makeElementSticky(element) {
    /* Change state */
    state = 'sticky';
    selectedElement = element;
    
    /* Capture initial position */
    initialPosition = element.getBoundingClientRect();
    
    /* Determine background color */
    const backgroundColor = getEffectiveBackgroundColor(element);
    
    /* Create a container for our clone */
    const container = document.createElement('div');
    container.setAttribute('id', 'sticky-clone-container');
    container.style.position = 'fixed';
    container.style.zIndex = '2147483645';
    container.style.top = initialPosition.top + 'px';
    container.style.left = initialPosition.left + 'px';
    container.style.width = initialPosition.width + 'px';
    container.style.height = initialPosition.height + 'px';
    container.style.boxShadow = '0 0 0 2px #00FF00, 0 0 10px rgba(0,255,0,0.5)';
    container.style.backgroundColor = backgroundColor;
    container.style.backdropFilter = 'blur(3px)';
    container.style.display = 'none'; /* Start hidden */
    container.style.overflow = 'hidden';
    container.style.maxHeight = Math.min(initialPosition.height, window.innerHeight - 20) + 'px';
    
    /* Clone the element */
    cloneElement = element.cloneNode(true);
    
    /* Clean up event listeners on the clone */
    const allElements = [cloneElement].concat(Array.from(cloneElement.querySelectorAll('*')));
    for (const el of allElements) {
      const clone = el.cloneNode(false);
      if (el.parentNode) {
        el.parentNode.replaceChild(clone, el);
      }
    }
    
    /* Reset the clone */
    cloneElement = element.cloneNode(true);
    
    /* Copy computed styles to ensure visual fidelity */
    const elementStyle = window.getComputedStyle(element);
    cloneElement.style.color = elementStyle.color;
    cloneElement.style.fontSize = elementStyle.fontSize;
    cloneElement.style.fontFamily = elementStyle.fontFamily;
    cloneElement.style.lineHeight = elementStyle.lineHeight;
    cloneElement.style.fontWeight = elementStyle.fontWeight;
    
    /* Add clone to container */
    container.appendChild(cloneElement);
    
    /* Add status indicator with contrasting color */
    const status = document.createElement('div');
    status.textContent = 'STICKY';
    status.style.position = 'absolute';
    status.style.top = '2px';
    status.style.right = '2px';
    status.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
    status.style.color = 'rgba(0, 0, 0, 0.9)';
    status.style.padding = '2px 6px';
    status.style.fontSize = '10px';
    status.style.fontWeight = 'bold';
    status.style.borderRadius = '3px';
    status.style.pointerEvents = 'none';
    status.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
    container.appendChild(status);
    
    document.body.appendChild(container);
    
    /* Remove unnecessary UI elements */
    document.body.removeChild(ui.overlay);
    ui.highlighter.innerHTML = '';
    
    /* Update message */
    ui.message.textContent = 'Element is now sticky. Press Esc to revert.';
    ui.message.style.opacity = '0.8';
    
    /* Set up scroll tracking */
    window.addEventListener('scroll', checkElementVisibility);
    window.addEventListener('resize', checkElementVisibility);
    
    /* Track scroll direction */
    window.addEventListener('scroll', function() {
      const currentScroll = window.scrollY;
      lastScrollY = currentScroll;
    });
    
    /* Initial check */
    checkElementVisibility();
  }
  
  /* Check if element is in viewport and toggle clone visibility */
  function checkElementVisibility() {
    if (state !== 'sticky' || !selectedElement) return;
    
    const cloneContainer = document.getElementById('sticky-clone-container');
    if (!cloneContainer) return;
    
    const position = selectedElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    /* Calculate how much of the element is visible vertically (as a percentage) */
    let visibleHeight = 0;
    
    if (position.top >= 0 && position.bottom <= windowHeight) {
      /* Fully visible */
      visibleHeight = position.height;
    } else if (position.top < 0 && position.bottom > 0) {
      /* Partially visible at top */
      visibleHeight = position.bottom;
    } else if (position.top < windowHeight && position.bottom > windowHeight) {
      /* Partially visible at bottom */
      visibleHeight = windowHeight - position.top;
    }
    
    const visibilityPercentage = (visibleHeight / position.height) * 100;
    
    /* Show clone when less than 80% visible */
    const shouldShow = visibilityPercentage < 80;
    
    cloneContainer.style.display = shouldShow ? 'block' : 'none';
    
    if (shouldShow) {
      /* Determine if element scrolled out from top or bottom */
      if (position.bottom < 20) {
        /* Scrolled out from top - position at top */
        cloneContainer.style.top = '10px';
        cloneContainer.style.bottom = 'auto';
      } else if (position.top > windowHeight - 20) {
        /* Scrolled out from bottom - position at bottom */
        cloneContainer.style.top = 'auto';
        cloneContainer.style.bottom = '10px';
      }
      
      /* Always maintain same left position as original element */
      cloneContainer.style.left = position.left + 'px';
    }
  }
  
  /* Clean up everything */
  function cleanup() {
    /* Remove UI elements */
    const elements = [
      document.getElementById('sticky-message'),
      document.getElementById('sticky-overlay'),
      document.getElementById('sticky-highlighter'),
      document.getElementById('sticky-clone-container')
    ];
    
    for (const el of elements) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
    
    /* Remove event listeners */
    window.removeEventListener('scroll', checkElementVisibility);
    window.removeEventListener('resize', checkElementVisibility);
    
    /* Reset bookmarklet state */
    delete window.__stickyElementBookmarklet;
  }
  
  /* Set up escape key handler */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      cleanup();
    }
  });
})();
