chrome.runtime.onInstalled.addListener(() => {
    // Post/Thread actions
    chrome.contextMenus.create({
        id: "bsky-thread",
        title: "View Full Thread",
        contexts: ["page", "link"],
        documentUrlPatterns: ["*://bsky.app/*"]
    });

    // Profile actions
    chrome.contextMenus.create({
        id: "bsky-user-lists",
        title: "View User Lists",
        contexts: ["page", "link"],
        documentUrlPatterns: ["*://bsky.app/*"]
    });

    // Page actions
    chrome.contextMenus.create({
        id: "bsky-advanced-search",
        title: "Advanced Search",
        contexts: ["page"],
        documentUrlPatterns: ["*://bsky.app/*"]
    });

    chrome.contextMenus.create({
        id: "bsky-markdown-post",
        title: "Create Post with Markdown Link",
        contexts: ["page"],
        documentUrlPatterns: ["*://bsky.app/*"]
    });

    chrome.contextMenus.create({
        id: "bsky-profile-hover",
        title: "Enable Profile Hover Preview",
        contexts: ["page"],
        documentUrlPatterns: ["*://bsky.app/*"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab || !tab.id) return;

    const urlToUse = info.linkUrl || info.pageUrl;

    if (info.menuItemId === "bsky-thread") {
        // Open the thread viewer directly in a new tab
        chrome.tabs.create({ url: `https://sites.wisp.place/austegard.com/bsky-thread/?url=${encodeURIComponent(urlToUse)}` });
    }

    else if (info.menuItemId === "bsky-advanced-search") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/bsky_advanced_search.js"]
        });
    }

    else if (info.menuItemId === "bsky-markdown-post") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/bsky_markdown_link_post.js"]
        });
    }

    else if (info.menuItemId === "bsky-profile-hover") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["scripts/bsky_profile_latest_posts.js"]
        });
    }

    else if (info.menuItemId === "bsky-user-lists") {
        // If clicked on a link, we pass the link URL, else the page URL.
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (url) => { window.__bskyExtensionTargetUrl = url; },
            args: [urlToUse]
        }, () => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["scripts/bsky_user_lists.js"]
            });
        });
    }
});
