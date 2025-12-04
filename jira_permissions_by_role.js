javascript:(function(){
/* @title: Format Jira Permissions by Role */
/* @description: Reformats Jira permissions table to show permissions grouped by role */
/* @domains: jira.meso-scale.com */
    /* Find the Jira permissions table */
    const permissionsTable = document.querySelector('jira-permissions-table');
    if (!permissionsTable) {
        alert('Jira permissions table not found on this page');
        return;
    }

    console.log('Found Jira permissions table, processing...');

    /* Extract permissions data and organize by role */
    const rolePermissions = new Map();
    const permissionCategories = new Map();

    /* Process each permissions group */
    const permissionGroups = permissionsTable.querySelectorAll('.permissions-group');
    
    permissionGroups.forEach(group => {
        const categoryHeader = group.querySelector('.project-permissions-category-header');
        if (!categoryHeader) return;
        
        const categoryName = categoryHeader.textContent.trim();
        console.log('Processing category:', categoryName);
        
        /* Process each permission row in this group */
        const rows = group.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const permissionCell = row.querySelector('td[data-headers="project-permissions"]');
            const grantsCell = row.querySelector('td[data-headers="security-type"]');
            
            if (!permissionCell || !grantsCell) return;
            
            const permissionTitle = permissionCell.querySelector('.title')?.textContent.trim();
            const permissionDesc = permissionCell.querySelector('.description small')?.textContent.trim();
            
            if (!permissionTitle) return;
            
            /* Store permission with its category */
            permissionCategories.set(permissionTitle, categoryName);
            
            /* Extract roles that have this permission */
            const typeGroups = grantsCell.querySelectorAll('dl.types');
            typeGroups.forEach(dl => {
                const typeHeader = dl.querySelector('dt')?.textContent.trim();
                const roleItems = dl.querySelectorAll('dd');
                
                roleItems.forEach(dd => {
                    const roleName = dd.textContent.trim();
                    const fullRoleName = typeHeader ? `${roleName} (${typeHeader})` : roleName;
                    
                    if (!rolePermissions.has(fullRoleName)) {
                        rolePermissions.set(fullRoleName, []);
                    }
                    
                    rolePermissions.get(fullRoleName).push({
                        permission: permissionTitle,
                        description: permissionDesc,
                        category: categoryName
                    });
                });
            });
        });
    });

    console.log('Processed permissions for', rolePermissions.size, 'roles');

    /* Create and style the results UI */
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'jira-permissions-by-role';
    resultsDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 600px;
        max-height: 80vh;
        background: white;
        border: 2px solid #0052cc;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    `;

    /* Create header with title and controls */
    const header = document.createElement('div');
    header.style.cssText = `
        background: #0052cc;
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Permissions by Role';
    title.style.margin = '0';
    
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '10px';
    
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy MD';
    copyBtn.style.cssText = `
        background: white;
        color: #0052cc;
        border: none;
        padding: 5px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    `;
    
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export MD';
    exportBtn.style.cssText = `
        background: white;
        color: #0052cc;
        border: none;
        padding: 5px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        background: transparent;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 25px;
        height: 25px;
    `;
    
    controls.appendChild(copyBtn);
    controls.appendChild(exportBtn);
    controls.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(controls);

    /* Create scrollable content area */
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    `;

    /* Generate role-based content */
    const sortedRoles = Array.from(rolePermissions.keys()).sort();
    
    sortedRoles.forEach(role => {
        const permissions = rolePermissions.get(role);
        const roleSection = document.createElement('div');
        roleSection.style.marginBottom = '25px';
        
        const roleHeader = document.createElement('h4');
        roleHeader.textContent = `${role} (${permissions.length} permissions)`;
        roleHeader.style.cssText = `
            color: #0052cc;
            margin: 0 0 10px 0;
            font-size: 16px;
            border-bottom: 2px solid #e6f2ff;
            padding-bottom: 5px;
        `;
        
        roleSection.appendChild(roleHeader);
        
        /* Group permissions by category */
        const categorizedPerms = {};
        permissions.forEach(perm => {
            if (!categorizedPerms[perm.category]) {
                categorizedPerms[perm.category] = [];
            }
            categorizedPerms[perm.category].push(perm);
        });
        
        Object.keys(categorizedPerms).sort().forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.style.marginBottom = '15px';
            
            const categoryHeader = document.createElement('h5');
            categoryHeader.textContent = category;
            categoryHeader.style.cssText = `
                color: #666;
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: bold;
            `;
            categoryDiv.appendChild(categoryHeader);
            
            const permList = document.createElement('ul');
            permList.style.cssText = `
                margin: 0;
                padding-left: 20px;
                list-style-type: disc;
            `;
            
            categorizedPerms[category].forEach(perm => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '4px';
                listItem.textContent = perm.permission;
                permList.appendChild(listItem);
            });
            
            categoryDiv.appendChild(permList);
            roleSection.appendChild(categoryDiv);
        });
        
        content.appendChild(roleSection);
    });

    /* Assemble the UI */
    resultsDiv.appendChild(header);
    resultsDiv.appendChild(content);
    document.body.appendChild(resultsDiv);

    /* Generate markdown content function */
    function generateMarkdown() {
        let markdown = '# Jira Project Permissions by Role\n\n';
        
        sortedRoles.forEach(role => {
            const permissions = rolePermissions.get(role);
            markdown += `## ${role}\n\n`;
            markdown += `**Total Permissions:** ${permissions.length}\n\n`;
            
            /* Group by category for markdown */
            const categorizedPerms = {};
            permissions.forEach(perm => {
                if (!categorizedPerms[perm.category]) {
                    categorizedPerms[perm.category] = [];
                }
                categorizedPerms[perm.category].push(perm);
            });
            
            Object.keys(categorizedPerms).sort().forEach(category => {
                markdown += `### ${category}\n\n`;
                
                categorizedPerms[category].forEach(perm => {
                    markdown += `- ${perm.permission}\n`;
                });
                markdown += '\n';
            });
        });
        
        return markdown;
    }

    /* Copy to clipboard functionality */
    copyBtn.addEventListener('click', async function() {
        console.log('Copying markdown to clipboard...');
        const markdown = generateMarkdown();
        
        try {
            await navigator.clipboard.writeText(markdown);
            
            /* Visual feedback */
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#36b37e';
            copyBtn.style.color = 'white';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'white';
                copyBtn.style.color = '#0052cc';
            }, 2000);
            
            console.log('Markdown copied to clipboard successfully');
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            
            /* Fallback visual feedback */
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copy Failed';
            copyBtn.style.background = '#de350b';
            copyBtn.style.color = 'white';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = 'white';
                copyBtn.style.color = '#0052cc';
            }, 2000);
        }
    });

    /* Export to markdown functionality */
    exportBtn.addEventListener('click', function() {
        console.log('Generating markdown export...');
        const markdown = generateMarkdown();
        
        /* Create and download the file */
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'jira-permissions-by-role.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Markdown export completed');
    });

    /* Close functionality */
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(resultsDiv);
    });

    /* Make draggable */
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        initialX = e.clientX - resultsDiv.offsetLeft;
        initialY = e.clientY - resultsDiv.offsetTop;
        header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            resultsDiv.style.left = currentX + 'px';
            resultsDiv.style.top = currentY + 'px';
            resultsDiv.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        header.style.cursor = 'grab';
    });

    header.style.cursor = 'grab';

    console.log('Jira permissions reorganizer loaded successfully');
})();
