javascript: (function() {
    var metaTag = document.querySelector('meta[property="profile:username"]');
    if (metaTag && metaTag.content) {
        var username = metaTag.content;
        window.open(`https://mastodon.social/@${username}`);
    } else {
        alert("This bookmarklet only works on Fediverse sites with a proper username meta tag.");
    }
})();
