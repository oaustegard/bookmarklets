javascript:(function() {
    /* Function to find the nearest SVG element by navigating up the DOM from the specified element */
    function findNearestSVG(element) {
        while (element && element.tagName.toLowerCase() !== 'svg') {
            element = element.parentElement;
        }
        return element;
    }

    /* Function to download the SVG */
    function downloadSVG(svgElement) {
        /* Get the SVG content */
        var svgContent = new XMLSerializer().serializeToString(svgElement);
        
        /* Create a Blob with the SVG content */
        var blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        
        /* Create a download link */
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'downloaded_svg.svg';
        
        /* Append the link to the body, click it, and remove it */
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /* Main execution */
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var selectedElement = selection.getRangeAt(0).commonAncestorContainer;
        if (selectedElement.nodeType === Node.TEXT_NODE) {
            selectedElement = selectedElement.parentElement;
        }
        
        var svgElement = findNearestSVG(selectedElement);
        
        if (svgElement) {
            downloadSVG(svgElement);
        } else {
            alert('No SVG found in or around the selected element.');
        }
    } else {
        alert('Please select part of an SVG before using this bookmarklet.');
    }
})();