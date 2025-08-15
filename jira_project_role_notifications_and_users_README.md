# Jira Project Notifications & Recipients Bookmarklet

A comprehensive bookmarklet for Jira Datacenter administrators that provides a detailed view of notification events and their recipients, with intelligent role resolution that expands role-based recipients to show actual users and groups while clearly identifying dynamic notification targets.

## Purpose

This bookmarklet addresses the complexity of understanding who receives notifications for various project events in Jira. Notification schemes can be intricate, mixing role-based recipients, dynamic targets (like "Current Assignee"), and specific users/groups. When activated, this bookmarklet:

- **Parses notification events** from the project's notification scheme
- **Intelligently resolves role-based recipients** to actual users and groups with email addresses
- **Uses smart role matching** including partial matching for role names that don't exactly match
- **Categorizes notification targets** into roles, dynamic recipients, and other types
- **Explains dynamic recipients** like "Current Assignee" and "All Watchers" 
- **Presents organized information** showing who gets notified for each event type
- **Provides detailed debugging information** via console logging
- **Exports comprehensive HTML reports** suitable for compliance auditing and documentation
- **Eliminates manual cross-referencing** between notification schemes and role assignments

## Installation

1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=jira_project_role_notifications_and_users.js)
2. Drag the bookmarklet to your bookmarks bar
3. Alternatively, create a new bookmark and paste the code manually

## Usage

1. Navigate to a project's notifications page in Jira (e.g., `https://your-jira.com/plugins/servlet/project-config/PROJECT-KEY/notifications`)
2. Click the bookmarklet in your bookmarks bar
3. A modal will appear showing all notification events with their resolved recipients
4. Review the categorized recipients for each event type
5. Click "Download HTML" to generate a comprehensive report file
6. Close the modal by clicking the X or clicking outside the modal

## What You'll See

For each notification event, the bookmarklet displays:

### Role-Based Recipients
- **Resolved role names** showing exact matches or partial matches (e.g., "Lead (matched: Project Lead)")
- **Individual users** with full names and email addresses for each role
- **Groups** assigned to roles that receive notifications
- **Empty roles** clearly marked when no users are assigned
- **Member counts** showing total users and groups per role

### Dynamic Recipients  
- **Context-dependent targets** like "Current Assignee" or "Reporter"
- **Clear explanations** of when these recipients apply
- **Warning note** that these depend on issue context at notification time

### Other Recipients
- **Specific users/groups** configured directly in the notification scheme
- **Unknown recipient types** with explanatory notes

### Error Handling
- **API warning banner** when role membership data cannot be loaded
- **Graceful degradation** - continues to show available information even if API fails
- **Console debugging** information for troubleshooting

## How It Works

The bookmarklet uses intelligent role detection and matching:

1. **Extracts the project key** from the current notifications page URL
2. **Parses the notifications table** to map events to recipient types
3. **Identifies potential role names** using smart filtering that excludes definitely dynamic recipients while preserving legitimate role names like "Project Lead" or "Component Manager"
4. **Makes an authenticated API call** to fetch role membership data
5. **Uses enhanced role matching**:
   - Tries exact role name matches first
   - Falls back to partial matching (handles cases where "Lead" maps to "Project Lead")
   - Shows matched role names when partial matching is used
6. **Categorizes recipients** into roles, dynamic targets, and other types
7. **Resolves role-based recipients** to actual users and groups with email addresses
8. **Displays results** in an organized modal with explanatory context and visual indicators
9. **Generates downloadable HTML reports** with professional formatting

## Debugging Features

The bookmarklet includes comprehensive console logging to help administrators troubleshoot:

- **Role detection**: Shows which notification recipients are identified as potential roles
- **API responses**: Logs the roles returned by the API and their member counts  
- **Role matching**: Shows when partial matching is used (e.g., "Lead" matched to "Project Lead")
- **Member resolution**: Displays user and group counts for each resolved role
- **Error handling**: Clear error messages when API calls fail

To view debugging information:
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Run the bookmarklet
4. Watch for detailed logging messages

## Requirements

- Must be run from a Jira project notifications page
- Requires appropriate administrative permissions to view role memberships
- Works with Jira Datacenter instances (tested with standard notification schemes)

## Recipient Types Explained

### Role-Based Recipients
These are project roles (like "Developers" or "Administrators") that contain specific users and groups. The bookmarklet uses intelligent matching to resolve these:

- **Exact matching**: "Developers" notification recipient matches "Developers" role exactly
- **Partial matching**: "Lead" notification recipient matches "Project Lead" role  
- **Display clarity**: Shows matched role names when partial matching is used
- **Full resolution**: Displays actual users with email addresses and group memberships

### Dynamic Recipients
These are context-dependent targets that change based on the specific issue:
- **Current Assignee**: Whoever is assigned to the issue when the event occurs
- **Reporter**: The user who originally reported/created the issue
- **All Watchers**: Anyone currently watching the issue
- **Component Lead**: Lead of the component(s) affected by the issue
- **Project Lead**: The designated lead of the project

### Other Recipients
These include specific users or groups configured directly in the notification scheme, rather than through roles.

## Export Features

The HTML export includes:
- **Professional formatting** suitable for compliance documentation
- **Complete notification audit trail** for the project
- **Enhanced role information** showing matched role names and full member details
- **Categorized recipient information** with clear explanations
- **Responsive design** that works on mobile devices
- **Timestamp and project identification** for record-keeping
- **Color-coded sections** for easy navigation
- **Warning indicators** when role data is incomplete

## Limitations

- **Dynamic recipients** (like "Current Assignee") cannot be resolved to specific users without issue context
- **Custom notification schemes** may use recipient types not recognized by the bookmarklet
- **API permissions** may limit access to role membership data in some configurations
- **Partial role matching** may occasionally match unintended roles (check console output for verification)

## Troubleshooting

The bookmarklet includes comprehensive error handling and debugging:

### Common Issues
- **"Notifications table not found"**: Ensure you're on the project notifications configuration page
- **Missing role data**: Check that you have appropriate permissions to view project role memberships
- **Empty results**: Verify the notification scheme is configured and visible on the page
- **Roles not expanding**: Check browser console for detailed logging about role detection and API responses

### Debugging Steps
1. **Open Developer Tools** (F12) and go to the Console tab
2. **Run the bookmarklet** and watch for console messages
3. **Look for role detection messages**: "Added potential role: [name]"
4. **Check API response logging**: Shows which roles were returned by the API
5. **Verify role matching**: Messages show when partial matching is used
6. **Review error messages**: Clear indicators when API calls fail

### What the Console Shows
- Potential role names identified from notification recipients
- API response details including available roles and member counts
- Role matching results (exact vs partial matches)
- Individual role processing with user/group counts
- Error details if API calls fail

If roles are not expanding properly, the console output will show exactly where the process breaks down, making it easier to identify permission issues or configuration problems.

## Source Code

The full source code will be available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_notifications_and_users.js)
