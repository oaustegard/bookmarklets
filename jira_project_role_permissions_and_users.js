javascript:(function(){
    /* Extract project key from URL */
    const projectKey = window.location.pathname.match(/\/project-config\/([^\/]+)/)?.[1];
    
    if (!projectKey) {
        alert('Must be run from a project permissions page');
        return;
    }
    
    console.log('Processing roles and permissions for project:', projectKey);
    
    /* Find the Jira permissions table */
    const permissionsTable = document.querySelector('jira-permissions-table');
    if (!permissionsTable) {
        alert('Jira permissions table not found on this page');
        return;
    }
    
    /* Extract permissions data and organize by role */
    console.log('Extracting permissions data...');
    const rolePermissions = new Map();
    const permissionCategories = new Map();

    /* Process each permissions group */
    const permissionGroups = permissionsTable.querySelectorAll('.permissions-group');
    
    permissionGroups.forEach(group => {
        const categoryHeader = group.querySelector('.project-permissions-category-header');
        if (!categoryHeader) return;
        
        const categoryName = categoryHeader.textContent.trim();
        
        /* Process each permission row in this group */
        const rows = group.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const permissionCell = row.querySelector('td[data-headers="project-permissions"]');
            const grantsCell = row.querySelector('td[data-headers="security-type"]');
            
            if (!permissionCell || !grantsCell) return;
            
            const permissionTitle = permissionCell.querySelector('.title')?.textContent.trim();
            
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
                        category: categoryName
                    });
                });
            });
        });
    });

    console.log('Permissions processed for', rolePermissions.size, 'roles');
    
    /* Fetch roles and users data */
    const apiUrl = `${window.location.origin}/rest/projectconfig/latest/roles/${projectKey}?pageNumber=1&pageSize=50&query=`;
    
    fetch(apiUrl, {
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        console.log('API Response status:', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Roles data received:', data);
        
        /* Combine permissions and users data */
        const combinedData = combineRoleData(data.roles, rolePermissions);
        console.log('Combined data:', combinedData);
        
        /* Display results */
        displayResults(combinedData, projectKey);
    })
    .catch(error => {
        console.error('Error fetching roles:', error);
        alert('Error loading role data: ' + error.message);
    });
    
    /* Combine roles users with permissions data */
    function combineRoleData(rolesData, permissionsData) {
        console.log('Starting combineRoleData with', rolesData.length, 'roles and', permissionsData.size, 'permission groups');
        const combined = [];
        
        /* Process each role from API */
        rolesData.forEach(role => {
            const roleName = role.name;
            console.log('Processing role:', roleName, 'with', role.total, 'members');
            
            /* Find matching permissions (try exact match first, then partial) */
            let permissions = permissionsData.get(roleName) || [];
            if (permissions.length === 0) {
                /* Try to find permissions for role with type suffix */
                for (let [key, perms] of permissionsData.entries()) {
                    if (key.includes(roleName)) {
                        permissions = perms;
                        console.log('Found permissions for', roleName, 'via key', key);
                        break;
                    }
                }
            }
            
            console.log('Role', roleName, 'has', permissions.length, 'permissions');
            
            /* Only include roles that have either users/groups OR permissions */
            if (role.total > 0 || permissions.length > 0) {
                combined.push({
                    name: roleName,
                    users: role.users || [],
                    groups: role.groups || [],
                    total: role.total || 0,
                    permissions: permissions
                });
            }
        });
        
        console.log('Combined data result:', combined.length, 'roles');
        return combined.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    /* Display results in overlay */
    function displayResults(rolesData, projectKey) {
        console.log('Displaying results for', rolesData.length, 'roles');
        
        /* Store data for download */
        window.jiraRolePermissionsData = { projectKey, roles: rolesData };
        
        /* Create overlay */
        const overlay = document.createElement('div');
        overlay.id = 'jira-roles-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
            align-items: center; justify-content: center; font-family: Arial, sans-serif;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white; border-radius: 8px; max-width: 95%; max-height: 90%; 
            overflow: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3); position: relative;
        `;
        
        /* Header */
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px; border-bottom: 1px solid #eee; display: flex; 
            justify-content: space-between; align-items: center; background: #0052cc; color: white;
        `;
        
        const title = document.createElement('h2');
        title.textContent = `Project Roles & Permissions: ${projectKey}`;
        title.style.margin = '0';
        
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '10px';
        
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download HTML';
        downloadBtn.style.cssText = `
            background: white; color: #0052cc; border: none; padding: 8px 16px; 
            border-radius: 4px; cursor: pointer; font-weight: bold;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none; border: none; font-size: 24px; cursor: pointer; 
            padding: 0; line-height: 1; color: white;
        `;
        
        controls.appendChild(downloadBtn);
        controls.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(controls);
        
        /* Content */
        const content = document.createElement('div');
        content.style.padding = '20px';
        
        /* Summary */
        const summary = document.createElement('div');
        summary.style.cssText = `
            margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;
        `;
        summary.innerHTML = `
            <h3 style="margin: 0 0 5px 0;">Summary</h3>
            <p style="margin: 0;">Found ${rolesData.length} roles with users and/or permissions</p>
        `;
        content.appendChild(summary);
        
        /* Generate role content */
        rolesData.forEach(role => {
            const roleDiv = document.createElement('div');
            roleDiv.style.cssText = `
                margin-bottom: 25px; border: 1px solid #ddd; border-radius: 4px;
            `;
            
            /* Role header */
            const roleHeader = document.createElement('div');
            roleHeader.style.cssText = `
                background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd;
            `;
            roleHeader.innerHTML = `<h3 style="margin: 0;">${role.name}</h3>`;
            roleDiv.appendChild(roleHeader);
            
            /* Role content - two column layout */
            const roleContent = document.createElement('div');
            roleContent.style.cssText = `
                padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
            `;
            
            /* Left column - Permissions */
            const permissionsCol = document.createElement('div');
            if (role.permissions.length > 0) {
                /* Group permissions by category */
                const categorizedPerms = {};
                role.permissions.forEach(perm => {
                    if (!categorizedPerms[perm.category]) {
                        categorizedPerms[perm.category] = [];
                    }
                    categorizedPerms[perm.category].push(perm.permission);
                });
                
                let permHtml = `<h4 style="margin: 0 0 10px 0; color: #333;">Permissions</h4>`;
                
                Object.keys(categorizedPerms).sort().forEach(category => {
                    permHtml += `
                        <div style="margin-bottom: 15px;">
                            <h5 style="margin: 0 0 5px 0; color: #666; font-size: 13px;">${category}</h5>
                            <ul style="margin: 0; padding-left: 20px;">`;
                    categorizedPerms[category].forEach(permission => {
                        permHtml += `<li style="margin-bottom: 2px; font-size: 13px;">${permission}</li>`;
                    });
                    permHtml += `</ul></div>`;
                });
                
                permissionsCol.innerHTML = permHtml;
            } else {
                permissionsCol.innerHTML = '<h4 style="margin: 0; color: #999;">No permissions</h4>';
            }
            
            /* Right column - Members */
            const membersCol = document.createElement('div');
            let memberHtml = `<h4 style="margin: 0 0 10px 0; color: #333;">Members</h4>`;
            
            if (role.users.length > 0) {
                memberHtml += `<div style="margin-bottom: 15px;">
                    <h5 style="margin: 0 0 5px 0; color: #666; font-size: 13px;">Users</h5>
                    <ul style="margin: 0; padding-left: 20px;">`;
                role.users.forEach(user => {
                    memberHtml += `<li style="margin-bottom: 3px; font-size: 13px;">${user.displayName} (${user.emailAddress})</li>`;
                });
                memberHtml += `</ul></div>`;
            }
            
            if (role.groups.length > 0) {
                memberHtml += `<div style="margin-bottom: 15px;">
                    <h5 style="margin: 0 0 5px 0; color: #666; font-size: 13px;">Groups</h5>
                    <ul style="margin: 0; padding-left: 20px;">`;
                role.groups.forEach(group => {
                    memberHtml += `<li style="margin-bottom: 3px; font-size: 13px;">${group.name}</li>`;
                });
                memberHtml += `</ul></div>`;
            }
            
            if (role.users.length === 0 && role.groups.length === 0) {
                memberHtml += '<p style="margin: 0; color: #999; font-style: italic;">No members</p>';
            }
            
            membersCol.innerHTML = memberHtml;
            
            roleContent.appendChild(permissionsCol);
            roleContent.appendChild(membersCol);
            roleDiv.appendChild(roleContent);
            content.appendChild(roleDiv);
        });
        
        /* Assemble modal */
        modal.appendChild(header);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        /* Event handlers */
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) document.body.removeChild(overlay);
        });
        downloadBtn.addEventListener('click', downloadHTML);
        
        console.log('Display complete');
    }
    
    /* Download HTML function */
    function downloadHTML() {
        const data = window.jiraRolePermissionsData;
        if (!data) return;
        
        console.log('Generating HTML download...');
        
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Roles & Permissions: ${data.projectKey}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #0052cc; color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
        .role { border: 1px solid #ddd; margin-bottom: 20px; border-radius: 4px; }
        .role-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; }
        .role-content { padding: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .section h4 { margin: 0 0 10px 0; color: #333; }
        .section h5 { margin: 0 0 5px 0; color: #666; font-size: 13px; }
        .section ul { margin: 0 0 15px 0; padding-left: 20px; }
        .section li { margin-bottom: 3px; font-size: 13px; }
        h1, h2, h3 { margin-top: 0; }
        @media (max-width: 768px) { .role-content { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Project Roles & Permissions: ${data.projectKey}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
`;

        data.roles.forEach(role => {
            htmlContent += `
    <div class="role">
        <div class="role-header">
            <h2>${role.name}</h2>
        </div>
        <div class="role-content">
            <div class="section">
                <h4>Permissions</h4>`;
        
            if (role.permissions.length > 0) {
                const categorizedPerms = {};
                role.permissions.forEach(perm => {
                    if (!categorizedPerms[perm.category]) {
                        categorizedPerms[perm.category] = [];
                    }
                    categorizedPerms[perm.category].push(perm.permission);
                });
                
                Object.keys(categorizedPerms).sort().forEach(category => {
                    htmlContent += `
                <div>
                    <h5>${category}</h5>
                    <ul>`;
                    categorizedPerms[category].forEach(permission => {
                        htmlContent += `<li>${permission}</li>`;
                    });
                    htmlContent += `</ul>
                </div>`;
                });
            } else {
                htmlContent += '<p style="color: #999; font-style: italic;">No permissions</p>';
            }
            
            htmlContent += `
            </div>
            <div class="section">
                <h4>Members</h4>`;
            
            if (role.users.length > 0) {
                htmlContent += `
                <div>
                    <h5>Users</h5>
                    <ul>`;
                role.users.forEach(user => {
                    htmlContent += `<li>${user.displayName} (${user.emailAddress})</li>`;
                });
                htmlContent += `</ul>
                </div>`;
            }
            
            if (role.groups.length > 0) {
                htmlContent += `
                <div>
                    <h5>Groups</h5>
                    <ul>`;
                role.groups.forEach(group => {
                    htmlContent += `<li>${group.name}</li>`;
                });
                htmlContent += `</ul>
                </div>`;
            }
            
            if (role.users.length === 0 && role.groups.length === 0) {
                htmlContent += '<p style="color: #999; font-style: italic;">No members</p>';
            }
            
            htmlContent += `
            </div>
        </div>
    </div>`;
        });
        
        htmlContent += `
</body>
</html>`;
        
        /* Create and download the file */
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jira-roles-permissions-${data.projectKey}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('HTML download completed');
    }
})();
