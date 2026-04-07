javascript:(function() {
  /* @title: Mobile Web Clipper */
  /* @description: Smart content extraction to markdown, copies to clipboard. No external dependencies. */

  try {

  /* === CONTENT SCORING === */
  /* Find the DOM node most likely to be the article content */

  var BLOCK_TAGS = {
    'ADDRESS':1,'ARTICLE':1,'ASIDE':1,'BLOCKQUOTE':1,'DD':1,'DIV':1,
    'DL':1,'DT':1,'FIELDSET':1,'FIGCAPTION':1,'FIGURE':1,'FOOTER':1,
    'FORM':1,'H1':1,'H2':1,'H3':1,'H4':1,'H5':1,'H6':1,'HEADER':1,
    'HGROUP':1,'HR':1,'LI':1,'MAIN':1,'NAV':1,'OL':1,'P':1,'PRE':1,
    'SECTION':1,'TABLE':1,'UL':1
  };

  var NOISE_TAGS = {
    'SCRIPT':1,'STYLE':1,'NOSCRIPT':1,'SVG':1,'IFRAME':1,
    'FORM':1,'INPUT':1,'BUTTON':1,'SELECT':1,'TEXTAREA':1
  };

  /* class/id substrings that signal non-content */
  var NOISE_WORDS = [
    'nav','menu','sidebar','footer','header','social','share','comment',
    'related','advertisement','ad-','advert','promo','popup','modal',
    'cookie','banner','signup','newsletter','widget','tool','utility',
    'breadcrumb','pagination','search','login','auth'
  ];

  /* class/id substrings that signal content */
  var CONTENT_WORDS = [
    'article','post','entry','content','story','body','text','prose',
    'main-content','post-content','article-body','entry-content',
    'story-body','rich-text','markdown'
  ];

  function hasNoiseSignal(el) {
    var id = (el.id || '').toLowerCase();
    var cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    var role = (el.getAttribute('role') || '').toLowerCase();
    if (role === 'navigation' || role === 'banner' || role === 'complementary' ||
        role === 'contentinfo' || role === 'search') return true;
    for (var i = 0; i < NOISE_WORDS.length; i++) {
      if (id.indexOf(NOISE_WORDS[i]) !== -1 || cls.indexOf(NOISE_WORDS[i]) !== -1) return true;
    }
    return false;
  }

  function hasContentSignal(el) {
    var id = (el.id || '').toLowerCase();
    var cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
    var role = (el.getAttribute('role') || '').toLowerCase();
    var tag = el.tagName;
    if (tag === 'ARTICLE' || tag === 'MAIN') return true;
    if (role === 'article' || role === 'main') return true;
    for (var i = 0; i < CONTENT_WORDS.length; i++) {
      if (id.indexOf(CONTENT_WORDS[i]) !== -1 || cls.indexOf(CONTENT_WORDS[i]) !== -1) return true;
    }
    return false;
  }

  function textLen(el) {
    return (el.textContent || '').trim().length;
  }

  function linkDensity(el) {
    var total = textLen(el);
    if (total === 0) return 1;
    var linkText = 0;
    var links = el.getElementsByTagName('A');
    for (var i = 0; i < links.length; i++) linkText += textLen(links[i]);
    return linkText / total;
  }

  function scoreNode(el) {
    if (NOISE_TAGS[el.tagName]) return -1000;
    if (hasNoiseSignal(el)) return -500;

    var score = 0;
    var txt = textLen(el);

    /* text length is the primary signal */
    score += Math.min(txt / 10, 300);

    /* paragraph density — real articles have <p> tags */
    var paras = el.getElementsByTagName('P');
    var paraTextLen = 0;
    for (var i = 0; i < paras.length; i++) paraTextLen += textLen(paras[i]);
    score += paras.length * 10;
    score += Math.min(paraTextLen / 5, 200);

    /* headings inside suggest article structure */
    var headings = el.querySelectorAll('h1,h2,h3,h4,h5,h6');
    score += Math.min(headings.length * 15, 60);

    /* link-heavy nodes are usually navigation */
    var ld = linkDensity(el);
    score *= (1 - ld);

    /* content signals from class/id/role */
    if (hasContentSignal(el)) score += 200;

    /* penalize very short nodes */
    if (txt < 100) score -= 50;

    /* penalize the whole body — prefer a child */
    if (el.tagName === 'BODY') score -= 100;

    /* penalize deeply nested content-signal-less divs less than semantic elements */
    if (el.tagName === 'DIV' && !hasContentSignal(el)) score -= 10;

    return score;
  }

  function findContentNode() {
    /* collect all block-level candidates */
    var candidates = [];
    var all = document.querySelectorAll('article, main, [role="article"], [role="main"], section, div, .post, .entry, .content, .story');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (textLen(el) < 50) continue;
      candidates.push({ el: el, score: scoreNode(el) });
    }

    /* always include body as fallback */
    candidates.push({ el: document.body, score: scoreNode(document.body) });

    /* sort by score descending */
    candidates.sort(function(a, b) { return b.score - a.score; });

    console.log('[Clipper] Top candidates:', candidates.slice(0, 5).map(function(c) {
      return c.el.tagName + (c.el.id ? '#' + c.el.id : '') +
        (c.el.className ? '.' + (typeof c.el.className === 'string' ? c.el.className.split(' ')[0] : '') : '') +
        ' → ' + c.score.toFixed(0);
    }));

    /* if top candidate contains the second, prefer the top */
    /* if second is a child of top and scores similarly, prefer the child (more specific) */
    if (candidates.length > 1) {
      var top = candidates[0];
      var second = candidates[1];
      if (top.el.contains(second.el) && second.score > top.score * 0.6) {
        /* the child is nearly as good — prefer specificity */
        return second.el;
      }
    }

    return candidates[0].el;
  }

  /* === DOM → MARKDOWN WALKER === */

  function walk(node, ctx) {
    if (!node) return '';
    var out = '';

    if (node.nodeType === 3) {
      /* text node */
      var t = node.textContent;
      if (!ctx.pre) t = t.replace(/\s+/g, ' ');
      return t;
    }

    if (node.nodeType !== 1) return '';

    var tag = node.tagName;

    /* skip noise */
    if (NOISE_TAGS[tag]) return '';
    if (hasNoiseSignal(node)) return '';

    /* headings */
    if (/^H[1-6]$/.test(tag)) {
      var level = parseInt(tag.charAt(1), 10);
      var hashes = '';
      for (var h = 0; h < level; h++) hashes += '#';
      var hText = innerText(node).trim();
      if (hText) return '\n\n' + hashes + ' ' + hText + '\n\n';
      return '';
    }

    /* paragraph */
    if (tag === 'P') {
      var pContent = walkChildren(node, ctx).trim();
      if (pContent) return '\n\n' + pContent + '\n\n';
      return '';
    }

    /* blockquote */
    if (tag === 'BLOCKQUOTE') {
      var bq = walkChildren(node, ctx).trim();
      if (bq) return '\n\n' + bq.split('\n').map(function(line) { return '> ' + line; }).join('\n') + '\n\n';
      return '';
    }

    /* pre/code blocks */
    if (tag === 'PRE') {
      var code = node.querySelector('code');
      var lang = '';
      if (code) {
        var cls = code.getAttribute('class') || '';
        var langMatch = cls.match(/language-(\S+)/);
        if (langMatch) lang = langMatch[1];
      }
      var preText = (code || node).textContent;
      return '\n\n```' + lang + '\n' + preText + '\n```\n\n';
    }

    /* inline code */
    if (tag === 'CODE' && node.parentNode.tagName !== 'PRE') {
      return '`' + node.textContent + '`';
    }

    /* links — the key requirement */
    if (tag === 'A') {
      var href = node.getAttribute('href') || '';
      var linkText = walkChildren(node, ctx).trim();
      if (!linkText) linkText = href;
      if (!href || href === '#') return linkText;
      /* resolve relative URLs */
      try { href = new URL(href, document.baseURI).href; } catch(e) { /* keep as-is */ }
      return '[' + linkText + '](' + href + ')';
    }

    /* images — alt text is the key requirement */
    if (tag === 'IMG') {
      var alt = node.getAttribute('alt') || '';
      var src = node.getAttribute('src') || '';
      if (src) {
        try { src = new URL(src, document.baseURI).href; } catch(e) { /* keep as-is */ }
      }
      if (alt || src) return '![' + alt + '](' + src + ')';
      return '';
    }

    /* lists */
    if (tag === 'UL' || tag === 'OL') {
      var items = node.children;
      var listOut = '\n';
      for (var li = 0; li < items.length; li++) {
        if (items[li].tagName !== 'LI') continue;
        var liContent = walkChildren(items[li], ctx).trim();
        if (!liContent) continue;
        var bullet = tag === 'OL' ? (li + 1) + '. ' : '- ';
        listOut += bullet + liContent.replace(/\n/g, '\n  ') + '\n';
      }
      return '\n' + listOut + '\n';
    }
    if (tag === 'LI') {
      /* handled by parent UL/OL, but in case we encounter orphan LI */
      return '- ' + walkChildren(node, ctx).trim() + '\n';
    }

    /* bold / italic */
    if (tag === 'STRONG' || tag === 'B') {
      var bold = walkChildren(node, ctx).trim();
      return bold ? '**' + bold + '**' : '';
    }
    if (tag === 'EM' || tag === 'I') {
      var em = walkChildren(node, ctx).trim();
      return em ? '*' + em + '*' : '';
    }

    /* line break */
    if (tag === 'BR') return '\n';

    /* horizontal rule */
    if (tag === 'HR') return '\n\n---\n\n';

    /* figure with figcaption */
    if (tag === 'FIGURE') {
      var figContent = walkChildren(node, ctx);
      return '\n\n' + figContent.trim() + '\n\n';
    }
    if (tag === 'FIGCAPTION') {
      var cap = walkChildren(node, ctx).trim();
      return cap ? '\n*' + cap + '*\n' : '';
    }

    /* table — simple text extraction */
    if (tag === 'TABLE') {
      return '\n\n' + extractTable(node) + '\n\n';
    }

    /* block-level elements get newlines */
    if (BLOCK_TAGS[tag]) {
      var blockContent = walkChildren(node, ctx);
      return '\n' + blockContent + '\n';
    }

    /* everything else: just walk children */
    return walkChildren(node, ctx);
  }

  function walkChildren(node, ctx) {
    var out = '';
    var child = node.firstChild;
    while (child) {
      out += walk(child, ctx);
      child = child.nextSibling;
    }
    return out;
  }

  function innerText(node) {
    /* get text content but respect inline structure */
    return walkChildren(node, {}).replace(/<[^>]+>/g, '');
  }

  /* simple table → markdown table */
  function extractTable(table) {
    var rows = table.querySelectorAll('tr');
    if (!rows.length) return '';
    var md = '';
    var isFirst = true;
    for (var r = 0; r < rows.length; r++) {
      var cells = rows[r].querySelectorAll('th, td');
      var row = '|';
      for (var c = 0; c < cells.length; c++) {
        row += ' ' + walkChildren(cells[c], {}).trim().replace(/\|/g, '\\|').replace(/\n/g, ' ') + ' |';
      }
      md += row + '\n';
      if (isFirst) {
        var sep = '|';
        for (var s = 0; s < cells.length; s++) sep += ' --- |';
        md += sep + '\n';
        isFirst = false;
      }
    }
    return md;
  }

  /* === TITLE EXTRACTION === */

  function getTitle() {
    var og = document.querySelector('meta[property="og:title"]');
    if (og && og.content) return og.content.trim();
    var h1 = document.querySelector('article h1, main h1, h1');
    if (h1 && h1.textContent.trim().length > 0 && h1.textContent.trim().length < 200) {
      return h1.textContent.trim();
    }
    return document.title || 'Untitled';
  }

  /* === CLEAN UP === */

  function cleanMarkdown(md) {
    /* collapse excessive newlines */
    md = md.replace(/\n{3,}/g, '\n\n');
    /* trim lines */
    md = md.split('\n').map(function(l) { return l.trimEnd(); }).join('\n');
    /* remove leading/trailing whitespace */
    md = md.trim();
    return md;
  }

  /* === MAIN === */

  var contentNode = findContentNode();

  /* clone so we don't mutate the page */
  var clone = contentNode.cloneNode(true);

  /* strip noise elements from clone */
  var strip = clone.querySelectorAll('script, style, noscript, svg, iframe, [aria-hidden="true"]');
  for (var i = 0; i < strip.length; i++) strip[i].remove();

  /* strip elements with noise class/id signals */
  var allEls = clone.querySelectorAll('*');
  for (var j = 0; j < allEls.length; j++) {
    if (hasNoiseSignal(allEls[j])) allEls[j].remove();
  }

  var title = getTitle();
  var url = location.href;
  var body = walkChildren(clone, {});
  var md = cleanMarkdown(body);

  /* prepend header */
  var header = '# ' + title + '\n\n';
  header += '> **Source:** [' + (location.hostname || url) + '](' + url + ')\n\n---\n\n';
  md = header + md;

  function showToast(msg, bg) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
      'background:' + bg + ';color:#fff;padding:12px 24px;border-radius:24px;' +
      'font:600 15px/1.2 -apple-system,system-ui,sans-serif;z-index:2147483647;' +
      'box-shadow:0 4px 12px rgba(0,0,0,.3);pointer-events:none;' +
      'transition:opacity .4s;opacity:1';
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 500);
    }, 2000);
  }

  console.log('[Clipper] Extracted ' + md.length + ' chars from <' +
    contentNode.tagName + (contentNode.id ? '#' + contentNode.id : '') + '>');

  if (!md || md.length < 20) {
    showToast('✗ No content found', '#ef4444');
    return;
  }

  /* === CLIPBOARD (sync execCommand — works in iOS Safari bookmarklets) === */

  function copyToClip(text) {
    function listener(e) {
      e.clipboardData.setData('text/plain', text);
      e.preventDefault();
    }
    document.addEventListener('copy', listener);
    var ok = document.execCommand('copy');
    document.removeEventListener('copy', listener);
    return ok;
  }

  var copied = copyToClip(md);
  if (copied) {
    showToast('✓ Clipped! (' + md.length + ' chars)', '#22c55e');
  } else {
    console.warn('[Clipper] execCommand failed, trying clipboard API');
    navigator.clipboard.writeText(md).then(function() {
      showToast('✓ Clipped! (' + md.length + ' chars)', '#22c55e');
    }).catch(function(err) {
      showToast('✗ Copy failed — ' + md.length + ' chars in console', '#ef4444');
      console.log('[Clipper] OUTPUT:\n' + md);
    });
  }

  } catch(err) {
    console.error('[Clipper] Error:', err);
    alert('Clipper error: ' + err.message);
  }

})();
