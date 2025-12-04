javascript:(function() {
  /* @title: Enlarge Custom Instructions Field */
  /* @description: Expand the custom instructions textarea in Claude projects for easier editing */
  /* @domains: claude.ai */
  /* Find the textarea with id from 1-10 */
  let textarea = null;
  for (let i = 1; i <= 10; i++) {
    const candidate = document.getElementById(i.toString());
    if (candidate && candidate.tagName === 'TEXTAREA') {
      textarea = candidate;
      break;
    }
  }
  
  if (!textarea) {
    alert('No textarea with id 1-10 found on this page. Ensure you are on a Claude Project page with the Custom Instructions dialog open');
    return;
  }
  
  /* Make the textarea resizable */
  textarea.style.resize = 'both';
  
  /* Set optimal size that doesn't waste space */
  textarea.style.width = '1265px';
  textarea.style.height = '800px';
  textarea.style.minHeight = '600px';
  
  /* Force the textarea to maintain its size */
  textarea.style.boxSizing = 'border-box';
  
  /* Check if textarea is inside a dialog or modal */
  let dialog = textarea.closest('dialog, .modal, [role="dialog"]');
  
  if (dialog) {
    /* Make dialog fit content more efficiently */
    dialog.style.width = 'fit-content';
    dialog.style.height = 'fit-content';
    dialog.style.maxWidth = '95vw';
    dialog.style.maxHeight = '95vh';
    
    /* Add padding to dialog for better aesthetics */
    dialog.style.padding = '20px';
    
    /* Ensure overflow is properly handled */
    dialog.style.overflow = 'auto';
    
    /* Find any immediate parent containers that might need adjustment */
    const dialogParent = dialog.parentElement;
    if (dialogParent) {
      dialogParent.style.display = 'flex';
      dialogParent.style.justifyContent = 'center';
      dialogParent.style.alignItems = 'center';
    }
  }
  
  /* Check for any immediate container of the textarea */
  const textareaParent = textarea.parentElement;
  if (textareaParent) {
    textareaParent.style.width = 'auto';
    textareaParent.style.height = 'auto';
  }
  
  /* Force layout recalculation */
  setTimeout(function() {
    window.dispatchEvent(new Event('resize'));
  }, 100);
})();
