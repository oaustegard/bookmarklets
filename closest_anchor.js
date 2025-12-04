javascript: void((() => {
    /* @title: Jump to Closest Anchor */
    /* @description: Updates the URL hash to jump to the closest anchor near the current text selection */
    const elem = window.getSelection().anchorNode.parentNode;
    const target = elem.closest('*[id], a[name]');
    location.hash = target ? `#${target.id || target.name}` : '';
  })());