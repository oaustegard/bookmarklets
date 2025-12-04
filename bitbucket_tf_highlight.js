javascript:(function(){
  /* @title: Highlight Bitbucket TF Files */
  /* @description: Highlights Terraform files in Bitbucket for easier identification */
  if(!window.location.href.includes('bitbucket')){
    alert('This bookmarklet works on Bitbucket source pages only!');
    return;
  }
  
  const codeMirrorElement = document.querySelector('.CodeMirror');
  if(!codeMirrorElement || !codeMirrorElement.CodeMirror){
    console.error('CodeMirror instance not found');
    return;
  }
  
  const cmInstance = codeMirrorElement.CodeMirror;
  const currentMode = cmInstance.getOption('mode');
  
  if(codeMirrorElement.dataset.originalMode){
    cmInstance.setOption('mode', codeMirrorElement.dataset.originalMode);
    delete codeMirrorElement.dataset.originalMode;
    console.log(`Restored original mode: ${codeMirrorElement.dataset.originalMode || currentMode}`);
  } else {
    const tfPattern = /\.(tf|tfvars)$/;
    const isTerraformFile = tfPattern.test(window.location.pathname);
    const fullText = cmInstance.getValue();
    const terraformKeywords = ['resource "', 'variable "', 'provider "', 'module "', 'data "', 'locals {', 'output "'];
    
    if(isTerraformFile || terraformKeywords.some(keyword => fullText.includes(keyword))){
      codeMirrorElement.dataset.originalMode = currentMode;
      cmInstance.setOption('mode', 'javascript');
      console.log(`Applied JavaScript syntax highlighting. Original mode: ${currentMode}. Click bookmarklet again to restore.`);
    } else {
      console.log('No Terraform content detected');
    }
  }
})();
