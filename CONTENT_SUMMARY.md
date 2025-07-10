# Bookmarklet Collection Summary

This document provides a summary of the bookmarklets and utility scripts available in the `oaustegard/bookmarklets` repository. Each bookmarklet is designed to perform a specific task to enhance browsing productivity or enable new functionalities on various websites.

## Bookmarklets and Utilities

Below is a list of available bookmarklets, their purpose, and links to their respective source code and detailed README files.

---

### _c - Console Alias
- **Purpose**: Utility bookmarklet that aliases the `console` object to `_c` for more concise logging in other bookmarklets.
- **Source**: [`_c.js`](https://github.com/oaustegard/bookmarklets/blob/main/_c.js)
- **Details**: [`_c_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/_c_README.md)

---

### _copyToClip - Clipboard Utility
- **Purpose**: A utility function to copy provided HTML (and optionally plain text) to the clipboard. Designed to be included or used by other bookmarklets.
- **Source**: [`_copyToClip.js`](https://github.com/oaustegard/bookmarklets/blob/main/_copyToClip.js)
- **Details**: [`_copyToClip_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/_copyToClip_README.md)

---

### _lg - Global Logger Utility
- **Purpose**: Provides a global `_lg()` function for logging messages to the console, useful when `console.log` might not work reliably in all bookmarklet contexts.
- **Source**: [`_lg.js`](https://github.com/oaustegard/bookmarklets/blob/main/_lg.js)
- **Details**: [`_lg_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/_lg_README.md)

---

### _turndown_min - HTML to Markdown Conversion Utility
- **Purpose**: Provides a minified version of the Turndown library (v7.1.2) to convert HTML content into Markdown, intended for use by other bookmarklets.
- **Source**: [`_turndown_min.js`](https://github.com/oaustegard/bookmarklets/blob/main/_turndown_min.js)
- **Details**: [`_turndown_min_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/_turndown_min_README.md)

---

### arXiv Abstract/PDF Toggle
- **Purpose**: Allows quick switching between an arXiv paper's abstract page and its PDF version (or vice-versa) in a new tab.
- **Source**: [`arxiv_abstract.js`](https://github.com/oaustegard/bookmarklets/blob/main/arxiv_abstract.js)
- **Details**: [`arxiv_abstract_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/arxiv_abstract_README.md)

---

### Bitbucket Terraform Highlighter
- **Purpose**: Applies JavaScript-like syntax highlighting to Terraform configuration files (`.tf`, `.tfvars`) viewed in Bitbucket. Click again to restore default highlighting.
- **Source**: [`bitbucket_tf_highlight.js`](https://github.com/oaustegard/bookmarklets/blob/main/bitbucket_tf_highlight.js)
- **Details**: [`bitbucket_tf_highlight_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bitbucket_tf_highlight_README.md)

---

### BlueSky Advanced Search
- **Purpose**: Enhances BlueSky by providing an intuitive graphical interface for constructing advanced search queries using BlueSky's search operators.
- **Source**: [`bsky_advanced_search.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_advanced_search.js)
- **Details**: [`bsky_advanced_search_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_advanced_search_README.md)

---

### Bluesky Markdown Link Post
- **Purpose**: Enhances BlueSky by enabling Markdown link syntax (`[text](url)`) for posts, replies, and quote posts, with context-aware actions.
- **Source**: [`bsky_markdown_link_post.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post.js)
- **Details**: [`bsky_markdown_link_post_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_markdown_link_post_README.md)

---

### Bluesky Post Processor Launcher
- **Purpose**: Opens the current BlueSky post in a dedicated BlueSky Processor tool (hosted on `austegard.com`) in a new tab for analysis or processing.
- **Source**: [`bsky_processor.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_processor.js)
- **Details**: [`bsky_processor_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_processor_README.md)

---

### BlueSky Profile Latest Posts Preview
- **Purpose**: Enhances BlueSky by allowing users to quickly preview a user's latest original posts by hovering over their profile link.
- **Source**: [`bsky_profile_latest_posts.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_profile_latest_posts.js)
- **Details**: [`bsky_profile_latest_posts_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_profile_latest_posts_README.md)

---

### BlueSky User Lists Viewer
- **Purpose**: Provides a modal overlay to display all public lists created by a BlueSky user when viewing their profile page.
- **Source**: [`bsky_user_lists.js`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_user_lists.js)
- **Details**: [`bsky_user_lists_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/bsky_user_lists_README.md)

---

### Instacart Cart Categorizer for Claude.ai
- **Purpose**: Extracts item names from an Instacart cart and sends them to Claude.ai with a prompt to categorize the items.
- **Source**: [`categorize_instacart.js`](https://github.com/oaustegard/bookmarklets/blob/main/categorize_instacart.js)
- **Details**: [`categorize_instacart_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/categorize_instacart_README.md)

---

### Claude.ai - Continue Chat Helper
- **Purpose**: Injects a pre-defined prompt into Claude.ai to help users continue a previous conversation in a new chat, especially when transferring context and artifacts.
- **Source**: [`claude_continue_chat.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_continue_chat.js)
- **Details**: [`claude_continue_chat_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_continue_chat_README.md)

---

### Claude Conversation Tree JSON Exporter
- **Purpose**: Exports the current Claude.ai conversation tree as a JSON object by opening a direct API link, useful for archiving or analysis.
- **Source**: [`claude_conversation_tree_json.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json.js)
- **Details**: [`claude_conversation_tree_json_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_conversation_tree_json_README.md)

---

### Claude Custom Instructions Enlarger
- **Purpose**: Enlarges the Custom Instructions textarea in Claude Projects for more convenient editing of large instructions.
- **Source**: [`claude_enlarge_custom_instruction_field.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_enlarge_custom_instruction_field.js)
- **Details**: [`claude_enlarge_custom_instruction_field_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_enlarge_custom_instruction_field_README.md)

---

### Claude JSON Renderer
- **Purpose**: Renders a Claude.ai conversation JSON export into a styled HTML page for easy reading, sharing, and downloading. Uses `marked.js` and `highlight.js`.
- **Source**: [`claude_json_renderer.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer.js)
- **Details**: [`claude_json_renderer_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer_README.md)

---

### Claude JSON Renderer 2 (Simplified)
- **Purpose**: A simpler alternative to `claude_json_renderer.js` that renders Claude.ai conversation JSON into basic styled HTML using Pico.css and custom code block formatting.
- **Source**: [`claude_json_renderer2.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer2.js)
- **Details**: [`claude_json_renderer2_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_json_renderer2_README.md)

---

### Claude Conversation Pruner/Selector (from JSON)
- **Purpose**: Provides an interactive UI from a Claude.ai JSON export to view, select, and export parts of a conversation (messages/artifacts) with word/token counts.
- **Source**: [`claude_prune_json.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_prune_json.js)
- **Details**: [`claude_prune_json_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_prune_json_README.md)

---

### Claude Conversation Pruner (Live)
- **Purpose**: A sophisticated tool for managing and pruning live Claude.ai conversations by extracting data, opening a pruner interface, and allowing selective export.
- **Source**: [`claude_pruner.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_pruner.js)
- **Details**: [`claude_pruner_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/claude_pruner_README.md)

---

### Closest Anchor Link
- **Purpose**: Updates the browser's URL hash to point to the nearest anchor (`id` attribute or `a[name]`) of the currently selected text, for easy section linking.
- **Source**: [`closest_anchor.js`](https://github.com/oaustegard/bookmarklets/blob/main/closest_anchor.js)
- **Details**: [`closest_anchor_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/closest_anchor_README.md)

---

### Confluence Page Link Copier
- **Purpose**: Copies a richly formatted link (Markdown and HTML) to the current Confluence page, using page title and space name.
- **Source**: [`confluence_link.js`](https://github.com/oaustegard/bookmarklets/blob/main/confluence_link.js)
- **Details**: [`confluence_link_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/confluence_link_README.md)

---

### Confluence Quick Meeting Notes Subpage
- **Purpose**: Creates a new "Meeting notes" page in Confluence as a child of the current page with a single click, using the "Meeting notes" blueprint.
- **Source**: [`confluence_meeting_notes_page.js`](https://github.com/oaustegard/bookmarklets/blob/main/confluence_meeting_notes_page.js)
- **Details**: [`confluence_meeting_notes_page_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/confluence_meeting_notes_page_README.md)

---

### Confluence Preview Attachments
- **Purpose**: Modifies a Confluence attachments table to add a 'Preview' column, inserting image previews of file attachments next to each file link.
- **Source**: [`confluence_preview_attachments.js`](https://github.com/oaustegard/bookmarklets/blob/main/confluence_preview_attachments.js)
- **Details**: (No specific README, summary from source)

---

### Copy as Markdown
- **Purpose**: Converts the currently selected HTML content on a page to Markdown (using Turndown library) and copies it to the clipboard, also displaying it in a new window.
- **Source**: [`copy_as_markdown.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_as_markdown.js)
- **Details**: [`copy_as_markdown_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_as_markdown_README.md)

---

### Table to JSON
- **Purpose**: Converts HTML tables on any webpage to a JSON array of objects, copied to the clipboard. Features visual table selection if multiple tables exist.
- **Source**: [`copy_table.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_table.js)
- **Details**: [`copy_table_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_table_README.md)

---

### Copy URL (Deprecated)
- **Purpose**: **Deprecated.** Was designed to open a popup to edit URL/title and copy as HTML/Markdown link. Fails due to CSP.
- **Source**: [`copy_url.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url.js)
- **Details**: [`copy_url_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_README.md)
- **Alternatives**: See `copy_url_as_link_light.js` and `copy_url_as_link_dark.js`.

---

### Copy URL as Link (Dark Theme)
- **Purpose**: Opens a small, dark-themed popup to edit the current page's URL/title and copies a formatted HTML and Markdown link. CSP-compliant.
- **Source**: [`copy_url_as_link_dark.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_dark.js)
- **Details**: [`copy_url_as_link_dark_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_dark_README.md)
- **Related Article**: [`copy_url_as_link_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_README.md)

---

### Copy URL as Link (Light Theme)
- **Purpose**: Opens a small, light-themed popup to edit the current page's URL/title and copies a formatted HTML and Markdown link. CSP-compliant.
- **Source**: [`copy_url_as_link_light.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_light.js)
- **Details**: [`copy_url_as_link_light_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_light_README.md)
- **Related Article**: [`copy_url_as_link_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_as_link_README.md)

---

### Copy URL with Preview
- **Purpose**: Opens a popup to edit URL/title, shows a live preview of the HTML/Markdown link, and copies both formats. CSP-compliant.
- **Source**: [`copy_url_with_preview.js`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_with_preview.js)
- **Details**: [`copy_url_with_preview_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/copy_url_with_preview_README.md)

---

### CSS Color Extractor & Swatch Generator
- **Purpose**: Extracts all CSS `color` and `background-color` rules from stylesheets and displays them as color swatches with selectors in a new tab.
- **Source**: [`css_colors.js`](https://github.com/oaustegard/bookmarklets/blob/main/css_colors.js)
- **Details**: [`css_colors_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/css_colors_README.md)

---

### Discord Message Scraper
- **Purpose**: Extracts and organizes Discord forum messages into downloadable threaded JSON conversations, capturing new messages on scroll.
- **Source**: [`discord_scraper.js`](https://github.com/oaustegard/bookmarklets/blob/main/discord_scraper.js)
- **Details**: [`discord_scraper_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/discord_scraper_README.md)

---

### DOM Search
- **Purpose**: A powerful debugging tool to search through `window` object properties in the DOM, by key names, values, or both, with an interactive UI.
- **Source**: [`dom_search.js`](https://github.com/oaustegard/bookmarklets/blob/main/dom_search.js)
- **Details**: [`dom_search_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/dom_search_README.md)

---

### Download SVG
- **Purpose**: Allows users to download any SVG element from a webpage by selecting part of the SVG and clicking the bookmarklet.
- **Source**: [`download_svg.js`](https://github.com/oaustegard/bookmarklets/blob/main/download_svg.js)
- **Details**: [`download_svg_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/download_svg_README.md)

---

### Drag, Drop, and Delete Page Elements
- **Purpose**: Interactively move elements on a webpage by dragging/dropping, or delete elements using the keyboard, for prototyping or decluttering.
- **Source**: [`drag_drop_and_delete.js`](https://github.com/oaustegard/bookmarklets/blob/main/drag_drop_and_delete.js)
- **Details**: [`drag_drop_and_delete_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/drag_drop_and_delete_README.md)

---

### Open in Microsoft Edge
- **Purpose**: Attempts to open the current webpage in the Microsoft Edge browser using the `microsoft-edge:` protocol.
- **Source**: [`edge.js`](https://github.com/oaustegard/bookmarklets/blob/main/edge.js)
- **Details**: [`edge_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/edge_README.md)

---

### Toggle Page Editability
- **Purpose**: Toggles the entire current webpage between an editable (`contentEditable=true`, `designMode='on'`) and non-editable state.
- **Source**: [`edit_page.js`](https://github.com/oaustegard/bookmarklets/blob/main/edit_page.js)
- **Details**: [`edit_page_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/edit_page_README.md)

---

### Emwiden - Expand Elements to Prevent Horizontal Scroll
- **Purpose**: Allows selection of an element to identify its nearest ancestor causing horizontal overflow, and expands that ancestor to fit its content.
- **Source**: [`emwiden.js`](https://github.com/oaustegard/bookmarklets/blob/main/emwiden.js)
- **Details**: [`emwiden_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/emwiden_README.md)

---

### Page Eruption Effect
- **Purpose**: A visual toy creating a particle firework and jumping text elements on a webpage, triggered by click or automatically on load.
- **Source**: [`erupt.js`](https://github.com/oaustegard/bookmarklets/blob/main/erupt.js)
- **Details**: [`erupt_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/erupt_README.md)

---

### New Excalidraw Room
- **Purpose**: Instantly creates a new Excalidraw.com collaboration room with a random ID, secure secret, and timestamp-based cache busting.
- **Source**: [`excalidraw_new.js`](https://github.com/oaustegard/bookmarklets/blob/main/excalidraw_new.js)
- **Details**: [`excalidraw_new_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/excalidraw_new_README.md)

---

### Extract Core HTML
- **Purpose**: Processes the current webpage, removes specific tags/attributes (like styles, scripts, Tailwind classes), and copies the cleaned HTML of the body to the clipboard.
- **Source**: [`extract_core_html.js`](https://github.com/oaustegard/bookmarklets/blob/main/extract_core_html.js)
- **Details**: [`extract_core_html_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/extract_core_html_README.md)

---

### Find and Replace Text on Page
- **Purpose**: Prompts for text to find and text to replace it with, then performs a case-insensitive search and replace on all text content of the current page.
- **Source**: [`find_and_replace.js`](https://github.com/oaustegard/bookmarklets/blob/main/find_and_replace.js)
- **Details**: [`find_and_replace_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/find_and_replace_README.md)

---

### GoogleMapToEarth - View Google Maps Location in Google Earth
- **Purpose**: Takes the current Google Maps view (location, search, coordinates) and opens it in Google Earth in a new tab.
- **Source**: [`GoogleMapToEarth.js`](https://github.com/oaustegard/bookmarklets/blob/main/GoogleMapToEarth.js)
- **Details**: [`GoogleMapToEarth_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/GoogleMapToEarth_README.md)

---

### GitHub.io to Repo Link
- **Purpose**: Converts a GitHub.io page URL to its corresponding GitHub repository URL, or a repository URL to its GitHub.io page.
- **Source**: [`github_io_to_repo.js`](https://github.com/oaustegard/bookmarklets/blob/main/github_io_to_repo.js)
- **Details**: [`github_io_to_repo_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/github_io_to_repo_README.md) (Summary: Converts GitHub.io page URL to repo URL and vice-versa.)

---

### GitHub Sort Code Search by Update Time
- **Purpose**: Modifies the URL on a GitHub code search results page to sort the results by "recently updated".
- **Source**: [`github_sort_code_by_update.js`](https://github.com/oaustegard/bookmarklets/blob/main/github_sort_code_by_update.js)
- **Details**: [`github_sort_code_by_update_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/github_sort_code_by_update_README.md) (Summary: Adds sort parameter to GitHub code search URL.)

---

### IndexedDB Inspector
- **Purpose**: Provides a UI to inspect IndexedDB databases, object stores, and entries on the current page.
- **Source**: [`idb_inspector.js`](https://github.com/oaustegard/bookmarklets/blob/main/idb_inspector.js)
- **Details**: [`idb_inspector_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/idb_inspector_README.md) (Summary: Inspects IndexedDB contents via a UI panel.)

---

### JIRA Link Copier
- **Purpose**: Extracts details from a JIRA issue page (key, summary, status, etc.) and copies them as a formatted Markdown and HTML link.
- **Source**: [`jira_link.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_link.js)
- **Details**: [`jira_link_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_link_README.md)

---

### JIRA List Links in Description
- **Purpose**: Finds all links within a JIRA issue's description field and displays them in a new window, formatted as a Markdown list.
- **Source**: [`jira_list_links.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_list_links.js)
- **Details**: [`jira_list_links_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_list_links_README.md) (Summary: Extracts links from JIRA description to a Markdown list.)

---

### JIRA Permissions by Role
- **Purpose**: On a JIRA project permissions page, this bookmarklet extracts and displays project permissions grouped by role in a new window.
- **Source**: [`jira_permissions_by_role.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_permissions_by_role.js)
- **Details**: [`jira_permissions_by_role_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_permissions_by_role_README.md) (Summary: Displays JIRA project permissions grouped by role.)

---

### JIRA Prefix PRs with Repo Name
- **Purpose**: On a JIRA issue page, finds pull request links in the development panel and prefixes their link text with the repository name.
- **Source**: [`jira_prefix_prs_with_repo.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_prefix_prs_with_repo.js)
- **Details**: [`jira_prefix_prs_with_repo_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_prefix_prs_with_repo_README.md) (Summary: Prefixes JIRA PR links with repo names.)

---

### JIRA Project Role Permissions and Users
- **Purpose**: Extracts and displays JIRA project role permissions along with the users assigned to each role in a new window.
- **Source**: [`jira_project_role_permissions_and_users.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_permissions_and_users.js)
- **Details**: [`jira_project_role_permissions_and_users_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_permissions_and_users_README.md) (Summary: Shows JIRA project roles, their permissions, and assigned users.)

---

### JIRA Project Role Users
- **Purpose**: On a JIRA project roles page, this bookmarklet extracts and displays users assigned to each project role in a new window.
- **Source**: [`jira_project_role_users.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_users.js)
- **Details**: [`jira_project_role_users_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_project_role_users_README.md) (Summary: Displays users for each JIRA project role.)

---

### JIRA Recent Projects Dropdown Enhancer
- **Purpose**: Modifies the JIRA "Recent Projects" dropdown to show full project names and keys, and sorts the list alphabetically by project name.
- **Source**: [`jira_recent_projects.js`](https://github.com/oaustegard/bookmarklets/blob/main/jira_recent_projects.js)
- **Details**: [`jira_recent_projects_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/jira_recent_projects_README.md) (Summary: Enhances JIRA's recent projects dropdown.)

---

### Main Content to Claude
- **Purpose**: Extracts the main content of a webpage (using a series of heuristics like `<main>`, `<article>`, etc.), cleans it, and sends it to Claude.ai.
- **Source**: [`main_content_to_claude.js`](https://github.com/oaustegard/bookmarklets/blob/main/main_content_to_claude.js)
- **Details**: [`main_content_to_claude_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/main_content_to_claude_README.md) (Summary: Sends cleaned main page content to Claude.ai.)

---

### Markdown Body
- **Purpose**: Converts the main content of a webpage to Markdown, copies it to the clipboard, and displays it in a new window.
- **Source**: [`markdown_body.js`](https://github.com/oaustegard/bookmarklets/blob/main/markdown_body.js)
- **Details**: [`markdown_body_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/markdown_body_README.md)

---

### Mastodon.social Profile Redirector
- **Purpose**: Extracts a username from a Mastodon user's profile page (via meta tag) and opens their profile on mastodon.social.
- **Source**: [`mastodon.social_profile.js`](https://github.com/oaustegard/bookmarklets/blob/main/mastodon.social_profile.js)
- **Details**: [`mastodon.social_profile_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/mastodon.social_profile_README.md) (Summary: Redirects Mastodon profile to mastodon.social instance.)

---

### Search Site with Google
- **Purpose**: Prompts for a search term and then performs a Google search restricted to the current website's domain.
- **Source**: [`search_site.js`](https://github.com/oaustegard/bookmarklets/blob/main/search_site.js)
- **Details**: [`search_site_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/search_site_README.md)

---

### SharePoint File Path Extractor
- **Purpose**: Extracts and displays the full file path from a SharePoint document library view when a file is selected.
- **Source**: [`sharepoint_file_path.js`](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path.js)
- **Details**: [`sharepoint_file_path_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/sharepoint_file_path_README.md) (Summary: Extracts file path from selected SharePoint item.)

---

### Sort Datalists
- **Purpose**: Finds all `<datalist>` elements on a page and sorts their `<option>` elements alphabetically.
- **Source**: [`sort_datalists.js`](https://github.com/oaustegard/bookmarklets/blob/main/sort_datalists.js)
- **Details**: [`sort_datalists_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/sort_datalists_README.md) (Summary: Sorts options in all datalists on a page.)

---

### Speed Up Video
- **Purpose**: Increases the playback rate of HTML5 video elements on a page, including those within iframes.
- **Source**: [`speed_up_video.js`](https://github.com/oaustegard/bookmarklets/blob/main/speed_up_video.js)
- **Details**: [`speed_up_video_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/speed_up_video_README.md)

---

### Sticky Element Toggle
- **Purpose**: Toggles the `position: sticky` CSS property for elements on a page, making them non-sticky or restoring their stickiness.
- **Source**: [`sticky_element.js`](https://github.com/oaustegard/bookmarklets/blob/main/sticky_element.js)
- **Details**: [`sticky_element_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/sticky_element_README.md) (Summary: Toggles `position: sticky` for elements.)

---

### Strava Activity Data Extractor
- **Purpose**: Extracts detailed data from a Strava activity page (segments, power, heart rate, etc.) and organizes it into a JSON object, displayed in a new window.
- **Source**: [`strava_activity_data_extractor.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_activity_data_extractor.js)
- **Details**: [`strava_activity_data_extractor_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_activity_data_extractor_README.md) (Summary: Extracts detailed Strava activity data to JSON.)

---

### Strava Analyze Activity
- **Purpose**: Provides a detailed analysis of a Strava activity, including power curves, segment efforts, and heart rate zones, displayed in a new window.
- **Source**: [`strava_analyze_activity.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_activity.js)
- **Details**: [`strava_analyze_activity_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_activity_README.md) (Summary: Analyzes Strava activity data with charts and stats.)

---

### Strava Analyze Ride (Cycling Specific)
- **Purpose**: A cycling-focused version of activity analysis for Strava, calculating metrics like Variability Index and Intensity Factor.
- **Source**: [`strava_analyze_ride.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_ride.js)
- **Details**: [`strava_analyze_ride_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_analyze_ride_README.md) (Summary: Cycling-specific analysis for Strava rides.)

---

### Strava Clear Stored Rides
- **Purpose**: Clears locally stored Strava ride summary data that might be used by other Strava bookmarklets.
- **Source**: [`strava_clear_stored_rides.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_clear_stored_rides.js)
- **Details**: [`strava_clear_stored_rides_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_clear_stored_rides_README.md) (Summary: Clears locally stored Strava ride data.)

---

### Strava Display Ride Summaries
- **Purpose**: Retrieves and displays locally stored Strava ride summaries in a new window.
- **Source**: [`strava_display_ride_summaries.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_display_ride_summaries.js)
- **Details**: [`strava_display_ride_summaries_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_display_ride_summaries_README.md) (Summary: Displays locally stored Strava ride summaries.)

---

### Strava Excerpt
- **Purpose**: Extracts and displays Strava ride highlights and interesting segments based on power/speed thresholds.
- **Source**: [`strava_excerpt.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_excerpt.js)
- **Details**: [`strava_excerpt_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_excerpt_README.md)

---

### Strava GPX Link Adder
- **Purpose**: Adds a "GPX Data" link next to activity names on Strava pages, linking directly to the GPX export for that activity.
- **Source**: [`strava_gpx_link.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_gpx_link.js)
- **Details**: [`strava_gpx_link_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_gpx_link_README.md)

---

### Strava Object Data Extractor (MVP)
- **Purpose**: Extracts the `strava.activity_object` or `strava.segment_object` JavaScript object from a Strava page and displays it as JSON.
- **Source**: [`strava_object_data_extractor_mvp.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_object_data_extractor_mvp.js)
- **Details**: (No specific README, summary from source: Extracts Strava's global activity/segment JS object.)

---

### Strava Recent Efforts Fit Curve
- **Purpose**: On a Strava segment page, fetches recent efforts and attempts to fit a power curve or analyze performance trends.
- **Source**: [`strava_recent_efforts_fit_curve.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_recent_efforts_fit_curve.js)
- **Details**: (No specific README, summary from source: Analyzes recent efforts on a Strava segment.)

---

### Strava Short Excerpt Storage
- **Purpose**: Retrieves text from a specific section on a Strava page (likely an activity title or brief description) and saves it to local storage.
- **Source**: [`strava_short_excerpt.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_short_excerpt.js)
- **Details**: (No specific README, summary from source: Stores a short text excerpt from Strava to local storage.)

---

### Strava Show Stored Rides
- **Purpose**: Displays Strava ride data that has been stored locally by other bookmarklets.
- **Source**: [`strava_show_stored_rides.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_show_stored_rides.js)
- **Details**: (No specific README, summary from source: Shows locally stored Strava ride data.)

---

### Strava Sort Segments
- **Purpose**: Sorts the segments table on a Strava activity page by various criteria like time, speed, or power.
- **Source**: [`strava_sort_segments.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_sort_segments.js)
- **Details**: (No specific README, summary from source: Sorts segments on a Strava activity page.)

---

### Strava Store Ride Summary
- **Purpose**: Extracts summary data from a Strava ride page (like distance, time, elevation) and stores it in local storage.
- **Source**: [`strava_store_ride_summary.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_store_ride_summary.js)
- **Details**: [`strava_store_ride_summary_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/strava_store_ride_summary_README.md) (Summary: Stores Strava ride summary data locally.)

---

### Strava Year-over-Year Performance
- **Purpose**: Analyzes Strava data to compare performance on segments or activities year-over-year.
- **Source**: [`strava_yoy_performance.js`](https://github.com/oaustegard/bookmarklets/blob/main/strava_yoy_performance.js)
- **Details**: (No specific README, summary from source: Compares Strava performance year-over-year.)

---

### Tweet to Markdown
- **Purpose**: Converts a single Tweet (from a Twitter/X.com tweet page) into Markdown format, copying it to the clipboard.
- **Source**: [`tweet_to_markdown.js`](https://github.com/oaustegard/bookmarklets/blob/main/tweet_to_markdown.js)
- **Details**: (No specific README, summary from source: Converts a Tweet to Markdown and copies to clipboard.)

---

### Wandrer Sort Big Map Achievements
- **Purpose**: Sorts the achievements list on the Wandrer.earth "Big Map" page by various criteria like points or completion percentage.
- **Source**: [`wandrer_sort_bigmap_achievements.js`](https://github.com/oaustegard/bookmarklets/blob/main/wandrer_sort_bigmap_achievements.js)
- **Details**: [`wandrer_sort_bigmap_achievements_README.md`](https://github.com/oaustegard/bookmarklets/blob/main/wandrer_sort_bigmap_achievements_README.md) (Summary: Sorts achievements on Wandrer's Big Map.)

---

### X.com (Twitter) Conversation Extractor
- **Purpose**: Collects tweets and their engagement data from a Twitter/X.com conversation page by scrolling and extracting information, then displays it.
- **Source**: [`x_conversation_extractor.js`](https://github.com/oaustegard/bookmarklets/blob/main/x_conversation_extractor.js)
- **Details**: (No specific README, summary from source: Extracts Twitter/X conversation data.)

---

## Other Files

### [.gitignore](https://github.com/oaustegard/bookmarklets/blob/main/.gitignore)
- **Summary**: Specifies intentionally untracked files that Git should ignore, focusing on Visual Studio, Python, and macOS specific files.

### [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)
- **Summary**: The MIT License under which this repository's contents are shared, granting broad permissions with limited liability.

### [README.md (Main)](https://github.com/oaustegard/bookmarklets/blob/main/README.md)
- **Summary**: The main landing page for the repository, typically providing an overview and pointing to this content summary.

### Python Scripts

#### [generate_md_files.py](https://github.com/oaustegard/bookmarklets/blob/main/generate_md_files.py)
- **Purpose**: A Python script to automatically generate Markdown documentation for JavaScript bookmarklet files using an AI model (OpenAI GPT). It lists JS files, reads their content, and prompts an AI to create README content.
- **Details**: (Summary from source and previous CONTENT_SUMMARY)

#### [github_folder_summary.py](https://github.com/oaustegard/bookmarklets/blob/main/github_folder_summary.py)
- **Purpose**: Python script likely used to generate summaries or listings of files within a GitHub folder, possibly for documentation purposes.
- **Details**: (No specific README, summary based on name)

---
*This summary is intended to be comprehensive. If any bookmarklets are missing or descriptions need updates, please consider contributing or raising an issue.*
