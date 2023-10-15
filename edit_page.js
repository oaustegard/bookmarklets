javascript:(function() {
    const toggle = document.body.contentEditable === 'true' ? 'false' : 'true';
    document.body.contentEditable = toggle;
    document.designMode = toggle === 'true' ? 'on' : 'off';
  })();
  
