javascript:
/* @title: Sort Claude Skills */
/* @description: Sorts Claude "Customize > Skills" lists alphabetically within each group */
/* @domains: claude.ai */
(function () {
  try {
    console.log('Bookmarklet: Starting');

    /* Lowercased first text node of an element, used as the sort key */
    function firstTextLower(el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var node = walker.nextNode();
      return (node ? node.textContent.trim() : el.textContent.trim()).toLowerCase();
    }

    /* Alphabetically reorder the direct children of a container in place */
    function sortContainer(container) {
      var items = Array.prototype.slice.call(container.children);
      items.sort(function (a, b) {
        return firstTextLower(a).localeCompare(firstTextLower(b));
      });
      items.forEach(function (item) { container.appendChild(item); });
      return items.length;
    }

    var sortedGroups = 0;
    var allButtons = Array.prototype.slice.call(document.querySelectorAll('button'));

    /* --- Customize page: claude.ai/customize/skills --- */
    /* Grouped under button-style headings, each list uses .flex.flex-col.gap-px */
    ['Personal skills', 'Shared skills', 'Organization skills'].forEach(function (label) {
      var heading = allButtons.filter(function (b) {
        return b.textContent.trim() === label;
      })[0];
      if (!heading) {
        console.log('Bookmarklet: customize heading not found -> ' + label);
        return;
      }
      var node = heading.closest('div');
      var listContainer = null;
      while (node && !listContainer) {
        listContainer = node.querySelector('.flex.flex-col.gap-px');
        if (!listContainer) node = node.parentElement;
      }
      if (listContainer) {
        var count = sortContainer(listContainer);
        sortedGroups++;
        console.log('Bookmarklet: sorted "' + label + '" (' + count + ' items)');
      } else {
        console.log('Bookmarklet: list container not found for ' + label);
      }
    });

    /* --- Admin page: claude.ai/admin-settings/skills --- */
    /* Single "Organization skills" section under an <h3> heading. */
    /* Skill rows are direct children of a plain flex column; identify the list */
    /* as the densest container of cards, each card holding a "More options for" button. */
    if (sortedGroups === 0) {
      var adminHeading = Array.prototype.slice
        .call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
        .filter(function (el) { return el.textContent.trim() === 'Organization skills'; })[0];

      if (adminHeading) {
        var scope = adminHeading.closest('section') || adminHeading.parentElement;
        var best = null, bestCount = 0;
        Array.prototype.slice.call(scope.querySelectorAll('*')).forEach(function (el) {
          var cards = Array.prototype.slice.call(el.children).filter(function (c) {
            return c.querySelector && c.querySelector('button[aria-label^="More options for"]');
          });
          if (cards.length > bestCount) { bestCount = cards.length; best = el; }
        });

        if (best && bestCount > 1) {
          var adminCount = sortContainer(best);
          sortedGroups++;
          console.log('Bookmarklet: sorted "Organization skills" admin list (' + adminCount + ' items)');
        } else {
          console.log('Bookmarklet: admin skill list container not found');
        }
      } else {
        console.log('Bookmarklet: admin "Organization skills" heading not found');
      }
    }

    console.log('Bookmarklet: Complete');
    if (sortedGroups === 0) {
      alert('\u2717 No skill groups found. Open Customize \u2192 Skills or Admin settings \u2192 Skills first.');
    } 
  } catch (e) {
    console.error('Bookmarklet error:', e);
    alert('Operation failed: ' + e.message);
  }
})();
