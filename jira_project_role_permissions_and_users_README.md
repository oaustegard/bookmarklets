# Jira Project Roles & Permissions Bookmarklet

A comprehensive bookmarklet for Jira Datacenter administrators that provides an at-a-glance view of project role assignments and their associated permissions, combining user/group membership data with detailed permission mappings.

## Purpose

This bookmarklet solves a common administrative challenge in Jira: understanding who has what permissions in a project requires navigating between multiple screens and cross-referencing role assignments with permission schemes. When activated, this bookmarklet:

- Combines role membership data with permission assignments in a single view
- Shows both users and groups assigned to each role
- Displays all permissions granted to each role, organized by category
- Presents the information in a clean two-column layout (permissions | members)
- Exports comprehensive HTML reports suitable for compliance auditing and documentation
- Eliminates the need to manually cross-reference multiple Jira administration screens

## Installation

1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=jira_project_role_permissions_and_users.js)
2. Drag the bookmarklet to your bookmarks bar
3. Alternatively, create a new bookmark and paste the code manually

## Usage

1. Navigate to a project's permissions page in Jira (e.g., `https://your-jira.com/plugins/servlet/project-config/PROJECT-KEY/permissions`)
2. Click the bookmarklet in your bookmarks bar
3. A modal will appear showing all roles with their permissions and member assignments
4. Review the two-column layout: permissions on the left, members (users/groups) on the right
5. Click "Download HTML" to generate a comprehensive report file
6. Close the modal by clicking the X or clicking outside the modal

## What You'll See

For each project role, the bookmarklet displays:

### Permissions Column
- **Categorized permissions** (Project, Issue, Comments, Attachments, etc.)
- **Complete permission list** for that role
- **Organized by permission type** for easy scanning

### Members Column  
- **Individual users** with names and email addresses
- **Groups** assigned to the role
- **Clear indication** when roles have no members

## How It Works

The bookmarklet:
1. Extracts the project key from the current permissions page URL
2. Parses the existing permissions table to map permissions to roles
3. Makes an authenticated API call to fetch role membership data
4. Combines both datasets to create a comprehensive role-permission-member mapping
5. Displays results in an overlay modal with two-column layout
6. Generates downloadable HTML reports with professional formatting for documentation

## Requirements

- Must be run from a Jira project permissions page
- Requires appropriate administrative permissions to view role memberships
- Works with Jira Datacenter instances (tested with standard permission schemes)

## Export Features

The HTML export includes:
- Professional formatting suitable for compliance documentation
- Complete project role and permission audit trail
- Responsive design that works on mobile devices
- Timestamp and project identification for record-keeping
- Clean two-column layout maintained in the export

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_permissions_and_users.js)
