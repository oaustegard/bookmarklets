javascript:(function(){
    /* @title: Extract Jira Role Notifications */
    /* @description: Extracts project role notification settings and user memberships from Jira */
    /* @domains: jira.meso-scale.com */
    /* Extract project key from URL */
    const projectKey = window.location.pathname.match(/\/project-config\/([^\/]+)/)?.[1];

    if (!projectKey) {
        alert('Must be run from a project notifications page');
        return;
    }

    console.log('Processing notifications for project:', projectKey);
    
    /* Find the notifications table */
    const notificationsTable = document.querySelector('#project-config-notifications-table');
    if (!notificationsTable) {
        alert('Notifications table not found on this page');
        return;
    }
    
    /* Extract notifications data */
    console.log('Extracting notifications data...');
    const eventNotifications = [];
    const roleNames = new Set();
    
    /* Process each notification row */
    const rows = notificationsTable.querySelectorAll('tbody tr.project-config-notification');
    
    rows.forEach(row => {
        const eventCell = row.querySelector('.project-config-notification-name');
        const notificationsList = row.querySelector('.project-config-notification-entitylist ul');
        
        if (!eventCell || !notificationsList) return;
        
        const eventName = eventCell.textContent.trim();
        const notifications = [];
        
        /* Extract notification recipients */
        const listItems = notificationsList.querySelectorAll('li');
        listItems.forEach(li => {
            const recipient = li.textContent.trim();
            notifications.push(recipient);
            
            /* Check if this might be a role name - simple heuristic: doesn't contain common keywords */
            const dynamicKeywords = ['Current', 'All', 'Reporter', 'Creator', 'Lead', 'Manager'];
            const isDynamic = dynamicKeywords.some(keyword => recipient.includes(keyword));
            
            if (!isDynamic && recipient.length > 0) {
                roleNames.add(recipient);
            }
        });
        
        eventNotifications.push({
            event: eventName,
            recipients: notifications
        });
    });

    console.log('Notifications processed:', eventNotifications.length, 'events,', roleNames.size, 'potential roles');
    
    /* Fetch role data for potential roles */
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
        
        /* Create role lookup map */
        const roleUsersMap = new Map();
        data.roles.forEach(role => {
            roleUsersMap.set(role.name, role);
        });
        
        /* Process notifications with user resolution */
        const processedNotifications = processNotifications(eventNotifications, roleUsersMap);
        console.log('Processed notifications:', processedNotifications);
        
        /* Display results */
        displayResults(processedNotifications, projectKey);
    })
    .catch(error => {
        console.error('Error fetching roles:', error);
        /* Continue without role data */
        console.log('Proceeding without role user data...');
        const processedNotifications = processNotifications(eventNotifications, new Map());
        displayResults(processedNotifications, projectKey);
    });
    
    /* Process notifications and categorize recipients */
    function processNotifications(notifications, roleUsersMap) {
        console.log('Processing', notifications.length, 'notifications with', roleUsersMap.size, 'roles');
        console.log('Available roles:', Array.from(roleUsersMap.keys()));
        
        return notifications.map(notification => {
            console.log('Processing notification event:', notification.event);
            console.log('Recipients for this event:', notification.recipients);
            
            const processedRecipients = notification.recipients.map(recipient => {
                console.log('Processing recipient:', recipient);
                
                /* Check if recipient is a known role (exact match first) */
                let roleData = roleUsersMap.get(recipient);
                let matchedRoleName = recipient;
                
                if (!roleData) {
                    /* Try partial matching like in the permissions bookmarklet */
                    for (let [roleName, data] of roleUsersMap.entries()) {
                        if (roleName.includes(recipient) || recipient.includes(roleName)) {
                            roleData = data;
                            matchedRoleName = roleName;
                            console.log('Found role match:', recipient, '->', roleName);
                            break;
                        }
                    }
                }
                
                if (roleData) {
                    console.log('Role', recipient, 'has', roleData.total, 'members:', roleData.users?.length || 0, 'users,', roleData.groups?.length || 0, 'groups');
                    return {
                        type: 'role',
                        name: recipient,
                        matchedRoleName: matchedRoleName,
                        users: roleData.users || [],
                        groups: roleData.groups || [],
                        total: roleData.total || 0
                    };
                }
                
                /* Categorize other recipient types */
                const dynamicKeywords = {
                    'Current Assignee': 'dynamic',
                    'Reporter': 'dynamic', 
                    'Creator': 'dynamic',
                    'All Watchers': 'dynamic',
                    'Component Lead': 'dynamic',
                    'Project Lead': 'dynamic'
                };
                
                const recipientType = dynamicKeywords[recipient] || 'unknown';
                console.log('Recipient', recipient, 'categorized as:', recipientType);
                
                return {
                    type: recipientType,
                    name: recipient,
                    description: getRecipientDescription(recipient)
                };
            });
            
            return {
                event: notification.event,
                recipients: processedRecipients
            };
        });
    }
    
    /* Get description for dynamic recipient types */
    function getRecipientDescription(recipient) {
        const descriptions = {
            'Current Assignee': 'The user currently assigned to the issue',
            'Reporter': 'The user who reported/created the issue',
            'Creator': 'The user who created the issue',
            'All Watchers': 'All users watching the issue',
            'Component Lead': 'Lead of the component(s) affected by the issue',
            'Project Lead': 'Lead of the project',
            'Single User': 'A specific user (configured in notification scheme)',
            'Single Group': 'A specific group (configured in notification scheme)',
            'Current User': 'The user performing the action'
        };
        
        return descriptions[recipient] || 'Notification recipient';
    }
    
    /* Display results in overlay */
    function displayResults(notificationsData, projectKey) {
        console.log('Displaying results for', notificationsData.length, 'notification events');
        
        /* Store data for download */
        window.jiraNotificationsData = { projectKey, notifications: notificationsData };
        
        /* Create overlay */
        const overlay = document.createElement('div');
        overlay.id = 'jira-notifications-overlay';
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
        title.textContent = `Project Notifications & Recipients: ${projectKey}`;
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
        const roleCount = notificationsData.reduce((count, notification) => {
            return count + notification.recipients.filter(r => r.type === 'role').length;
        }, 0);
        summary.innerHTML = `
            <h3 style="margin: 0 0 5px 0;">Summary</h3>
            <p style="margin: 0;">Found ${notificationsData.length} notification events with ${roleCount} role-based recipients</p>
        `;
        content.appendChild(summary);
        
        /* Generate notification content */
        notificationsData.forEach(notification => {
            const notificationDiv = document.createElement('div');
            notificationDiv.style.cssText = `
                margin-bottom: 25px; border: 1px solid #ddd; border-radius: 4px;
            `;
            
            /* Notification header */
            const notificationHeader = document.createElement('div');
            notificationHeader.style.cssText = `
                background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd;
            `;
            notificationHeader.innerHTML = `<h3 style="margin: 0;">${notification.event}</h3>`;
            notificationDiv.appendChild(notificationHeader);
            
            /* Notification content */
            const notificationContent = document.createElement('div');
            notificationContent.style.cssText = `
                padding: 15px;
            `;
            
            /* Process recipients by type */
            const roleRecipients = notification.recipients.filter(r => r.type === 'role');
            const dynamicRecipients = notification.recipients.filter(r => r.type === 'dynamic');
            const otherRecipients = notification.recipients.filter(r => r.type !== 'role' && r.type !== 'dynamic');
            
            let contentHtml = '';
            
            /* Role-based recipients */
            if (roleRecipients.length > 0) {
                contentHtml += `<h4 style="margin: 0 0 10px 0; color: #333;">Role-Based Recipients</h4>`;
                roleRecipients.forEach(recipient => {
                    contentHtml += `
                        <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                            <h5 style="margin: 0 0 8px 0; color: #0052cc;">${recipient.name}</h5>`;
                    
                    if (recipient.users.length > 0) {
                        contentHtml += `<div style="margin-bottom: 8px;">
                            <strong style="font-size: 12px; color: #666;">Users:</strong><br>`;
                        recipient.users.forEach(user => {
                            contentHtml += `<span style="font-size: 12px; margin-right: 15px;">${user.displayName} (${user.emailAddress})</span><br>`;
                        });
                        contentHtml += `</div>`;
                    }
                    
                    if (recipient.groups.length > 0) {
                        contentHtml += `<div style="margin-bottom: 8px;">
                            <strong style="font-size: 12px; color: #666;">Groups:</strong><br>`;
                        recipient.groups.forEach(group => {
                            contentHtml += `<span style="font-size: 12px; margin-right: 15px;">${group.name}</span><br>`;
                        });
                        contentHtml += `</div>`;
                    }
                    
                    if (recipient.users.length === 0 && recipient.groups.length === 0) {
                        contentHtml += `<span style="font-size: 12px; color: #999; font-style: italic;">No members in this role</span>`;
                    }
                    
                    contentHtml += `</div>`;
                });
            }
            
            /* Dynamic recipients */
            if (dynamicRecipients.length > 0) {
                contentHtml += `<h4 style="margin: 15px 0 10px 0; color: #333;">Dynamic Recipients</h4>`;
                contentHtml += `<div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                    <small style="color: #856404;"><strong>Note:</strong> These recipients are determined at the time of the event and depend on issue context.</small>
                </div>`;
                dynamicRecipients.forEach(recipient => {
                    contentHtml += `
                        <div style="margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px;">
                            <strong style="color: #0052cc;">${recipient.name}</strong><br>
                            <small style="color: #666;">${recipient.description}</small>
                        </div>`;
                });
            }
            
            /* Other recipients */
            if (otherRecipients.length > 0) {
                contentHtml += `<h4 style="margin: 15px 0 10px 0; color: #333;">Other Recipients</h4>`;
                otherRecipients.forEach(recipient => {
                    contentHtml += `
                        <div style="margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px;">
                            <strong style="color: #0052cc;">${recipient.name}</strong><br>
                            <small style="color: #666;">${recipient.description || 'Specific user or group configured in notification scheme'}</small>
                        </div>`;
                });
            }
            
            notificationContent.innerHTML = contentHtml;
            notificationDiv.appendChild(notificationContent);
            content.appendChild(notificationDiv);
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
        const data = window.jiraNotificationsData;
        if (!data) return;
        
        console.log('Generating HTML download...');
        
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Notifications & Recipients: ${data.projectKey}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.4; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #0052cc; color: white; padding: 20px; border-radius: 4px; margin-bottom: 20px; }
        .notification { border: 1px solid #ddd; margin-bottom: 20px; border-radius: 4px; }
        .notification-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #ddd; }
        .notification-content { padding: 15px; }
        .recipient-section h4 { margin: 15px 0 10px 0; color: #333; }
        .recipient-section h4:first-child { margin-top: 0; }
        .role-recipient { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px; }
        .role-recipient h5 { margin: 0 0 8px 0; color: #0052cc; }
        .dynamic-recipient, .other-recipient { margin-bottom: 8px; padding: 8px; background: #f9f9f9; border-radius: 4px; }
        .note { background: #fff3cd; padding: 10px; border-radius: 4px; margin-bottom: 10px; color: #856404; }
        h1, h2, h3 { margin-top: 0; }
        .user-list, .group-list { font-size: 12px; margin-bottom: 8px; }
        .user-list strong, .group-list strong { color: #666; }
        @media (max-width: 768px) { body { padding: 10px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Project Notifications & Recipients: ${data.projectKey}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
    </div>
`;

        data.notifications.forEach(notification => {
            htmlContent += `
    <div class="notification">
        <div class="notification-header">
            <h2>${notification.event}</h2>
        </div>
        <div class="notification-content">`;
        
            /* Process recipients by type */
            const roleRecipients = notification.recipients.filter(r => r.type === 'role');
            const dynamicRecipients = notification.recipients.filter(r => r.type === 'dynamic');
            const otherRecipients = notification.recipients.filter(r => r.type !== 'role' && r.type !== 'dynamic');
            
            /* Role-based recipients */
            if (roleRecipients.length > 0) {
                htmlContent += `<div class="recipient-section">
                    <h4>Role-Based Recipients</h4>`;
                
                roleRecipients.forEach(recipient => {
                    htmlContent += `
                    <div class="role-recipient">
                        <h5>${recipient.name}</h5>`;
                    
                    if (recipient.users.length > 0) {
                        htmlContent += `<div class="user-list">
                            <strong>Users:</strong><br>`;
                        recipient.users.forEach(user => {
                            htmlContent += `${user.displayName} (${user.emailAddress})<br>`;
                        });
                        htmlContent += `</div>`;
                    }
                    
                    if (recipient.groups.length > 0) {
                        htmlContent += `<div class="group-list">
                            <strong>Groups:</strong><br>`;
                        recipient.groups.forEach(group => {
                            htmlContent += `${group.name}<br>`;
                        });
                        htmlContent += `</div>`;
                    }
                    
                    if (recipient.users.length === 0 && recipient.groups.length === 0) {
                        htmlContent += `<em style="color: #999;">No members in this role</em>`;
                    }
                    
                    htmlContent += `</div>`;
                });
                
                htmlContent += `</div>`;
            }
            
            /* Dynamic recipients */
            if (dynamicRecipients.length > 0) {
                htmlContent += `<div class="recipient-section">
                    <h4>Dynamic Recipients</h4>
                    <div class="note">
                        <strong>Note:</strong> These recipients are determined at the time of the event and depend on issue context.
                    </div>`;
                
                dynamicRecipients.forEach(recipient => {
                    htmlContent += `
                    <div class="dynamic-recipient">
                        <strong>${recipient.name}</strong><br>
                        <small>${recipient.description}</small>
                    </div>`;
                });
                
                htmlContent += `</div>`;
            }
            
            /* Other recipients */
            if (otherRecipients.length > 0) {
                htmlContent += `<div class="recipient-section">
                    <h4>Other Recipients</h4>`;
                
                otherRecipients.forEach(recipient => {
                    htmlContent += `
                    <div class="other-recipient">
                        <strong>${recipient.name}</strong><br>
                        <small>${recipient.description || 'Specific user or group configured in notification scheme'}</small>
                    </div>`;
                });
                
                htmlContent += `</div>`;
            }
            
            htmlContent += `
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
        a.download = `jira-notifications-recipients-${data.projectKey}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('HTML download completed');
    }
})();
