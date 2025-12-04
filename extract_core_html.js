javascript:(function() {
  /* @title: Extract Core HTML */
  /* @description: Extracts and copies core HTML content with scripts, styles, and Tailwind classes removed */
  function extractHTML() {
    try {
      let clonedBody = document.body.cloneNode(true);
      const tagsToRemove = ['img', 'style', 'script', 'svg', 'video', 'iframe', 'object', 'embed', 'link', 'nav', 'menu', 'aside'];
      tagsToRemove.forEach(tag => {
        const elements = clonedBody.getElementsByTagName(tag);
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });
      const allElements = clonedBody.getElementsByTagName('*');
      const tailwindClassPattern = /\b(?:sm:|md:|lg:|xl:|2xl:)?(?:m|p|mt|mr|mb|ml|mx|my|pt|pr|pb|pl|px|py|w|h|min-w|min-h|max-w|max-h|flex|grid|col|row|items|justify|gap|space|bg|text|font|leading|tracking|rounded|border|shadow|overflow|z|opacity|transition|duration|ease|delay|animate|pointer-events|select|align|order|inset|top|right|bottom|left|visible|invisible|hidden|block|inline|inline-block|inline-flex|table|table-row|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row-group|table-caption|sticky|relative|absolute|fixed|float|clear|object|overflow|scroll|scrollbar|snap|touch|resize|list|outline|decoration|appearance|cursor|pointer|caret|will-change|scale|rotate|translate|skew|origin|filter|backdrop-filter|mix-blend|bg-blend|isolation|content|sr-only|not-sr-only|aspect|space-y|space-x|space-reverse|divide-y|divide-x|divide-reverse|place-content|place-items|place-self|whitespace|break|hyphens|capitalize|lowercase|uppercase|first|last|even|odd|resize|grid-cols|grid-rows|col-span|row-span|auto-cols|auto-rows|gap|content|justify|grid-flow|col-start|col-end|row-start|row-end|sm|md|lg|xl|2xl|group|hover|focus|focus-within|focus-visible|active|visited|disabled|checked|required|aria|data|dark|motion|portrait|landscape|peer|empty|autoplay|controls|muted|loop|preload|data-([a-z]+))\b/g;

      for (let i = 0; i < allElements.length; i++) {
        allElements[i].removeAttribute('style');
        allElements[i].removeAttribute('script');
        
        if (allElements[i].className) {
          let classNames = allElements[i].className.split(' ').filter(className => !tailwindClassPattern.test(className));
          if (classNames.length > 0) {
            allElements[i].className = classNames.join(' ');
          } else {
            allElements[i].removeAttribute('class');
          }
        }

        Array.from(allElements[i].attributes).forEach(attr => {
          if (attr.name.startsWith('data-') && attr.name !== 'data-id' && attr.name !== 'data-class') {
            allElements[i].removeAttribute(attr.name);
          }
        });
      }

      let html = clonedBody.outerHTML;
      html = html.replace(/<!--[\s\S]*?-->/g, '');
      html = html.replace(/\n\s*\n/g, '\n');
      return html;
    } catch (error) {
      console.error('Error extracting HTML:', error);
      return null;
    }
  }

  async function copyToClipboard(html) {
    try {
      await navigator.clipboard.writeText(html);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy HTML content. Please check the console for details.');
    }
  }

  const extractedHTML = extractHTML();
  if (extractedHTML) {
    copyToClipboard(extractedHTML);
  } else {
    alert('Failed to extract HTML content. Please check the console for details.');
  }
})();