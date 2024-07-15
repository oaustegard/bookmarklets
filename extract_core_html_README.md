Here is a facts-only README for the bookmarklet:

```markdown
# Extract HTML Bookmarklet

## Description
This bookmarklet processes the current webpage, removes specific tags and attributes, and copies the cleaned HTML to the clipboard.

## Features
- Removes the following tags: `img`, `style`, `script`, `svg`, `video`, `iframe`, `object`, `embed`, `link`, `nav`, `menu`, `aside`
- Strips out `style` and `script` attributes from all elements
- Removes Tailwind CSS class names
- Removes `data-*` attributes except `data-id` and `data-class`
- Removes multiple line breaks

## Usage
1. Create a new bookmark in your browser.
2. Set the name to something meaningful like "Extract HTML".
3. Copy the code below and paste it into the URL or location field of the bookmark.
4. Save the bookmark.

## Bookmarklet Code
```javascript
javascript:(function() {
    function extractHTML() {
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
        let classNames = allElements[i].className.split(' ').filter(className => !tailwindClassPattern.test(className));
        allElements[i].className = classNames.join(' ');
  
        Array.from(allElements[i].attributes).forEach(attr => {
          if (attr.name.startsWith('data-') && attr.name !== 'data-id' && attr.name !== 'data-class') {
            allElements[i].removeAttribute(attr.name);
          }
        });
      }
  
      let html = clonedBody.outerHTML;
      html = html.replace(/\n\s*\n/g, '\n');
      return html;
    }
  
    async function copyToClipboard(html) {
      try {
        await navigator.clipboard.writeText(html);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  
    const extractedHTML = extractHTML();
    copyToClipboard(extractedHTML);
  })();
```

## License
This project is licensed under the MIT License.
```

This README provides a concise description of the bookmarklet, its features, usage instructions, the code itself, and licensing information.
