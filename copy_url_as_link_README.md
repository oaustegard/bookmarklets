# Overcoming Content Security Policy Challenges in Bookmarklet Development

Bookmarklets provide a powerful way to extend browser functionality with just a snippet of JavaScript. However, modern web security measures, particularly Content Security Policy (CSP), can throw a wrench in the works. In this post, we'll explore a recent bookmarklet refactoring journey, from an old bookmarklet's initial failures to successful implementation of an updated approach, and share some lessons learned along the way.

## Our old URL Link bookmarklet hits a CSP Roadblock

When attempting to share the news about Meta's release of [The Llama 3 Herd of Models](https://ai.meta.com/research/publications/the-llama-3-herd-of-models/), my [trusty old URL Link bookmarklet](https://github.com/oaustegard/bookmarklets/blob/main/copy_url.js) failed due to CSP restrictions:

```
TypeError: Failed to execute 'write' on 'Document': This document requires 'TrustedHTML' assignment.
```

Line 11 of the old bookmarklet is the culprit:
``` javascript
d.write(`<html><head><title>Create formatted link</title></head><body><form ... etc etc `);
```
The use of `document.write()` is restricted by CSP to prevent cross-site scripting (XSS) attacks.

## Refactoring Aide: Claude 3.5 Sonnet
As with almost all small coding exercises these days I turned to [Claude 3.5 Sonnet](https://claude.ai/), the best of breed (now maybe with a Llama 3.1 405B competitor?) LLM. The new [Projects](https://support.anthropic.com/en/articles/9517075-what-are-projects) and [Artifacts](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) features of Claude's UX are incredibly handy for this type of work; the Project feature allows me to create a system instruction specific for JavaScript and bookmarklet generation, and the Artifacts feature is just a nicely executed UI feature streamlining tracking of outputs (aka artifacts...)

As usual it was a _multistep_ process of trial and error, feedback and gradual improvement. I'll spare you the iterations, though will mention that the initial attempt to fix the CSP errors by replacing `document.write()` with `innerHTML` also failed CSP...
```javascript
d.body.innerHTML = '<form><table><tr><th>URL: </th><td><input id="url" type="text" size="100"></td></tr> etc etc';
```
```
Uncaught TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.
```

The key is not to give up, provide the error back to Claude and ask for a different approach.


## The Solution: Building the DOM Programmatically
Claude quickly came up with the key to overcoming these CSP restrictions: build the DOM programmatically using JavaScript methods that are allowed by CSP, work within the DOM and use `createElement`, `setAttribute` and `appendChild`. 

Here's a simplified version of the core of the working solution:

```javascript
javascript:(function() {
    var w = window.open('about:blank', '_blank', 'height=180,width=400');
    var d = w.document;
    
    function createElem(tag, props, parent) {
        var elem = d.createElement(tag);
        for (var key in props) {
            if (key === 'textContent') {
                elem.textContent = props[key];
            } else if (key === 'style') {
                elem.style.cssText = props[key];
            } else {
                elem.setAttribute(key, props[key]);
            }
        }
        if (parent) parent.appendChild(elem);
        return elem;
    }
    
    // Create elements using the createElem function
    var container = createElem('div', {style: 'padding: 10px;'}, d.body);
    var form = createElem('form', {}, container);
    createElem('label', {textContent: 'URL:'}, form);
    var urlInput = createElem('input', {id: 'url', type: 'text'}, form);
    createElem('label', {textContent: 'Link Title:'}, form);
    var titleInput = createElem('input', {id: 'title', type: 'text'}, form);
    var copyButton = createElem('button', {id: 'copy', textContent: 'Copy & Close'}, form);
    
    // Add event listeners and implement functionality
    // ... (copy functionality and event listeners go here)
})();
```

Again: use `createElement()`, `setAttribute()`, and `appendChild()` to build the DOM, which are allowed by CSP.

## Styling Refinements

After getting the basic functionality working, I wanted to improve the UI, so spent quite a bit of time working with Claude to update the CSS. Being able to take a screenshot and submit that back to Claude for it to see the result of its own work was handy -- the first iteration was fugly... 

In the end we created two versions:

1. A light theme with increased top margin to account for the browser's info bar eating into the whitespace.
2. A dark theme that matches the browser's info bar color to make it blend in more (In _MY_ Chrome this is #474747, your mileage may vary) -- the bar can't be removed.

Both versions use inline styles to avoid any external CSS dependencies, ensuring the bookmarklet remains self-contained and CSP-compliant.

## Key Takeaways

1. **Avoid `document.write()` and `innerHTML`**: These methods are often restricted by CSP.
2. **Build DOM programmatically**: Use methods like `createElement()`, `setAttribute()`, and `appendChild()`.
3. **Use inline styles**: Avoid external CSS dependencies to keep the bookmarklet self-contained.
4. **Consider browser chrome**: Account for elements like the security info bar in your design.
5. **Provide options**: Different themes can cater to various user preferences and environments.

## Conclusion

Developing CSP-compliant bookmarklets requires a good understanding of web security measures and creative problem-solving. By building the DOM programmatically and using inline styles, we can create powerful, self-contained tools that work across a wide range of websites, regardless of their security policies.

Remember, the web security landscape is constantly evolving, so always test your bookmarklets thoroughly and be prepared to adapt your approach as new security measures emerge.

Happy bookmarklet coding!

## Final Code

### [Light version](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_light.js)
``` javascript
javascript:(function() {
    var loc = window.location;
    var page_title = window.document.title;
    var w = window.open('about:blank', '_blank', 'height=200,width=400');
    w.document.title = 'Create Formatted Link';
    var d = w.document;
    function createElem(tag, props, parent) {
        var elem = d.createElement(tag);
        for (var key in props) {
            if (key === 'textContent') elem.textContent = props[key];
            else elem.setAttribute(key, props[key]);
        }
        if (parent) parent.appendChild(elem);
        return elem;
    }
    var css = d.createElement('style');
    css.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 10px; box-sizing: border-box; overflow: hidden; }
        .container { background-color: white; padding: 10px; max-width: 380px; margin: 20px auto 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 2px; color: #4b5563; }
        input { width: 100%; padding: 5px 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; }
        button { background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.3s; display: block; width: 100%; margin-top: 5px; }
        button:hover { background-color: #2563eb; }
        button:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }
    `;
    d.head.appendChild(css);
    var container = createElem('div', {class: 'container'}, d.body);
    var form = createElem('form', {}, container);
    createElem('label', {textContent: 'URL:'}, form);
    var urlInput = createElem('input', {id: 'url', type: 'text'}, form);
    createElem('label', {textContent: 'Link Title:'}, form);
    var titleInput = createElem('input', {id: 'title', type: 'text'}, form);
    var copyButton = createElem('button', {id: 'copy', textContent: 'Copy & Close'}, form);
    urlInput.value = loc.toString();
    titleInput.value = page_title;
    function copyToClip(doc, html, text) {
        text = text || html;
        var listener = function(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        };
        doc.addEventListener("copy", listener);
        doc.execCommand("copy");
        doc.removeEventListener("copy", listener);
    }
    copyButton.addEventListener("click", function(event) {
        event.preventDefault();
        var e = d.createElement("a");
        e.href = urlInput.value;
        e.textContent = titleInput.value;
        var mdlink = "[" + titleInput.value + "](" + urlInput.value + ")";
        copyToClip(d, e.outerHTML, mdlink);
        w.close();
    });
    copyButton.focus();
})();
```

### [Dark version](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_dark.js)
``` javascript
javascript:(function() {
    var loc = window.location;
    var page_title = window.document.title;
    var w = window.open('about:blank', '_blank', 'height=190,width=400');
    w.document.title = 'Create Formatted Link';
    var d = w.document;
    function createElem(tag, props, parent) {
        var elem = d.createElement(tag);
        for (var key in props) {
            if (key === 'textContent') elem.textContent = props[key];
            else elem.setAttribute(key, props[key]);
        }
        if (parent) parent.appendChild(elem);
        return elem;
    }
    var css = d.createElement('style');
    css.textContent = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #474747; margin: 0; padding: 10px; box-sizing: border-box; overflow: hidden; }
        .container { background-color: #474747; padding: 10px; max-width: 380px; margin: 10px auto 0; }
        label { display: block; font-size: 12px; font-weight: 500; margin-bottom: 2px; color: #ffffff; }
        input { width: 100%; padding: 5px 8px; border: 1px solid #6b6b6b; border-radius: 4px; font-size: 14px; margin-bottom: 8px; box-sizing: border-box; background-color: #3c3c3c; color: #ffffff; }
        button { background-color: #3b82f6; color: white; padding: 8px 12px; border: none; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.3s; display: block; width: 100%; margin-top: 5px; }
        button:hover { background-color: #2563eb; }
        button:focus { outline: 2px solid #60a5fa; outline-offset: 2px; }
    `;
    d.head.appendChild(css);
    var container = createElem('div', {class: 'container'}, d.body);
    var form = createElem('form', {}, container);
    createElem('label', {textContent: 'URL:'}, form);
    var urlInput = createElem('input', {id: 'url', type: 'text'}, form);
    createElem('label', {textContent: 'Link Title:'}, form);
    var titleInput = createElem('input', {id: 'title', type: 'text'}, form);
    var copyButton = createElem('button', {id: 'copy', textContent: 'Copy & Close'}, form);
    urlInput.value = loc.toString();
    titleInput.value = page_title;
    function copyToClip(doc, html, text) {
        text = text || html;
        var listener = function(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        };
        doc.addEventListener("copy", listener);
        doc.execCommand("copy");
        doc.removeEventListener("copy", listener);
    }
    copyButton.addEventListener("click", function(event) {
        event.preventDefault();
        var e = d.createElement("a");
        e.href = urlInput.value;
        e.textContent = titleInput.value;
        var mdlink = "[" + titleInput.value + "](" + urlInput.value + ")";
        copyToClip(d, e.outerHTML, mdlink);
        w.close();
    });
    copyButton.focus();
})();
```
## "Installation" Instructions
1. Copy the entire code above.
2. Create a new bookmark in your browser.
3. In the URL field of the bookmark, paste the copied code.
4. Save the bookmark.
5. Navigate to any web page.
6. Click the bookmarklet to execute the script.
7. Edit url or link text as desired
8. Copy and Close
9. Paste either as rich text or markdown, depending on the destination's capabilities