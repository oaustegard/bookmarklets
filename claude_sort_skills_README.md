# Sort Claude Skills

A bookmarklet that sorts the lists in Claude.ai's **Customize → Skills** panel alphabetically within each group.

## Purpose

Claude.ai lists your skills under headings like *Personal skills*, *Shared skills*, and *Organization skills*, but the order within each group is not alphabetical — which makes a particular skill hard to find once the list grows. This bookmarklet reorders the rows in each group into A→Z order in place, without reloading the page or touching the server. It only rearranges what's already on screen, so nothing about your skills is changed.

## Features

- **Per-group sorting**: Independently sorts *Personal skills*, *Shared skills*, and *Organization skills*
- **Case-insensitive A→Z**: Uses locale-aware comparison so names sort naturally
- **Clean sort keys**: Sorts on each skill's name (the row's first text node), so an expanded row's nested content doesn't skew the order
- **In-place reordering**: Moves the existing DOM rows; no rerender, no network calls
- **Non-destructive**: Reads and reorders only — never edits, renames, or deletes skills
- **Re-runnable**: Run it again after adding a skill to re-sort
- **Console logging**: Reports which groups were found and how many items were sorted
- **Graceful fallback**: Alerts you if no skill groups are found (e.g. the panel isn't open)

## Installation

### Easy Install
Click this link to install: [Bookmarklet Installer - claude_sort_skills.js](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=claude_sort_skills.js)

### Manual Install
1. Create a new bookmark in your browser
2. Copy the entire contents of [`claude_sort_skills.js`](https://github.com/oaustegard/bookmarklets/blob/main/claude_sort_skills.js)
3. Paste the code as the bookmark's URL
4. Name it something memorable like "Sort Claude Skills"

## Usage

1. Navigate to `claude.ai` while logged in
2. Open **Customize → Skills** so the skill groups are visible
3. Click the bookmarklet
4. Each group's rows are re-ordered alphabetically in place
5. Run it again any time the list changes to re-sort

If no groups are found, you'll see: `✗ No skill groups found. Open Customize → Skills first.`

## How It Works

The bookmarklet:

1. **Locates each group heading**: Scans all `<button>` elements for ones whose exact text is `Personal skills`, `Shared skills`, or `Organization skills`
2. **Finds the row container**: Walks up from the heading to the group wrapper, then finds the child list container (matched by its `.flex.flex-col.gap-px` classes)
3. **Derives a sort key per row**: Uses a `TreeWalker` to grab the row's first text node — the skill name — and lowercases it, so nested/expanded content doesn't affect the ordering
4. **Sorts and reinserts**: Sorts the rows with `String.localeCompare`, then re-appends them to the container in order (moving existing nodes rather than recreating them)
5. **Reports results**: Logs each sorted group and its item count to the console; alerts if nothing matched

## Technical Notes

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard DOM APIs (`querySelectorAll`, `TreeWalker`, `closest`, `localeCompare`)

### DOM Coupling
- Depends on Claude.ai's current markup: the exact group-heading labels and the `.flex.flex-col.gap-px` row container class
- If Claude.ai changes those class names or labels, the bookmarklet may find no groups and alert accordingly — a UI refresh on Claude's side is the most likely cause of it silently doing nothing

### Error Handling
- The whole routine is wrapped in a `try/catch`; any failure surfaces as an `Operation failed: <message>` alert and a console error
- Missing individual group headings are logged and skipped, not fatal — the other groups still sort

## Use Cases

- **Finding a skill fast**: Alphabetical order makes a specific skill easy to locate in a long list
- **Tidy screenshots/demos**: Present skills in a predictable order
- **Auditing**: Scan an alphabetized list to spot duplicates or naming inconsistencies

## Known Limitations

- Sorting is visual only and not persisted — Claude.ai will render its own order again on reload
- Relies on Claude.ai's internal DOM structure (may break if the Skills UI changes)
- Only sorts the three named groups; any other/renamed group headings are not handled
- Requires the Skills panel to be open so the rows exist in the DOM

## Privacy & Security

- Runs entirely in your browser against the already-loaded page
- Makes no network requests and contacts no external services
- Reads and reorders DOM elements only; no data is stored or transmitted

## License

MIT License - See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE) file for details.

## Author

Created by [Owen Austegard](https://austegard.com)

## Related Bookmarklets

- [Claude Skills Viewer](claude_list_skills_README.md) - View all active skills with quick copy
- [Claude Custom Instructions Enlarger](claude_enlarge_custom_instruction_field_README.md) - Enlarge the Custom Instructions textarea
- [Claude Continue Chat](claude_continue_chat_README.md) - Continue a previous conversation in a new chat
