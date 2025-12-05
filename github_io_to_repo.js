javascript:(function() {
    /* @title: GitHub.io to Repository */
    /* @description: Redirects from a GitHub Pages URL to its corresponding repository */
    /* @domains: *github.io */
    var currentUrl = window.location.href;

    /* Regular expression to match github.io URLs */
    var regex = /^https?:\/\/([^.]+)\.github\.io\/([^/]+)/;

    /* Check if the current URL matches the pattern */
    var match = currentUrl.match(regex);

    if (match) {
        /* Extract username and repository name */
        var username = match[1];
        var repoName = match[2];

        /* Construct the github.com repository URL */
        var repoUrl = 'https://github.com/' + username + '/' + repoName + '/';

        /* Redirect to the repository URL */
        window.location.href = repoUrl;
    } else {
        /* Alert the user if the URL doesn't match the expected pattern */
        alert('This doesn\'t appear to be a valid github.io URL.');
    }
})();
