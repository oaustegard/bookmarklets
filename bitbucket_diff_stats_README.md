# Bitbucket PR Diff Stats

Overlays GitHub-style `+N/-N` diff statistics onto the file tree of a Bitbucket Data Center/Server pull request page.

## Purpose

Bitbucket's PR file tree shows file names but no line-change counts. This bookmarklet fetches the PR diff via the REST API and injects green/red `+added/-removed` badges next to each file, with rolled-up totals on directory labels. The page title is also updated so the total diff size is visible in the tab and browser history.

## Features

- **Per-file diff stats:** `+N` (green) and `-N` (red) line counts appear inline in the changes tree
- **Directory roll-ups:** Parent directories show aggregate totals across all their children
- **Page title badge:** `[+N/-N]` prepended to the tab title — survives tab switching, shows in history
- **Idempotent:** Safe to click multiple times; old badges are removed before new ones are injected
- **Zero dependencies:** Uses only the built-in Bitbucket REST API with same-origin credentials

## Installation

### Easy Install
1. Visit [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=bitbucket_diff_stats.js)
2. Drag the created bookmarklet to your bookmarks bar.

### Manual Install
1. Create a new bookmark in your browser.
2. Set the name to "BB Diff Stats" or similar.
3. Set the URL to the JavaScript code in [`bitbucket_diff_stats.js`](https://github.com/oaustegard/bookmarklets/blob/main/bitbucket_diff_stats.js).

## Usage

1. Navigate to any pull request page on Bitbucket Data Center/Server, e.g.:
   `https://bitbucket.example.com/projects/PROJ/repos/my-repo/pull-requests/123`
2. Click the **BB Diff Stats** bookmarklet.
3. The changes tree will update with `+N/-N` counts next to each file and directory.
4. The page tab title changes to `[+N/-N] Pull Request #123 ...`.

## How It Works

1. **URL match:** Extracts the project key, repo slug, and PR number from the current URL. Alerts and aborts if the pattern doesn't match.
2. **API call:** Fetches `/rest/api/latest/projects/{p}/repos/{r}/pull-requests/{n}/diff?withComments=false&contextLines=0` with `same-origin` credentials.
3. **Parsing:** Iterates `diffs → hunks → segments`, counting `ADDED` and `REMOVED` lines per file path.
4. **Rendering:** Injects a `<style>` block once, then appends `<span class="bb-ds">` badges to file anchors and `<span class="bb-dd">` badges to directory labels.
5. **Title update:** Prepends `[+total/-total]` to `document.title`, stripping any prior badge first.

## Compatibility

- **Bitbucket Data Center / Server** (on-premise): ✅ Tested against the `rest/api/latest` diff endpoint
- **Bitbucket Cloud** (bitbucket.org): ❌ Different URL scheme and API — not supported

## Notes

- The bookmarklet uses `same-origin` credentials, so you must already be logged in to Bitbucket.
- Bitbucket frontend changes (CSS class renames) could break the badge injection; the API fetch and title update will still work.

## License

MIT License — See [LICENSE](https://github.com/oaustegard/bookmarklets/blob/main/LICENSE)

## Author

Created by [Oskar Austegard](https://austegard.com)
