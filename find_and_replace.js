javascript:(function() {
  function replaceTextInHtml(find, replace, element) {
    if (element === undefined) {
      element = document.body;
    }

    var regex = new RegExp(find, 'gi');
    var childNodes = element.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
      var node = childNodes[i];
      
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(regex, replace);
      } else {
        replaceTextInHtml(find, replace, node);
      }
    }
  }
  
  var textToFind = prompt("Find:");
  var textToReplace = prompt("Replace with:");
  
  replaceTextInHtml(textToFind, textToReplace);
})();
