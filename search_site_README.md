# Google Site Search

Performs a Google search restricted to the current website ("site search") using terms provided by the user.

## Purpose

This bookmarklet allows you to quickly search the content of the website you are currently viewing using Google's search engine. This is often more powerful or convenient than a website's built-in search functionality.

## Features

-   **Site-Specific Search**: Automatically adds the `site:currentdomain.com` operator to the Google search query.
-   **User Input**: Prompts the user to "Enter site search terms".
-   **Domain Cleaning**: Removes `www.` from the hostname for broader site search results (e.g., searches `example.com` even if on `www.example.com`).
-   **Google Powered**: Opens the search results in a new tab on `google.com`.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=search_site.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [search_site.js file](https://github.com/oaustegard/bookmarklets/blob/main/search_site.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Search This Site").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to any webpage on the site you want to search.
2.  Click the "Search This Site" bookmarklet.
3.  A prompt will appear asking "Enter site search terms". Type your search query and click "OK" or press Enter.
4.  A new tab will open with Google search results for your terms, limited to the current website.
5.  If you cancel the prompt or enter no search terms, it will still perform a site search, potentially showing all indexed pages for that site or an empty query.

## How It Works

1.  **Get Hostname**: Retrieves the hostname of the current page using `location.hostname`.
2.  **Clean Hostname**: Removes the "www." prefix if present: `location.hostname.replace("www.","")`.
3.  **Prompt for Search Terms**: Uses `window.prompt("Enter site search terms")` to get the user's query.
4.  **Construct Google URL**: Builds a Google search URL:
    `"https://www.google.com/search?q=site:" + cleanedHostname + " " + userSearchTerms`
5.  **Open Search**: Opens this URL in a new tab using `window.open()`.

## Technical Notes

-   The effectiveness of the search depends on Google's indexing of the target website.
-   If the user cancels the prompt, `window.prompt` returns `null`. When concatenated into the URL, this `null` will likely be converted to the string "null", so the search might include the word "null" if no terms are entered.
-   The `replace("www.","")` is a simple string replacement and might not be robust for all possible subdomain structures if the goal was to always get the root domain (e.g., `blog.example.com` would become `blog.example.com`, not `example.com`).

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/search_site.js):
```javascript
javascript:(function(){window.open("https://www.google.com/search?q=site:"+location.hostname.replace("www.","")+" "+window.prompt("Enter site search terms"))})()
```
