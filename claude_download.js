javascript: (() => {
  document.body.appendChild(Object.assign(document.createElement('script'), {
    textContent: 'window._lg = function(msg) { console.log(msg); }'
  }));

  try {
    _lg('Looking for .mx-auto div');
    const contentDiv = document.querySelector('.mx-auto');
    if (!contentDiv) {
      throw new Error('Could not find .mx-auto div');
    }
    _lg('Cloning .mx-auto div');
    const contentClone = contentDiv.cloneNode(true);

    _lg('Removing unwanted elements');
    const unwanted = contentClone.querySelectorAll('button, [data-ignore-for-autoscroll="true"], .text-stone-500, [data-testid="image.png"], [data-testid="claude_tw.css"]');
    unwanted.forEach(element => element.remove());

    _lg('Getting inner HTML');
    let mainContent = contentClone.innerHTML;
    if (!mainContent) {
      throw new Error('.mx-auto div has no content');
    }

    _lg('Looking for artifact panel');
    const artifactPanel = document.querySelector('.fixed.bottom-0.top-0.flex.w-full.flex-col');
    let artifactContent = '';
    if (artifactPanel) {
      _lg('Cloning artifact panel');
      const artifactPanelClone = artifactPanel.cloneNode(true);
      artifactContent = artifactPanelClone.innerHTML;
    } else {
      _lg('No artifact panel found');
    }
    
    const title = document.title;
    const chat_url = document.location.href;

    _lg('Creating new page with two-column layout');
    const newPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claude: ${title}</title>
  <link rel="stylesheet" href="https://austegard.com/claude_tw.css">
</head>
<body>
  <h1 class="content-center"><a href="${chat_url}" target="_blank">${title}</a></h1>
  <div class="main-content">
    ${mainContent}
  </div>
  <div class="artifact-panel">
    ${artifactContent}
  </div>
</body>
</html>`;

    _lg('Creating blob for downloading');
    const blob = new Blob([newPage], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    _lg('Creating and clicking then removing anchor element');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    _lg('Download complete!');
  } catch (error) {
    alert(error);
  }
})();
