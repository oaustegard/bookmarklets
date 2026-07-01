javascript:
/* @title: Sort Claude Skills */
/* @description: Sorts Claude "Customize > Skills" lists alphabetically within each group */
/* @domains: claude.ai */
(function () {
  try {
    console.log('Bookmarklet: Starting');

    /* Derive a clean sort key from a skill row: use its first text node */
    /* (the skill name) so an expanded row's nested items don't skew sorting */
    function getSortKey(row) {
      var walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
      var node = walker.nextNode();
      var text = node ? node.textContent.trim() : row.textContent.trim();
      return text.toLowerCase();
    }

    var labels = ['Personal skills', 'Shared skills', 'Organization skills'];
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'));
    var sortedGroups = 0;
    var totalItems = 0;

    labels.forEach(function (label) {
      /* Locate the group heading button by its exact text */
      var heading = buttons.filter(function (b) {
        return b.textContent.trim() === label;
      })[0];
      if (!heading) {
        console.log('Bookmarklet: heading not found -> ' + label);
        return;
      }

      /* Walk up to the group wrapper, then find its row container */
      var groupDiv = heading.closest('div');
      var container = null;
      while (groupDiv && !container) {
        container = groupDiv.querySelector('.flex.flex-col.gap-px');
        if (!container) {
          groupDiv = groupDiv.parentElement;
        }
      }
      if (!container) {
        alert('Row container not found for: ' + label);
        return;
      }

      /* Reorder the row elements in place, alphabetically */
      var rows = Array.prototype.slice.call(container.children);
      rows.sort(function (a, b) {
        return getSortKey(a).localeCompare(getSortKey(b));
      });
      rows.forEach(function (r) {
        container.appendChild(r);
      });

      sortedGroups++;
      totalItems += rows.length;
      console.log('Bookmarklet: sorted "' + label + '" (' + rows.length + ' items)');
    });

    console.log('Bookmarklet: Complete');

    if (sortedGroups == 0) {
      alert('\u2717 No skill groups found. Open Customize \u2192 Skills first.');
    }
  } catch (e) {
    console.error('Bookmarklet error:', e);
    alert('Operation failed: ' + e.message);
  }
})();
