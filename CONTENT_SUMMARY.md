# Index of Files in 'oaustegard/bookmarklets/'

## [.DS_Store](https://github.com/oaustegard/bookmarklets/blob/main/.DS_Store)

The provided files include scripts for manipulating Markdown content, conducting AI tests, searching a website, speeding up videos, and generating Markdown files from JIRA. There are also files for translating LaTeX books and copying URLs.

## [.gitignore](https://github.com/oaustegard/bookmarklets/blob/main/.gitignore)

The file contains a list of file types and directories to be ignored by version control systems like Git, focusing on Visual Studio and related tools. It excludes user-specific files, build results, cache directories, test results, and various auto-generated files to maintain a clean repository.

## [CONTENT_SUMMARY.md](https://github.com/oaustegard/bookmarklets/blob/main/CONTENT_SUMMARY.md)

The files in the 'oaustegard/bookmarklets/' repository include a variety of bookmarklets for tasks like extracting ride summaries from Strava, collecting Twitter data, converting HTML to Markdown, modifying webpage elements, and generating Markdown documentation using the OpenAI API. Each file serves a specific function, such as displaying ride summaries, extracting highlights, copying links, converting colors, and manipulating webpage content.

## [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

The code file is released under the MIT License by Oskar Austegard in 2023. It grants permission to use, modify, distribute, and sell the software with conditions. The software is provided without warranty, and the authors are not liable for any damages.

## [README.md](https://github.com/oaustegard/bookmarklets/blob/main/README.md)

The code files in this collection contain various bookmarklets for different purposes. For detailed information, refer to the CONTENT_SUMMARY.md file.

## [StravaDisplayRideSummaries.js](https://github.com/oaustegard/bookmarklets/blob/main/StravaDisplayRideSummaries.js)

The code retrieves stored ride summaries from local storage, removes specified phrases, and displays the formatted data in a new window.

## [StravaExcerpt.js](https://github.com/oaustegard/bookmarklets/blob/main/StravaExcerpt.js)

The code defines functions to extract and display Strava ride highlights and interesting segments based on specified power and speed thresholds. It combines and formats the data for display in a new window.

## [StravaShortExcerpt.js](https://github.com/oaustegard/bookmarklets/blob/main/StravaShortExcerpt.js)

The code retrieves the text from a specific section on a webpage and saves it in local storage as part of an array of ride summaries.

## [TwitterConversationExtractor.js](https://github.com/oaustegard/bookmarklets/blob/main/TwitterConversationExtractor.js)

The code collects tweets and their popularity data from a webpage by scrolling and extracting text and popularity information from specific elements. It then displays the collected data in a new window.

## [_c.js](https://github.com/oaustegard/bookmarklets/blob/main/_c.js)

The code snippet appends a script to ensure the availability of the console object for a bookmarklet, creating an alias _c for it if available, copying its properties to _c.

## [_copyToClip.js](https://github.com/oaustegard/bookmarklets/blob/main/_copyToClip.js)

The code defines a utility function to copy text to the clipboard using execCommand, ensuring both formatted and plaintext versions are copied. It adds event listeners for copying, sets clipboard data, and removes the listener after copying.

## [_lg.js](https://github.com/oaustegard/bookmarklets/blob/main/_lg.js)

The code snippet creates a function '_lg' that logs messages to the console in bookmarklets where 'console.log' does not work. It appends a script element to the document body for debugging purposes.

## [_turndown_min.js](https://github.com/oaustegard/bookmarklets/blob/main/_turndown_min.js)

Minified code provides a TurndownService for converting HTML to Markdown. It includes rules for handling various HTML elements and generates Markdown output accordingly. The code uses a DOMParser for parsing HTML and implements rules for different Markdown elements like headings, lists, code blocks, and links.

## [arxiv_abstract.js](https://github.com/oaustegard/bookmarklets/blob/main/arxiv_abstract.js)

The code checks if the current page is on 'arxiv.org', then replaces '/pdf/' with '/abs/' and removes '.pdf' from the URL before opening the new URL in a new tab.

## [closest_anchor.js](https://github.com/oaustegard/bookmarklets/blob/main/closest_anchor.js)

The code extracts the parent element of the selected text, finds the nearest element with an ID or anchor name, and updates the URL hash with the element's ID or name if found.

## [confluence_link.js](https://github.com/oaustegard/bookmarklets/blob/main/confluence_link.js)

The code dynamically creates a script element, copies specified content to the clipboard in HTML and plain text formats, and handles errors. It extracts page metadata from a Confluence page and generates markdown and HTML links for copying.

## [confluence_preview_attachments.js](https://github.com/oaustegard/bookmarklets/blob/main/confluence_preview_attachments.js)

The code modifies a table on a webpage by adding a 'Preview' column to the header row and inserting image previews of file attachments next to each file link in the body rows.

## [copy_as_markdown.js](https://github.com/oaustegard/bookmarklets/blob/main/copy_as_markdown.js)

The code dynamically adds a function to log messages, converts selected HTML content to Markdown format, copies it to the clipboard, and displays it in a new window. It also includes a Turndown library for HTML to Markdown conversion.

## [copy_url.js](https://github.com/oaustegard/bookmarklets/blob/main/copy_url.js)

The code creates a pop-up window with a form to input a URL and link title. Upon clicking 'Copy & Close', it generates an HTML link and Markdown link, copies them to the clipboard, and closes the window.

## [css_colors.js](https://github.com/oaustegard/bookmarklets/blob/main/css_colors.js)

The code file contains functions to convert RGB to HSL values and extract color rules from CSS stylesheets. It then sorts colors based on HSL values and displays color swatches with associated CSS rules in a new window.

## [drag_drop_and_delete.js](https://github.com/oaustegard/bookmarklets/blob/main/drag_drop_and_delete.js)

The code defines functions to outline and move an element on hover, drag it on click, delete it on key press, and clean up event listeners. It enables interactive element manipulation on a webpage.

## [edge.js](https://github.com/oaustegard/bookmarklets/blob/main/edge.js)

The code redirects the current webpage to open in the Microsoft Edge browser by modifying the URL with the "microsoft-edge:" protocol.

## [edit_page.js](https://github.com/oaustegard/bookmarklets/blob/main/edit_page.js)

The code toggles the contentEditable property of the document body to enable/disable editing mode and sets the designMode accordingly for the webpage.

## [find_and_replace.js](https://github.com/oaustegard/bookmarklets/blob/main/find_and_replace.js)

The code defines a function to replace text in an HTML element recursively. It prompts users to input text to find and text to replace, then replaces the found text with the replacement text in the HTML content.

## [generate_md_files.py](https://github.com/oaustegard/bookmarklets/blob/main/generate_md_files.py)

The code defines functions to list files in a directory, read file content, invoke an API to generate Markdown documentation based on JavaScript code, and write the documentation to a file. It utilizes OpenAI's GPT-3 model to create structured documentation for bookmarklets in specified directories, skipping files over 10000 characters. The script also handles CLI arguments for directory selection and file exclusion, providing a comprehensive Markdown documentation generation process.

## [jira_link.js](https://github.com/oaustegard/bookmarklets/blob/main/jira_link.js)

The code extracts data from a webpage and creates a markdown and HTML link with specific information like key, summary, status, priority, type, and assignee. It then copies this formatted data to the clipboard when triggered.

## [markdown_body.js](https://github.com/oaustegard/bookmarklets/blob/main/markdown_body.js)

The code dynamically creates a 'TurndownService' to convert HTML content to Markdown. It identifies the main content element, removes unwanted elements, converts the content to Markdown, copies it to the clipboard, and displays it in a new window.

## [mastodon.social_profile.js](https://github.com/oaustegard/bookmarklets/blob/main/mastodon.social_profile.js)

The code extracts a username from a meta tag with property 'profile:username' and opens a new window with the username appended to a Mastodon social link. It alerts if the meta tag is missing.

## [search_site.js](https://github.com/oaustegard/bookmarklets/blob/main/search_site.js)

The code opens a new browser window with a Google search for specific terms within the current website's domain, excluding 'www.' from the search.

## [speed_up_video.js](https://github.com/oaustegard/bookmarklets/blob/main/speed_up_video.js)

Appends a script to the body that enhances console functionality. Defines a function to increase playback rate of videos in iframes and logs the changes to the console. It recursively searches for videos in iframes and adjusts their playback rate.

## [strava_excerpt.js](https://github.com/oaustegard/bookmarklets/blob/main/strava_excerpt.js)

The code defines functions to extract and display Strava ride highlights and interesting segments based on specified power and speed thresholds. It combines and formats the data for display in a new window.

## [strava_gpx_link.js](https://github.com/oaustegard/bookmarklets/blob/main/strava_gpx_link.js)

The code adds a 'GPX Data' link next to elements with the attribute 'data-field-name=name' on a webpage, linking to the GPX export of the element's href.

