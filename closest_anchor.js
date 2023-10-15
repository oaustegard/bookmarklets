javascript: void((() => {
    const elem = window.getSelection().anchorNode.parentNode;
    const target = elem.closest('*[id], a[name]');
    location.hash = target ? `#${target.id || target.name}` : '';
  })());