# GitHub Pages to Repo Bookmarklet

This bookmarklet quickly converts a GitHub Pages (github.io) URL to its corresponding GitHub repository URL.

## Use Case

When browsing GitHub Pages websites, you might want to quickly access the source repository. This bookmarklet automates that process, saving you time and effort.

## How It Works

1. Click the bookmarklet while on a github.io page.
2. The bookmarklet extracts the username and repository name from the URL.
3. It then redirects you to the corresponding GitHub repository.

## Installation

1. Create a new bookmark in your browser.
2. Name it "GitHub Pages to Repo" (or any name you prefer).
3. In the URL field, paste the entire code from the [github_io_to_repo.js](github_io_to_repo.js) file.

## Usage

Simply click the bookmarklet when you're on a github.io page to be redirected to its repository.

## Example

- From: `https://username.github.io/repository/`
- To: `https://github.com/username/repository/`

## Limitations

- Works only on properly formatted github.io URLs.
- Does not locate specific files within the repository.

## Code

The JavaScript code for this bookmarklet can be found in the [github_io_to_repo.js](github_io_to_repo.js) file in this repository.
