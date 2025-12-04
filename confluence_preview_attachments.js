javascript:(function() {
  /* @title: Preview Confluence Attachments */
  /* @description: Displays preview thumbnails of all attachments on a Confluence page */
  /* @domains: confluence.meso-scale.com */
  const table = document.querySelector('.tableview.attachments');
  const rows = table.querySelectorAll('tbody > tr');
  
  // Update header row
  const headerRow = rows[0];
  const newHeader = document.createElement('th');
  newHeader.innerText = 'Preview';
  headerRow.insertBefore(newHeader, headerRow.querySelector('.filename-column').nextElementSibling);
  
  // Update body rows
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const newCell = document.createElement('td');
    newCell.style.minWidth = '150px';
    newCell.style.width = '150px';
    const fileLink = row.querySelector('.filename-column a.filename');
    if (fileLink) {
      const fileUrl = fileLink.getAttribute('href');
      const imgElem = document.createElement('img');
      imgElem.src = fileUrl;
      imgElem.style.maxWidth = '150px';
      newCell.appendChild(imgElem);
    }
    row.insertBefore(newCell, row.querySelector('.filename-column').nextElementSibling);
  }
})();
