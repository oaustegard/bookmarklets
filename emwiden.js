javascript:(function(){
    /* Create a semi-transparent overlay to highlight elements on hover */
    var overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    /* Variable to track if the bookmarklet is active */
    var isActive = true;

    /* Function to remove the overlay and event listeners */
    function cleanup() {
        isActive = false;
        document.removeEventListener('mouseover', mouseOverHandler, true);
        document.removeEventListener('click', clickHandler, true);
        document.removeEventListener('keydown', keyDownHandler, true);
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        console.log("Bookmarklet mode deactivated.");
    }

    /* Handler for mouseover to highlight elements */
    function mouseOverHandler(event) {
        if (!isActive) return;
        event.preventDefault();
        event.stopPropagation();
        var el = event.target;
        var rect = el.getBoundingClientRect();
        overlay.style.top = rect.top + window.scrollY + 'px';
        overlay.style.left = rect.left + window.scrollX + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
    }

    /* Function to find the nearest ancestor that causes horizontal overflow */
    function findOverflowingAncestor(el) {
        while (el && el !== document.body) {
            if (el.scrollWidth > el.clientWidth) {
                return el;
            }
            el = el.parentElement;
        }
        /* Finally, check the body */
        if (document.body.scrollWidth > document.documentElement.clientWidth) {
            return document.body;
        }
        return null;
    }

    /* Handler for click to select the element */
    function clickHandler(event) {
        if (!isActive) return;
        event.preventDefault();
        event.stopPropagation();
        var el = event.target;
        var overflowingEl = findOverflowingAncestor(el);
        if (overflowingEl) {
            /* Expand the element */
            overflowingEl.style.width = overflowingEl.scrollWidth + 'px';
            overflowingEl.style.minWidth = overflowingEl.scrollWidth + 'px';
            overflowingEl.style.boxSizing = 'content-box';
            overflowingEl.style.display = 'block';
            console.log("Expanded element:", overflowingEl);
        } else {
            console.log("No overflowing element found for the selected element.");
        }
    }

    /* Handler for keydown to listen for the Esc key */
    function keyDownHandler(event) {
        if (event.key === 'Escape') {
            cleanup();
        }
    }

    /* Attach event listeners */
    document.addEventListener('mouseover', mouseOverHandler, true);
    document.addEventListener('click', clickHandler, true);
    document.addEventListener('keydown', keyDownHandler, true);

    console.log("Bookmarklet activated. Hover to highlight elements and click to expand. Press Esc to deactivate.");
})();
