javascript:(function() {
/* @title: Create Confluence Meeting Notes */
/* @description: Creates a new meeting notes page in Confluence with standard template */
/* @domains: confluence.meso-scale.com */
    var metaTags = document.getElementsByTagName('meta');
    var spaceKey = '';
    var parentPageId = '';

    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute('name') === 'ajs-space-key') {
            spaceKey = metaTags[i].getAttribute('content');
        }
        if (metaTags[i].getAttribute('name') === 'ajs-page-id') {
            parentPageId = metaTags[i].getAttribute('content');
        }
    }

    if (!spaceKey || !parentPageId) {
        alert("Failed to retrieve space key or parent page ID.");
        return;
    }

    var xhr = new XMLHttpRequest();
    var url = window.location.origin + "/rest/create-dialog/1.0/content-blueprint/create-draft";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var payload = {
        "spaceKey": spaceKey,
        "contentBlueprintId": "c28532ce-03c1-4785-9710-640e7631e0f1",
        "title": "",
        "context": {
            "name": "Meeting notes"
        },
        "parentPageId": parentPageId
    };

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                window.open(response.url, '_blank');
            } else {
                alert("Failed to create meeting notes subpage. Status: " + xhr.status + ", Response: " + xhr.responseText);
            }
        }
    };

    xhr.send(JSON.stringify(payload));
})();
