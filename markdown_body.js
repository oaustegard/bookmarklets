javascript:(function(){
    document.body.appendChild(Object.assign(document.createElement('script'), { textContent: 'window._lg = function(msg) { console.log(msg); }' }));
    var TurndownService=function(){"use strict";function e(e,n){return Array(n+1).join(e)}var n,t=["ADDRESS","ARTICLE","ASIDE","AUDIO","BLOCKQUOTE","BODY","CANVAS","CENTER","DD","DIR","DIV","DL","DT","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","FRAMESET","H1","H2","H3","H4","H5","H6","HEADER","HGROUP","HR","HTML","ISINDEX","LI","MAIN","MENU","NAV","NOFRAMES","NOSCRIPT","OL","OUTPUT","P","PRE","SECTION","TABLE","TBODY","TD","TFOOT","TH","THEAD","TR","UL"];function r(e){return l(e,t)}var i=["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"];function o(e){return l(e,i)}var a=["A","TABLE","THEAD","TBODY","TFOOT","TH","TD","IFRAME","SCRIPT","AUDIO","VIDEO"];function l(e,n){return n.indexOf(e.nodeName)>=0}function u(e,n){return e.getElementsByTagName&&n.some(function(n){return e.getElementsByTagName(n).length})}var c={};function s(e){return e?e.replace(/(\n+\s*)+/g,"\n"):""}function f(e){for(var n in this.options=e,this._keep=[],this._remove=[],this.blankRule={replacement:e.blankReplacement},this.keepReplacement=e.keepReplacement,this.defaultRule={replacement:e.defaultReplacement},this.array=[],e.rules)this.array.push(e.rules[n])}function d(e,n,t){for(var r=0;r<e.length;r++){var i=e[r];if(p(i,n,t))return i}}function p(e,n,t){var r=e.filter;if("string"==typeof r){if(r===n.nodeName.toLowerCase())return!0}else if(Array.isArray(r)){if(r.indexOf(n.nodeName.toLowerCase())>-1)return!0}else if("function"==typeof r){if(r.call(e,n,t))return!0}else throw TypeError("`filter` needs to be a string, array, or function")}function h(e){var n=e.nextSibling||e.parentNode;return e.parentNode.removeChild(e),n}function g(e,n,t){return e&&e.parentNode===n||t(n)?n.nextSibling||n.parentNode:n.firstChild||n.nextSibling||n.parentNode}c.paragraph={filter:"p",replacement:function(e){return"\n\n"+e+"\n\n"}},c.lineBreak={filter:"br",replacement:function(e,n,t){return t.br+"\n"}},c.heading={filter:["h1","h2","h3","h4","h5","h6"],replacement:function(n,t,r){var i=Number(t.nodeName.charAt(1));if("setext"!==r.headingStyle||!(i<3))return"\n\n"+e("#",i)+" "+n+"\n\n";var o=e(1===i?"=":"-",n.length);return"\n\n"+n+"\n"+o+"\n\n"}},c.blockquote={filter:"blockquote",replacement:function(e){return"\n\n"+(e=(e=e.replace(/^\n+|\n+$/g,"")).replace(/^/gm,"> "))+"\n\n"}},c.list={filter:["ul","ol"],replacement:function(e,n){var t=n.parentNode;return"LI"===t.nodeName&&t.lastElementChild===n?"\n"+e:"\n\n"+e+"\n\n"}},c.listItem={filter:"li",replacement:function(e,n,t){e=e.replace(/^\n+/,"").replace(/\n+$/,"\n").replace(/\n/gm,"\n    ");var r=t.bulletListMarker+"   ",i=n.parentNode;if("OL"===i.nodeName){var o=i.getAttribute("start"),a=Array.prototype.indexOf.call(i.children,n);r=(o?Number(o)+a:a+1)+".  "}return r+e+(n.nextSibling&&!/\n$/.test(e)?"\n":"")}},c.indentedCodeBlock={filter:function(e,n){return"indented"===n.codeBlockStyle&&"PRE"===e.nodeName&&e.firstChild&&"CODE"===e.firstChild.nodeName},replacement:function(e,n,t){return"\n\n    "+n.firstChild.textContent.replace(/\n/g,"\n    ")+"\n\n"}},c.fencedCodeBlock={filter:function(e,n){return"fenced"===n.codeBlockStyle&&"PRE"===e.nodeName&&e.firstChild&&"CODE"===e.firstChild.nodeName},replacement:function(n,t,r){for(var i,o=((t.firstChild.getAttribute("class")||"").match(/language-(\S+)/)||[null,""])[1],a=t.firstChild.textContent,l=r.fence.charAt(0),u=3,c=RegExp("^"+l+"{3,}","gm");i=c.exec(a);)i[0].length>=u&&(u=i[0].length+1);var s=e(l,u);return"\n\n"+s+o+"\n"+a.replace(/\n$/,"")+"\n"+s+"\n\n"}},c.horizontalRule={filter:"hr",replacement:function(e,n,t){return"\n\n"+t.hr+"\n\n"}},c.inlineLink={filter:function(e,n){return"inlined"===n.linkStyle&&"A"===e.nodeName&&e.getAttribute("href")},replacement:function(e,n){var t=n.getAttribute("href"),r=s(n.getAttribute("title"));return r&&(r=' "'+r+'"'),"["+e+"]("+t+r+")"}},c.referenceLink={filter:function(e,n){return"referenced"===n.linkStyle&&"A"===e.nodeName&&e.getAttribute("href")},replacement:function(e,n,t){var r,i,o=n.getAttribute("href"),a=s(n.getAttribute("title"));switch(a&&(a=' "'+a+'"'),t.linkReferenceStyle){case"collapsed":r="["+e+"][]",i="["+e+"]: "+o+a;break;case"shortcut":r="["+e+"]",i="["+e+"]: "+o+a;break;default:var l=this.references.length+1;r="["+e+"]["+l+"]",i="["+l+"]: "+o+a}return this.references.push(i),r},references:[],append:function(e){var n="";return this.references.length&&(n="\n\n"+this.references.join("\n")+"\n\n",this.references=[]),n}},c.emphasis={filter:["em","i"],replacement:function(e,n,t){return e.trim()?t.emDelimiter+e+t.emDelimiter:""}},c.strong={filter:["strong","b"],replacement:function(e,n,t){return e.trim()?t.strongDelimiter+e+t.strongDelimiter:""}},c.code={filter:function(e){var n=e.previousSibling||e.nextSibling,t="PRE"===e.parentNode.nodeName&&!n;return"CODE"===e.nodeName&&!t},replacement:function(e){if(!e)return"";e=e.replace(/\r?\n|\r/g," ");for(var n=/^`|^ .*?[^ ].* $|`$/.test(e)?" ":"",t="`",r=e.match(/`+/gm)||[];-1!==r.indexOf(t);)t+="`";return t+n+e+n+t}},c.image={filter:"img",replacement:function(e,n){var t=s(n.getAttribute("alt")),r=n.getAttribute("src")||"",i=s(n.getAttribute("title"));return r?"!["+t+"]("+r+(i?' "'+i+'"':"")+")":""}},f.prototype={add:function(e,n){this.array.unshift(n)},keep:function(e){this._keep.unshift({filter:e,replacement:this.keepReplacement})},remove:function(e){this._remove.unshift({filter:e,replacement:function(){return""}})},forNode:function(e){var n;return e.isBlank?this.blankRule:(n=d(this.array,e,this.options))||(n=d(this._keep,e,this.options))||(n=d(this._remove,e,this.options))?n:this.defaultRule},forEach:function(e){for(var n=0;n<this.array.length;n++)e(this.array[n],n)}};var m,v="undefined"!=typeof window?window:{},A=!function e(){var n=v.DOMParser,t=!1;try{new n().parseFromString("","text/html")&&(t=!0)}catch(r){}return t}()?(m=function(){},!function e(){var n=!1;try{document.implementation.createHTMLDocument("").open()}catch(t){window.ActiveXObject&&(n=!0)}return n}()?m.prototype.parseFromString=function(e){var n=document.implementation.createHTMLDocument("");return n.open(),n.write(e),n.close(),n}:m.prototype.parseFromString=function(e){var n=new window.ActiveXObject("htmlfile");return n.designMode="on",n.open(),n.write(e),n.close(),n},m):v.DOMParser;function N(e,t){var i;return!function e(n){var t=n.element,r=n.isBlock,i=n.isVoid,o=n.isPre||function(e){return"PRE"===e.nodeName};if(!(!t.firstChild||o(t))){for(var a=null,l=!1,u=null,c=g(u,t,o);c!==t;){if(3===c.nodeType||4===c.nodeType){var s=c.data.replace(/[ \r\n\t]+/g," ");if((!a||/ $/.test(a.data))&&!l&&" "===s[0]&&(s=s.substr(1)),!s){c=h(c);continue}c.data=s,a=c}else if(1===c.nodeType)r(c)||"BR"===c.nodeName?(a&&(a.data=a.data.replace(/ $/,"")),a=null,l=!1):i(c)||o(c)?(a=null,l=!0):a&&(l=!1);else{c=h(c);continue}var f=g(u,c,o);u=c,c=f}a&&(a.data=a.data.replace(/ $/,""),a.data||h(a))}}({element:i="string"==typeof e?(n=n||new A).parseFromString('<x-turndown id="turndown-root">'+e+"</x-turndown>","text/html").getElementById("turndown-root"):e.cloneNode(!0),isBlock:r,isVoid:o,isPre:t.preformattedCode?y:null}),i}function y(e){return"PRE"===e.nodeName||"CODE"===e.nodeName}function E(e,n){var t,c,s,f;return e.isBlock=r(e),e.isCode="CODE"===e.nodeName||e.parentNode.isCode,e.isBlank=(t=e,!o(t)&&!l(c=t,a)&&/^\s*$/i.test(t.textContent)&&!u(s=t,i)&&!u(f=t,a)),e.flankingWhitespace=function e(n,t){if(n.isBlock||t.preformattedCode&&n.isCode)return{leading:"",trailing:""};var r,i,o=(r=n.textContent,i=r.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/),{leading:i[1],leadingAscii:i[2],leadingNonAscii:i[3],trailing:i[4],trailingNonAscii:i[5],trailingAscii:i[6]});return o.leadingAscii&&T("left",n,t)&&(o.leading=o.leadingNonAscii),o.trailingAscii&&T("right",n,t)&&(o.trailing=o.trailingNonAscii),{leading:o.leading,trailing:o.trailing}}(e,n),e}function T(e,n,t){var i,o,a;return"left"===e?(i=n.previousSibling,o=/ $/):(i=n.nextSibling,o=/^ /),i&&(3===i.nodeType?a=o.test(i.nodeValue):t.preformattedCode&&"CODE"===i.nodeName?a=!1:1!==i.nodeType||r(i)||(a=o.test(i.textContent))),a}var C=Array.prototype.reduce,R=[[/\\/g,"\\\\"],[/\*/g,"\\*"],[/^-/g,"\\-"],[/^\+ /g,"\\+ "],[/^(=+)/g,"\\$1"],[/^(#{1,6}) /g,"\\$1 "],[/`/g,"\\`"],[/^~~~/g,"\\~~~"],[/\[/g,"\\["],[/\]/g,"\\]"],[/^>/g,"\\>"],[/_/g,"\\_"],[/^(\d+)\. /g,"$1\\. "]];function k(e){if(!(this instanceof k))return new k(e);this.options=function e(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)r.hasOwnProperty(i)&&(n[i]=r[i])}return n}({},{rules:c,headingStyle:"setext",hr:"* * *",bulletListMarker:"*",codeBlockStyle:"indented",fence:"```",emDelimiter:"_",strongDelimiter:"**",linkStyle:"inlined",linkReferenceStyle:"full",br:"  ",preformattedCode:!1,blankReplacement:function(e,n){return n.isBlock?"\n\n":""},keepReplacement:function(e,n){return n.isBlock?"\n\n"+n.outerHTML+"\n\n":n.outerHTML},defaultReplacement:function(e,n){return n.isBlock?"\n\n"+e+"\n\n":e}},e),this.rules=new f(this.options)}function O(e){var n=this;return C.call(e.childNodes,function(e,t){t=new E(t,n.options);var r="";return 3===t.nodeType?r=t.isCode?t.nodeValue:n.escape(t.nodeValue):1===t.nodeType&&(r=D.call(n,t)),S(e,r)},"")}function b(e){var n=this;return this.rules.forEach(function(t){"function"==typeof t.append&&(e=S(e,t.append(n.options)))}),e.replace(/^[\t\r\n]+/,"").replace(/[\t\r\n\s]+$/,"")}function D(e){var n=this.rules.forNode(e),t=O.call(this,e),r=e.flankingWhitespace;return(r.leading||r.trailing)&&(t=t.trim()),r.leading+n.replacement(t,e,this.options)+r.trailing}function S(e,n){var t,r=function e(n){for(var t=n.length;t>0&&"\n"===n[t-1];)t--;return n.substring(0,t)}(e),i=(t=n).replace(/^\n*/,""),o=Math.max(e.length-r.length,n.length-i.length);return r+"\n\n".substring(0,o)+i}return k.prototype={turndown:function(e){if(n=e,null==n||"string"!=typeof n&&(!n.nodeType||1!==n.nodeType&&9!==n.nodeType&&11!==n.nodeType))throw TypeError(e+" is not a string, or an element/document/fragment node.");if(""===e)return"";var n,t=O.call(this,new N(e,this.options));return b.call(this,t)},use:function(e){if(Array.isArray(e))for(var n=0;n<e.length;n++)this.use(e[n]);else if("function"==typeof e)e(this);else throw TypeError("plugin must be a Function or an Array of Functions");return this},addRule:function(e,n){return this.rules.add(e,n),this},keep:function(e){return this.rules.keep(e),this},remove:function(e){return this.rules.remove(e),this},escape:function(e){return R.reduce(function(e,n){return e.replace(n[0],n[1])},e)}},k}();
    var td = new TurndownService();
    _lg('Turndown loaded');

    function mainEl() {
        var qs = document.querySelector.bind(document);
        var el = qs('main') || qs('article') || qs('.post-content') || qs('.main-content') || qs('.content') || qs('body');
        _lg('Main element: ' + el);
        return el;
    }

    function rmEls(root) {
        var excludeWords = ['footer', 'social', 'nav', 'sidebar', 'advertisement', 'header', 'related', 'utility', 'tool', 'script', 'style'];
        var allEls = root.querySelectorAll('*');
        var elsToRemove = [];
    
        Array.from(allEls).forEach(function(el) {
            if(el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'SVG' || el.innerHTML.startsWith('data:image')){
                elsToRemove.push(el);
            } else {
                var id = (el.id && typeof el.id === 'string') ? el.id.toLowerCase() : '';
                var cls = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
            
                if (excludeWords.some(function(word) {
                    return id.includes(word) || cls.includes(word);
                })) {
                    elsToRemove.push(el);
                }
            }
        });
    
        elsToRemove.forEach(function(el) {
            el.remove();
        });
    }

    function copyToClip(doc, html, text = null) {
        function listener(e) {
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text || html);
            e.preventDefault();
        }
        doc.addEventListener("copy", listener);
        doc.execCommand("copy");
        doc.removeEventListener("copy", listener);
    }
    

    _lg('Starting');
    var main = mainEl();
    if (main) {
        _lg('Main found');
        /* clone and process the node */
        var clone = main.cloneNode(true);
        rmEls(clone);
        var md = td.turndown(clone.innerHTML);
        _lg('Markdown length: ' + md.length);
        
        copyToClip(document, '', md);

        var w = window.open("", "_blank");
        w.document.write("<pre>" + md + "</pre>");
        w.document.close();
    } else {
        _lg('Main not found');
    }
})();
