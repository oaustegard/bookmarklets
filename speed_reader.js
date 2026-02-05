javascript:
/* @title: Speed Reader */
/* @description: RSVP speed reading with centered focus character - displays one word at a time */
(function() {
    /* Extract main content element */
    function mainEl() {
        var qs = document.querySelector.bind(document);
        return qs('main') || qs('article') || qs('.post-content') || qs('.main-content') || qs('.content') || qs('body');
    }

    /* Remove unwanted elements from clone */
    function rmEls(root) {
        var excludeWords = ['footer', 'social', 'nav', 'sidebar', 'advertisement', 'header', 'related', 'utility', 'tool', 'script', 'style', 'comment'];
        var allEls = root.querySelectorAll('*');
        var elsToRemove = [];

        Array.from(allEls).forEach(function(el) {
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'SVG' || el.tagName === 'NOSCRIPT') {
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

    /* Parse content into word tokens with structure markers */
    function parseContent(root) {
        var tokens = [];
        var headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

        function processNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                var text = node.textContent.trim();
                if (text) {
                    var words = text.split(/\s+/).filter(function(w) { return w.length > 0; });
                    words.forEach(function(word) {
                        tokens.push({ type: 'word', text: word });
                    });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                var tag = node.tagName;

                /* Add heading marker */
                if (headingTags.includes(tag)) {
                    var level = parseInt(tag.charAt(1));
                    tokens.push({ type: 'heading', level: level });
                }

                /* Add paragraph break marker */
                if (tag === 'P' || tag === 'DIV' || tag === 'BLOCKQUOTE') {
                    if (tokens.length > 0 && tokens[tokens.length - 1].type === 'word') {
                        tokens.push({ type: 'break' });
                    }
                }

                /* Process children */
                Array.from(node.childNodes).forEach(processNode);

                /* Add break after block elements */
                if (tag === 'P' || headingTags.includes(tag) || tag === 'LI' || tag === 'BLOCKQUOTE') {
                    if (tokens.length > 0 && tokens[tokens.length - 1].type === 'word') {
                        tokens.push({ type: 'break' });
                    }
                }
            }
        }

        processNode(root);
        return tokens;
    }

    /* Calculate optimal recognition point (ORP) - typically 30-40% into word */
    function getORP(word) {
        var len = word.length;
        if (len <= 1) return 0;
        if (len <= 3) return 1;
        if (len <= 5) return 1;
        if (len <= 9) return 2;
        if (len <= 13) return 3;
        return Math.floor(len * 0.3);
    }

    /* Format word with red center character */
    function formatWord(word) {
        var orp = getORP(word);
        var before = word.substring(0, orp);
        var center = word.charAt(orp);
        var after = word.substring(orp + 1);
        return '<span class="sr-before">' + before + '</span><span class="sr-center">' + center + '</span><span class="sr-after">' + after + '</span>';
    }

    /* Main content extraction */
    var main = mainEl();
    if (!main) {
        alert('Could not find main content on this page.');
        return;
    }

    var clone = main.cloneNode(true);
    rmEls(clone);
    var tokens = parseContent(clone);
    var words = tokens.filter(function(t) { return t.type === 'word'; });

    if (words.length === 0) {
        alert('No readable content found on this page.');
        return;
    }

    /* State */
    var currentIndex = 0;
    var isPlaying = false;
    var wpm = 300;

    /* Create UI */
    var overlay = document.createElement('div');
    overlay.id = 'sr-overlay';
    overlay.innerHTML = '\
        <style>\
            #sr-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }\
            #sr-close { position: absolute; top: 20px; right: 30px; font-size: 40px; color: #888; cursor: pointer; background: none; border: none; }\
            #sr-close:hover { color: #fff; }\
            #sr-display { font-size: 72px; color: #fff; height: 120px; display: flex; align-items: center; justify-content: center; font-family: "Courier New", monospace; white-space: nowrap; }\
            .sr-before { color: #fff; text-align: right; min-width: 280px; display: inline-block; }\
            .sr-after { color: #fff; text-align: left; min-width: 280px; display: inline-block; }\
            .sr-center { color: #ff4444; font-weight: bold; display: inline-block; text-align: center; }\
            #sr-marker { color: #ff4444; font-size: 24px; margin-bottom: 10px; }\
            #sr-focus-guide { color: #ff4444; font-size: 24px; margin-bottom: 5px; }\
            #sr-indicator { font-size: 14px; color: #666; margin-top: 5px; height: 20px; }\
            #sr-progress-container { width: 60%; max-width: 600px; height: 4px; background: #333; margin: 30px 0; border-radius: 2px; }\
            #sr-progress { height: 100%; background: #ff4444; border-radius: 2px; transition: width 0.1s; }\
            #sr-controls { display: flex; gap: 15px; align-items: center; margin-top: 20px; }\
            .sr-btn { background: #333; color: #fff; border: none; padding: 12px 24px; font-size: 16px; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 8px; }\
            .sr-btn:hover { background: #444; }\
            .sr-btn:disabled { opacity: 0.5; cursor: not-allowed; }\
            #sr-play { background: #ff4444; min-width: 100px; }\
            #sr-play:hover { background: #ff5555; }\
            #sr-speed { display: flex; align-items: center; gap: 10px; color: #888; font-size: 14px; margin-top: 20px; }\
            #sr-wpm { width: 200px; accent-color: #ff4444; }\
            #sr-wpm-value { color: #fff; min-width: 80px; }\
            #sr-stats { color: #666; font-size: 12px; margin-top: 15px; }\
            #sr-help { color: #555; font-size: 12px; margin-top: 30px; }\
        </style>\
        <button id="sr-close">&times;</button>\
        <div id="sr-marker"></div>\
        <div id="sr-focus-guide">&#9660;</div>\
        <div id="sr-display"><span class="sr-before"></span><span class="sr-center">&#9654;</span><span class="sr-after"></span></div>\
        <div id="sr-indicator"></div>\
        <div id="sr-progress-container"><div id="sr-progress"></div></div>\
        <div id="sr-controls">\
            <button class="sr-btn" id="sr-rewind">&#8592; 10</button>\
            <button class="sr-btn" id="sr-play">&#9654; Play</button>\
            <button class="sr-btn" id="sr-forward">10 &#8594;</button>\
        </div>\
        <div id="sr-speed">\
            <span>Speed:</span>\
            <input type="range" id="sr-wpm" min="100" max="800" value="300" step="25">\
            <span id="sr-wpm-value">300 WPM</span>\
        </div>\
        <div id="sr-stats"></div>\
        <div id="sr-help">Space: Play/Pause | Left/Right: Navigate | Esc: Close</div>\
    ';
    document.body.appendChild(overlay);

    /* Get UI elements */
    var display = overlay.querySelector('#sr-display');
    var marker = overlay.querySelector('#sr-marker');
    var indicator = overlay.querySelector('#sr-indicator');
    var progress = overlay.querySelector('#sr-progress');
    var playBtn = overlay.querySelector('#sr-play');
    var rewindBtn = overlay.querySelector('#sr-rewind');
    var forwardBtn = overlay.querySelector('#sr-forward');
    var wpmSlider = overlay.querySelector('#sr-wpm');
    var wpmValue = overlay.querySelector('#sr-wpm-value');
    var stats = overlay.querySelector('#sr-stats');
    var closeBtn = overlay.querySelector('#sr-close');

    stats.textContent = words.length + ' words | ~' + Math.ceil(words.length / 250) + ' min read';

    /* Update display */
    function updateDisplay() {
        if (currentIndex >= tokens.length) {
            stop();
            display.innerHTML = 'Finished!';
            marker.textContent = '';
            indicator.textContent = '';
            return;
        }

        var token = tokens[currentIndex];

        if (token.type === 'word') {
            display.innerHTML = formatWord(token.text);
            marker.textContent = '';

            /* Count words up to current position */
            var wordCount = 0;
            for (var i = 0; i <= currentIndex; i++) {
                if (tokens[i].type === 'word') wordCount++;
            }
            indicator.textContent = wordCount + ' / ' + words.length;
            progress.style.width = (wordCount / words.length * 100) + '%';
        } else if (token.type === 'heading') {
            marker.textContent = '--- Section ---';
            /* Skip to next word */
            currentIndex++;
            updateDisplay();
            return;
        } else if (token.type === 'break') {
            /* Skip break tokens */
            currentIndex++;
            updateDisplay();
            return;
        }
    }

    /* Calculate delay for current word */
    function getDelay() {
        var baseInterval = Math.round(60000 / wpm);
        var token = tokens[currentIndex];

        if (token && token.type === 'word') {
            var text = token.text;
            /* Check for sentence-ending punctuation */
            if (/[.!?]$/.test(text) || /[.!?]["'\u2019\u201D]$/.test(text)) {
                return baseInterval * 2.5; /* Pause after sentences */
            }
            /* Check for comma, semicolon, colon */
            if (/[,;:]$/.test(text)) {
                return baseInterval * 1.5; /* Brief pause after clauses */
            }
        }

        /* Check if next token is a paragraph break */
        var nextToken = tokens[currentIndex + 1];
        if (nextToken && nextToken.type === 'break') {
            return baseInterval * 3; /* Longer pause for paragraphs */
        }
        /* Check if next token is a heading */
        if (nextToken && nextToken.type === 'heading') {
            return baseInterval * 2; /* Pause before new sections */
        }

        return baseInterval;
    }

    /* Play/pause controls */
    var timeoutId = null;

    function scheduleNext() {
        if (!isPlaying) return;
        var delay = getDelay();
        timeoutId = setTimeout(function() {
            currentIndex++;
            updateDisplay();
            if (currentIndex >= tokens.length) {
                stop();
            } else {
                scheduleNext();
            }
        }, delay);
    }

    function play() {
        if (currentIndex >= tokens.length) {
            currentIndex = 0;
        }
        isPlaying = true;
        playBtn.innerHTML = '&#10074;&#10074; Pause';
        scheduleNext();
    }

    function stop() {
        isPlaying = false;
        playBtn.innerHTML = '&#9654; Play';
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    }

    function rewind(n) {
        var wordCount = 0;
        var targetWords = n;
        var newIndex = currentIndex;

        while (newIndex > 0 && wordCount < targetWords) {
            newIndex--;
            if (tokens[newIndex].type === 'word') {
                wordCount++;
            }
        }

        currentIndex = Math.max(0, newIndex);
        updateDisplay();
    }

    function forward(n) {
        var wordCount = 0;
        var targetWords = n;

        while (currentIndex < tokens.length - 1 && wordCount < targetWords) {
            currentIndex++;
            if (tokens[currentIndex].type === 'word') {
                wordCount++;
            }
        }

        updateDisplay();
    }

    /* Event listeners */
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    });

    rewindBtn.addEventListener('click', function() {
        rewind(10);
    });

    forwardBtn.addEventListener('click', function() {
        forward(10);
    });

    wpmSlider.addEventListener('input', function() {
        wpm = parseInt(this.value);
        wpmValue.textContent = wpm + ' WPM';
        if (isPlaying) {
            stop();
            play();
        }
    });

    closeBtn.addEventListener('click', function() {
        stop();
        overlay.remove();
    });

    /* Keyboard controls */
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            stop();
            overlay.remove();
            document.removeEventListener('keydown', handleKeydown);
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (isPlaying) {
                stop();
            } else {
                play();
            }
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            rewind(1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            forward(1);
        }
    }
    document.addEventListener('keydown', handleKeydown);

    /* Initial display */
    updateDisplay();
})();
