# GitHub Pages to Repo Bookmarklet

This bookmarklet quickly converts a GitHub Pages URL (github.io) to its corresponding GitHub repository URL.

## Use Case

When browsing GitHub Pages websites, you might want to quickly access the source repository. This bookmarklet automates that process, saving you time and clicks.

## Installation

To install the bookmarklet, drag the following link to your bookmarks bar:

[GitHub Pages to Repo](javascript:(function()%7Bvar%20currentUrl%3Dwindow.location.href%3Bvar%20regex%3D%2F%5Ehttps%3F%3A%5C%2F%5C%2F(%5B%5E.%5D%2B)%5C.github%5C.io%5C%2F(%5B%5E%2F%5D%2B)%2F%3Bvar%20match%3DcurrentUrl.match(regex)%3Bif(match)%7Bvar%20username%3Dmatch%5B1%5D%3Bvar%20repoName%3Dmatch%5B2%5D%3Bvar%20repoUrl%3D'https%3A%2F%2Fgithub.com%2F'%2Busername%2B'%2F'%2BrepoName%2B'%2F'%3Bwindow.location.href%3DrepoUrl%3B%7Delse%7Balert('This%20doesn%5C't%20appear%20to%20be%20a%20valid%20github.io%20URL.')%3B%7D%7D)())

## Usage

1. Navigate to any GitHub Pages website (e.g., https://username.github.io/repo-name/).
2. Click the "GitHub Pages to Repo" bookmarklet in your bookmarks bar.
3. You'll be redirected to the corresponding GitHub repository.

If you're not on a valid GitHub Pages URL, you'll see an alert message.

## Note

This bookmarklet doesn't attempt to locate the exact source file for the page you're on, as this can vary depending on the GitHub Action that generates the site.
