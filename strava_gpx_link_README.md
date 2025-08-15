# Add Strava GPX Export Links

Finds links to Strava activities on the current page and adds a direct "GPX" download link next to each one.

## Purpose

This bookmarklet is useful on pages that list multiple Strava activities (e.g., a user's profile feed, a club activity list, search results). It provides a one-click way to download the GPX file for any listed activity without needing to navigate to each activity page individually and then find the export option.

## Features

-   **Identifies Activity Links**: Looks for `<a>` tags with the attribute `data-field-name="name"`, which are commonly used by Strava for links to activity pages.
-   **Generates GPX URLs**: For each activity link found, it constructs the corresponding GPX export URL by appending `/export_gpx` to the activity's URL.
-   **Injects GPX Links**: Creates a new `<a>` element with the text "GPX", styled to float right, and appends it next to the original activity link.
-   **Modifies Live Page**: Directly adds these new links into the current page's DOM.

## Installation

1.  **Easy Mode**:
    *   Go to the [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html?bookmarklet=strava_gpx_link.js)
    *   Drag the generated link to your bookmarks bar.
2.  **Hard Mode**:
    *   Copy the entire JavaScript code from the [strava_gpx_link.js file](https://github.com/oaustegard/bookmarklets/blob/main/strava_gpx_link.js).
    *   Go to the generic [Bookmarklet Installer](https://austegard.com/web-utilities/bookmarklet-installer.html).
    *   Paste the code into the installer.
    *   Name the bookmarklet (e.g., "Strava GPX Links").
    *   Drag the generated link to your bookmarks bar.

## Usage

1.  Navigate to a Strava page that lists multiple activities (e.g., your dashboard feed, a friend's profile, a club page).
2.  Click the "Strava GPX Links" bookmarklet.
3.  Next to each activity name/link in the list, a small "GPX" link will appear to the right.
4.  Clicking this "GPX" link will initiate a download of the GPX file for that activity.

## How It Works

1.  **Select Activity Links**:
    *   Uses `document.querySelectorAll('[data-field-name=name]')` to find all elements (typically `<a>` tags) that serve as links to Strava activities.
2.  **Iterate and Create GPX Links**:
    *   Loops through each found element `e`.
    *   Gets the activity URL from `e.href`.
    *   Creates a new `<a>` element (`a`).
    *   Creates a text node "GPX" and appends it to `a`.
    *   Sets the `title` of `a` to "GPX Data".
    *   Sets the `href` of `a` to the original activity URL plus `/export_gpx`.
    *   Styles `a` with `float:right;` to position it to the right of the original link.
    *   Appends the new GPX link (`a`) to the parent node of the original activity link (`e.parentNode.appendChild(a)`).

## Technical Notes

-   This bookmarklet relies on Strava using `[data-field-name=name]` for its activity links. If Strava changes this attribute or structure, the bookmarklet may stop working.
-   Downloading GPX files typically requires you to be logged into Strava. If you are not logged in, clicking the GPX link might redirect to a login page or fail.
-   The GPX export functionality is a feature of Strava. This bookmarklet simply makes it more accessible from list views.

## Source Code

The full source code is available on [GitHub](https://github.com/oaustegard/bookmarklets/blob/main/strava_gpx_link.js):
```javascript
javascript:(function() {
	for (let e of document.querySelectorAll('[data-field-name=name]')) {
		let h = e.href;
		let a = document.createElement("a");
		let l = document.createTextNode("GPX");
		a.appendChild(l);
		a.title = "GPX Data";
		a.href = h + "/export_gpx";
		a.style = "float:right;";
		e.parentNode.appendChild(a);
	}
})()
```
