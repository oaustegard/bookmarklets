javascript:(function() {
    /* @title: Toggle Page Edit Mode */
    /* @description: Toggles contentEditable mode to make the entire page editable */
    const toggle = document.body.contentEditable === 'true' ? 'false' : 'true';
    document.body.contentEditable = toggle;
    document.designMode = toggle === 'true' ? 'on' : 'off';
  })();
  
