/* Use https://caiorss.github.io/bookmarklet-maker/ to convert to bookmarklet */

document.body.appendChild(Object.assign(document.createElement('script'), { textContent: 'window._lg = function(msg) { console.log(msg); }' }));

_lg('See ChatGPT session at https://chat.openai.com/c/4ee57917-ff98-4ca8-975d-9e65f63950b1');
_lg('See Claude session at https://claude.ai/chat/aa4bab3b-a302-445e-aa06-5578d89e9351');

var getHighlights = function() {
    _lg('Parse highlights: title, stats, and top achievements');
    
    var title = document.querySelector('h1.activity-name').textContent.trim();
    var stats = document.querySelector('div.activity-stats').textContent.trim();
    var achievements = document.querySelector('footer.achievements').textContent.trim();
    
    var riderName = document.querySelector('.details-container .avatar-athlete img').alt.trim();
    var dateTime = document.querySelector('.details time').textContent.trim();
    var location = document.querySelector('.details .location').textContent.trim();
    
    var sauceInfo = document.getElementById('sauce-infopanel');
    var sauceContent = sauceInfo ? sauceInfo.textContent.trim() : 'Sauce info not available';
    
    var highlights = {
        title: title,
        stats: stats,
        achievements: achievements,
        riderName: riderName,
        dateTime: dateTime,
        location: location,
        sauceContent: sauceContent
    };
    
    _lg('Fetched highlights');
    return highlights;
}

var getInterestingSegments = function(powerThreshold, speedThreshold) {
    _lg('Parse all segments');
    var allSegments = Array.from(document.querySelectorAll('table.segments tbody tr')).map(function(row) {
        var name = row.querySelector('.name-col .name').textContent.trim();
        var stats = row.querySelector('.name-col .stats').textContent.replace(/\s+/g, ' ').trim();
        var speedText = row.querySelector('td:nth-child(7)').textContent.trim();
        var powerText = row.querySelector('td:nth-child(8)').textContent.trim();
        var speed = parseFloat(speedText.replace(/[^\d.]/g, ''));
        var power = parseFloat(powerText.replace(/[^\d.]/g, ''));
        var time = row.querySelector('.time-col').textContent.trim();
        
        var achievement = row.querySelector('.achievement-col div');
        var achievementTitle = achievement ? achievement.title : 'None';
        
        var isStarred = row.querySelector('.starred-col .starred.active') !== null;
        var hasAchievement = row.querySelector('.achievement-col div') !== null;
        var isLocalLegend = row.querySelector('.local-legend-col').innerHTML.trim() !== '';
        var climbCatElement = row.querySelector('.climb-cat-col span');
        var climbCategory = climbCatElement ? climbCatElement.className.match(/icon-cat-([A-Za-z0-9]+)/)[1] : null;
        var isCategorized = climbCategory !== null;
        
        return { name, stats, speed, power, time, achievement: achievementTitle, isStarred, hasAchievement, isLocalLegend, isCategorized, climbCategory };
        
    });

    var interestingSegments = allSegments.filter(function(segment) {
        _lg('filter and annotate the interesting segments');
        var reasons = [];
        
        if (segment.isStarred) { reasons.push("Starred") };
        if (segment.hasAchievement) { reasons.push("Achievement") };
        if (segment.isLocalLegend) { reasons.push("LocalLegend") };
        if (segment.isCategorized) { reasons.push("Categorized") };
        if (segment.speed > speedThreshold) { reasons.push(`Speed>${speedThreshold}`) };
        if (segment.power > powerThreshold) { reasons.push(`Power>${powerThreshold}`) };

        if (reasons.length > 0) {
            segment.interest = reasons.join(", ");
            return true;
        }
        return false;
    });
    _lg(`Found ${interestingSegments.length} interesting segments`);
    return interestingSegments;
}

var combineHighlights = function(highlights) {
    _lg('Combine highlights into a single block');
    
    var combined = `${highlights.riderName} - ${highlights.dateTime} - ${highlights.location}\n${highlights.title}\n${highlights.stats}\nTop Achievements: ${highlights.achievements}\n\nSauce Info:\n${highlights.sauceContent}`;
    var singleLineCombined = combined.replace(/\n+/g, '\n');
    
    return singleLineCombined;
}

var formatInterestingSegments = function(parsedSegments) {
    _lg('format interesting segments as a bulleted list');
    var bullets = parsedSegments.map(seg => {
        var climbInfo = seg.isCategorized ? `, Climb Category: ${seg.climbCategory}` : '';
        return `• ${seg.name} - Stats: ${seg.stats}, Speed: ${seg.speed} mi/h, Power: ${seg.power} W, Time: ${seg.time}, Achievement: ${seg.achievement}, Interest: ${seg.interest}${climbInfo}`;
    }).join('\n');
    return bullets;
}

var displayRideSummary = function(powerThreshold, speedThreshold) {
    _lg('Combine all highlights and interesting segments');
    var combinedHighlights = combineHighlights(getHighlights());
    var formattedSegments = formatInterestingSegments(getInterestingSegments(powerThreshold, speedThreshold));
    var rideSummary = `${combinedHighlights}\n\nInteresting Segments:\n${formattedSegments}`;

    _lg('Open a new window and display the output');
    var outputWindow = window.open('', '_blank');
    outputWindow.document.write(`<html><head><title>Strava Highlights and Segments</title></head><body><pre>${rideSummary}</pre></body></html>`);
    outputWindow.document.close();
}

displayRideSummary(/*powerThreshold=*/300, /*speedThreshold=*/25);
