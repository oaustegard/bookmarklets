javascript:
/* @title: Sort Claude Skills */
/* @description: Sorts Claude "Customize > Skills" lists alphabetically within each group */
/* @domains: claude.ai */
(function () {
  try {
    /* Get lowercase sort key from an element: prefer first text node, else full text */
    function keyText(el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      var node = walker.nextNode();
      return (node ? node.textContent.trim() : el.textContent.trim()).toLowerCase();
    }

    /* Alphabetically sort a container's children (optionally filtered) in place */
    function sortChildren(container, rowMatcher) {
      var rows = Array.prototype.slice.call(container.children).filter(function (c) {
        return !rowMatcher || (c.matches && c.matches(rowMatcher));
      });
      rows.sort(function (a, b) {
        return keyText(a).localeCompare(keyText(b));
      });
      rows.forEach(function (r) {
        container.appendChild(r);
      });
      return rows.length;
    }

    console.log('Bookmarklet: Starting');
    var sortedGroups = 0;

    /* --- INTERFACE 1: Customize page accordion (Personal / Shared / Organization) --- */
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'));
    ['Personal skills', 'Shared skills', 'Organization skills'].forEach(function (label) {
      var heading = buttons.filter(function (b) {
        return b.textContent.trim() === label;
      })[0];
      if (!heading) {
        console.log('Bookmarklet: customize heading not found -> ' + label);
        return;
      }
      var container = heading.closest('div');
      var list = null;
      while (container && !list) {
        list = container.querySelector('.flex.flex-col.gap-px');
        if (!list) container = container.parentElement;
      }
      if (list) {
        var n = sortChildren(list);
        sortedGroups++;
        console.log('Bookmarklet: sorted "' + label + '" (' + n + ' items)');
      } else {
        console.log('Bookmarklet: list container not found for ' + label);
      }
    });

    /* --- INTERFACE 2: Admin settings page ("Organization skills" heading + More options rows) --- */
    if (sortedGroups === 0) {
      var adminHeading = Array.prototype.slice
        .call(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
        .filter(function (h) {
          return h.textContent.trim() === 'Organization skills';
        })[0];
      if (adminHeading) {
        var section = adminHeading.closest('section') || adminHeading.parentElement;
        var bestContainer = null;
        var bestCount = 0;
        Array.prototype.slice.call(section.querySelectorAll('*')).forEach(function (el) {
          var skillRows = Array.prototype.slice.call(el.children).filter(function (child) {
            return child.querySelector && child.querySelector('button[aria-label^="More options for"]');
          });
          if (skillRows.length > bestCount) {
            bestCount = skillRows.length;
            bestContainer = el;
          }
        });
        if (bestContainer && bestCount > 1) {
          var m = sortChildren(bestContainer);
          sortedGroups++;
          console.log('Bookmarklet: sorted "Organization skills" admin list (' + m + ' items)');
        } else {
          console.log('Bookmarklet: admin skill list container not found');
        }
      } else {
        console.log('Bookmarklet: admin "Organization skills" heading not found');
      }
    }

    /* --- INTERFACE 3: Settings popup dialog (single <table> of skills) --- */
    if (sortedGroups === 0) {
      var tables = Array.prototype.slice.call(document.querySelectorAll('table'));
      var skillsTable = null;
      var maxRows = 0;
      tables.forEach(function (t) {
        var count = t.querySelectorAll('tbody tr[aria-label^="View "]').length;
        if (count > maxRows) {
          maxRows = count;
          skillsTable = t;
        }
      });
      if (skillsTable && maxRows > 1) {
        var tbody = skillsTable.querySelector('tbody');
        var k = sortChildren(tbody, 'tr[aria-label^="View "]');
        sortedGroups++;
        console.log('Bookmarklet: sorted settings table (' + k + ' items)');
      } else {
        console.log('Bookmarklet: settings skills table not found');
      }
    }

    console.log('Bookmarklet: Complete');
    if (sortedGroups === 0) {
      alert('\u2717 No skill groups found. Open Customize \u2192 Skills, Admin settings \u2192 Skills, or the Settings \u2192 Skills popup first.');
    }
  } catch (e) {
    console.error('Bookmarklet error:', e);
    alert('Operation failed: ' + e.message);
  }
})();
