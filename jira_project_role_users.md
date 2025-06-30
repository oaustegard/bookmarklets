javascript:(function(){
/* Gets the roles for a Jira project and the associated users, with option to copy output as markdown */
    /* Extract project key from URL */
    const projectKey = window.location.pathname.match(/\/project-config\/([^\/]+)/)?.[1] || 
                      prompt('Enter project key (e.g., AS):');
    
    if (!projectKey) {
        alert('Project key required');
        return;
    }
    
    console.log('Fetching roles for project:', projectKey);
    
    /* Create loading overlay */
    const overlay = document.createElement('div');
    overlay.id = 'jira-roles-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 10000; display: flex; 
        align-items: center; justify-content: center; font-family: Arial, sans-serif;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white; border-radius: 8px; max-width: 90%; max-height: 90%; 
        overflow: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.3); position: relative;
    `;
    
    modal.innerHTML = `
        <div style="padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; color: #333;">Project Roles: ${projectKey}</h2>
            <div>
                <button id="copy-markdown-btn" onclick="copyAsMarkdown()" 
                        style="background: #0052cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; font-size: 14px;">
                    Copy as Markdown
                </button>
                <button onclick="document.getElementById('jira-roles-overlay').remove()" 
                        style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
            </div>
        </div>
        <div id="roles-content" style="padding: 20px;">Loading roles...</div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    /* Close on overlay click */
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
    
    /* Fetch roles data */
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
        /* Filter roles to only show those with members */
        const rolesWithMembers = data.roles.filter(role => role.total > 0);
        console.log('Roles with members:', rolesWithMembers.length, 'of', data.roles.length);
        
        /* Store for markdown copy */
        window.jiraRolesData = { projectKey, roles: rolesWithMembers };
        
        displayRoles(rolesWithMembers);
    })
    .catch(error => {
        console.error('Error fetching roles:', error);
        document.getElementById('roles-content').innerHTML = `
            <div style="color: red; text-align: center;">
                <h3>Error loading roles</h3>
                <p>${error.message}</p>
                <p>Check browser console for details</p>
            </div>
        `;
    });
    
    /* Copy as markdown function */
    window.copyAsMarkdown = function() {
        const data = window.jiraRolesData;
        if (!data) return;
        
        let markdown = `# Project Roles: ${data.projectKey}\n\n`;
        
        data.roles.forEach(role => {
            markdown += `## ${role.name} (${role.total} member${role.total !== 1 ? 's' : ''})\n\n`;
            
            if (role.users.length > 0) {
                markdown += `### Users\n\n`;
                role.users.forEach(user => {
                    markdown += `- **${user.displayName}** (${user.emailAddress})\n`;
                });
                markdown += `\n`;
            }
            
            if (role.groups.length > 0) {
                markdown += `### Groups\n\n`;
                role.groups.forEach(group => {
                    markdown += `- **${group.name}** (ID: ${group.id})\n`;
                });
                markdown += `\n`;
            }
        });
        
        navigator.clipboard.writeText(markdown).then(() => {
            const btn = document.getElementById('copy-markdown-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#0052cc';
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Copy failed - check console');
        });
    };
    
    /* Display roles function */
    function displayRoles(roles) {
        const content = document.getElementById('roles-content');
        
        if (!roles || roles.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: #666;">No roles found</p>';
            return;
        }
        
        const html = roles.map(role => {
            return `
                <div style="margin-bottom: 25px; border: 1px solid #ddd; border-radius: 6px; overflow: hidden;">
                    <div style="background: #f5f5f5; padding: 15px; border-bottom: 1px solid #ddd;">
                        <h3 style="margin: 0; color: #333; display: flex; justify-content: space-between; align-items: center;">
                            ${role.name}
                            <span style="background: #4CAF50; color: white; 
                                       padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: normal;">
                                ${role.total} member${role.total !== 1 ? 's' : ''}
                            </span>
                        </h3>
                    </div>
                    <div style="padding: 15px;">
                        ${role.users.length > 0 ? `
                            <div style="margin-bottom: ${role.groups.length > 0 ? '15px' : '0'};">
                                <h4 style="margin: 0 0 10px 0; color: #555; font-size: 14px;">Users:</h4>
                                ${role.users.map(user => `
                                    <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                                        <img src="${user.avatarUrl}" alt="" style="width: 24px; height: 24px; border-radius: 50%; margin-right: 10px;">
                                        <div style="flex: 1;">
                                            <div style="font-weight: 500; color: #333;">${user.displayName}</div>
                                            <div style="font-size: 12px; color: #666;">${user.emailAddress}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        ${role.groups.length > 0 ? `
                            <div>
                                <h4 style="margin: 0 0 10px 0; color: #555; font-size: 14px;">Groups:</h4>
                                ${role.groups.map(group => `
                                    <div style="padding: 8px 12px; background: #e3f2fd; border-radius: 4px; margin-bottom: 5px;">
                                        <strong>${group.name}</strong> (ID: ${group.id})
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        content.innerHTML = html;
    }
})();
