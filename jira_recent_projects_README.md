# Jira Recent Projects Bookmarklet

A handy bookmarklet that displays an expanded list of your most recently visited Jira projects, showing up to 20 projects instead of the default 5 shown in the Jira UI.

## Purpose

This bookmarklet solves a common limitation in Jira: the default recent projects dropdown only shows 5 projects. When activated, this bookmarklet:

- Displays up to 20 of your most recently visited projects
- Shows each project's name, key, and category
- Presents the information in a clean, well-formatted modal dialog
- Allows easy navigation to any project with a single click

## Installation

1. Visit the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=jira_recent_projects.js)
2. Drag the bookmarklet to your bookmarks bar
3. Alternatively, create a new bookmark and paste the code manually

## Usage

1. Navigate to any page in your Jira instance
2. Click the bookmarklet in your bookmarks bar
3. A modal will appear showing your 20 most recently visited projects
4. Click any project to navigate directly to it
5. Close the modal by clicking the X, pressing ESC, or clicking outside the modal

## How It Works

The bookmarklet:
1. Makes an authenticated API call to Jira's recent projects endpoint
2. Creates a modal overlay to display the results
3. Renders each project with its avatar, name, key, and category
4. Provides multiple ways to dismiss the modal when finished

## Configuration

You can modify the number of projects shown by editing the bookmarklet code and changing the `maxProjects` value in the configuration section.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/jira_recent_projects.js)
