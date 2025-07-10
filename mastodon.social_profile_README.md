# Open Fediverse Profile on mastodon.social

Finds a Fediverse user's profile information from a meta tag on their current profile page (on any Fediverse instance) and opens their equivalent profile on `mastodon.social`.

## Purpose

If you're browsing a user's profile on a smaller or different Mastodon/Fediverse instance and want to quickly view or interact with them from your `mastodon.social` account (or just see their profile on the largest instance), this bookmarklet automates that.

## Features

-   **Meta Tag Detection**: Looks for a `<meta property="profile:username" content="...">` tag in the page's HTML. This tag is commonly used on Fediverse profiles to declare the user's full address.
-   **Username Extraction**: Parses the `content` attribute of the meta tag to get the username (e.g., `@user@instance.domain`).
-   **Redirect to mastodon.social**: Opens a new tab to `https://mastodon.social/@username` (where `@username` is the part before the second `@` if present, or the full username if it's a local `mastodon.social` user).

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html?bookmarklet=mastodon.social_profile.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [mastodon.social_profile.js file](https://github.com/oaustegard/bookmarklets/blob/main/mastodon.social_profile.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Profile on mastodon.social").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a user's profile page on any Mastodon or Fediverse instance that includes the `profile:username` meta tag.
2.  Click the "Profile on mastodon.social" bookmarklet.
3.  A new tab will open, attempting to load that user's profile on `mastodon.social`. For example, if you are on `some-instance.com/@user` and their meta tag indicates `@user@some-instance.com`, this will open `https://mastodon.social/@user@some-instance.com`.
4.  If the meta tag is not found, an alert "This bookmarklet only works on Fediverse sites with a proper username meta tag." will appear.

## How It Works

1.  **Find Meta Tag**:
    *   Uses `document.querySelector('meta[property="profile:username"]')` to find the relevant meta tag.
2.  **Extract Username**:
    *   If the tag is found and has a `content` attribute:
        *   It retrieves `metaTag.content`. This is typically the full Fediverse address like `@username@instance.domain`.
        *   It constructs the URL `https://mastodon.social/@${username}`. Note: `mastodon.social` itself can resolve full `@user@instance` addresses in its path.
        *   Opens this URL in a new tab using `window.open()`.
3.  **Handle Missing Tag**:
    *   If the meta tag is not found or has no content, it displays an alert message.

## Technical Notes

-   The bookmarklet relies on the presence and correctness of the `profile:username` meta tag on Fediverse profile pages.
-   `mastodon.social` is hardcoded as the target instance.
-   The way `mastodon.social` (and Mastodon in general) handles `@user@instance` in the URL path means it will correctly look up the remote user.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/mastodon.social_profile.js).
