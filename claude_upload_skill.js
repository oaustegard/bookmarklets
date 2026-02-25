javascript:
/* @title: Upload Claude Skill */
/* @description: Streamlines the upload of Claude skills. Click twice if needed. */
(function() {
  var TARGET = 'https://claude.ai/customize/skills';

  function fire(el, type) {
    el.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      isPrimary: true
    }));
  }

  function openUpload() {
    var btn = Array.from(document.querySelectorAll('button')).find(function(b) {
      return b.getAttribute('aria-label') === 'Add skill';
    });
    if (!btn) {
      alert('Add skill button not found. Are you on claude.ai/customize/skills?');
      return;
    }
    fire(btn, 'pointerdown');
    fire(btn, 'pointerup');
    btn.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    }));
    setTimeout(function() {
      var item = Array.from(document.querySelectorAll('[role="menuitem"]')).find(function(el) {
        return el.textContent.includes('Upload a skill');
      });
      if (!item) {
        alert('Upload menu item not found.');
        return;
      }
      fire(item, 'pointermove');
      fire(item, 'pointerdown');
      fire(item, 'pointerup');
      item.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      }));
    }, 200);
  }
  if (location.hostname !== 'claude.ai' || !location.pathname.startsWith('/customize/skills')) {
    if (confirm('Navigate to claude.ai/customize/skills to open the Upload Skill dialog?')) {
      location.href = TARGET;
    }
  } else {
    openUpload();
  }
})();
