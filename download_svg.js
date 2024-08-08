javascript:(function() {
    /* Style for highlighting SVGs */
    var style = document.createElement('style');
    style.textContent = `
        .svg-downloader-highlight {
            outline: 3px solid #ff0000 !important;
            cursor: pointer !important;
        }
    `;
    document.head.appendChild(style);

    /* Function to find the closest SVG element */
    function findClosestSVG(element) {
        while (element && element !== document.body) {
            if (element.tagName.toLowerCase() === 'svg') {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    /* Function to download SVG */
    function downloadSVG(svgElement) {
        var svgData = new XMLSerializer().serializeToString(svgElement);
        var svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'downloaded_svg.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
    }

    /* Highlight SVGs on mouseover */
    function highlightSVG(event) {
        var svg = findClosestSVG(event.target);
        if (svg) {
            svg.classList.add('svg-downloader-highlight');
        }
    }

    /* Remove highlight on mouseout */
    function unhighlightSVG(event) {
        var svg = findClosestSVG(event.target);
        if (svg) {
            svg.classList.remove('svg-downloader-highlight');
        }
    }

    /* Handle click on SVG */
    function handleClick(event) {
        var svg = findClosestSVG(event.target);
        if (svg) {
            event.preventDefault();
            event.stopPropagation();
            downloadSVG(svg);
            cleanup();
        }
    }

    /* Cleanup function */
    function cleanup() {
        document.removeEventListener('mouseover', highlightSVG);
        document.removeEventListener('mouseout', unhighlightSVG);
        document.removeEventListener('click', handleClick);
        document.head.removeChild(style);
        alert('SVG downloaded. Bookmarklet deactivated.');
    }

    /* Add event listeners */
    document.addEventListener('mouseover', highlightSVG);
    document.addEventListener('mouseout', unhighlightSVG);
    document.addEventListener('click', handleClick);

    alert('SVG Downloader activated. Hover over an SVG and click to download. Click anywhere else to cancel.');
})();
