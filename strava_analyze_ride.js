javascript:(function() {
    /* Strava Highlights Bookmarklet
     * This bookmarklet extracts highlights and interesting segments from a Strava activity page
     * and sends them to Claude for further analysis.
     */

    /* CONFIGURATION - Edit this to set your preferred Claude project */
    const CLAUDE_PROJECT = ""; /* Set to your project UUID, or leave empty for default workspace */

    /* Helper function to safely get text content from elements */
    function getTextFromSelector(selector, parent = document) {
        return parent.querySelector(selector)?.textContent.trim() || '';
    }

    /* Helper function to safely check if an element exists and has content */
    function hasContent(selector, parent = document) {
        const element = parent.querySelector(selector);
        return element && element.innerHTML.trim() !== '';
    }

    /* Get highlights from the page */
    function getHighlights() {
        console.log('Parsing highlights: title, stats, and top achievements');
        
        const title = getTextFromSelector('h1.activity-name');
        const stats = getTextFromSelector('div.activity-stats');
        const achievements = getTextFromSelector('footer.achievements');
        
        const riderName = document.querySelector('.details-container .avatar-athlete img')?.alt.trim() || '';
        const dateTime = getTextFromSelector('.details time');
        const location = getTextFromSelector('.details .location');
        
        const sauceInfo = parseSauceInfo();
        
        return { title, stats, achievements, riderName, dateTime, location, sauceContent: sauceInfo };
    }

    /* Parse Sauce for Strava info panel */
    function parseSauceInfo() {
        const saucePanel = document.getElementById('sauce-infopanel');
        if (!saucePanel) return 'Sauce info not available';

        const selectedOption = getTextFromSelector('.drop-down-menu .selection', saucePanel);
        const tableRows = saucePanel.querySelectorAll('table tr');
        
        const sauceData = [`Selected Sauce Data: ${selectedOption}`];
        
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                const range = cells[0].textContent.trim();
                const value = cells[1].textContent.trim();
                sauceData.push(`${range}: ${value}`);
            }
        });

        return sauceData.join('\n');
    }

    /* Get interesting segments based on thresholds */
    function getInterestingSegments(powerThreshold, speedThreshold) {
        console.log('Parsing all segments');
        const allSegments = Array.from(document.querySelectorAll('table.segments tbody tr')).map(row => {
            const name = getTextFromSelector('.name-col .name', row);
            const stats = getTextFromSelector('.name-col .stats', row).replace(/\s+/g, ' ').trim();
            const speedText = getTextFromSelector('td:nth-child(7)', row);
            const powerText = getTextFromSelector('td:nth-child(8)', row);
            const speed = parseFloat(speedText.replace(/[^\d.]/g, '')) || 0;
            const power = parseFloat(powerText.replace(/[^\d.]/g, '')) || 0;
            const time = getTextFromSelector('.time-col', row);
            
            const achievement = row.querySelector('.achievement-col div');
            const achievementTitle = achievement ? achievement.title : 'None';
            
            const isStarred = row.querySelector('.starred-col .starred.active') !== null;
            const hasAchievement = row.querySelector('.achievement-col div') !== null;
            const isLocalLegend = hasContent('.local-legend-col', row);
            
            const climbCatElement = row.querySelector('.climb-cat-col span');
            const climbCategory = climbCatElement ? climbCatElement.className.match(/icon-cat-([A-Za-z0-9]+)/)?.[1] || null : null;
            const isCategorized = climbCategory !== null;
            
            return { name, stats, speed, power, time, achievement: achievementTitle, isStarred, hasAchievement, isLocalLegend, isCategorized, climbCategory };
        });

        console.log('Filtering and annotating interesting segments');
        return allSegments.filter(segment => {
            const reasons = [];
            
            if (segment.isStarred) reasons.push("Starred");
            if (segment.hasAchievement) reasons.push("Achievement");
            if (segment.isLocalLegend) reasons.push("LocalLegend");
            if (segment.isCategorized) reasons.push("Categorized");
            if (segment.speed > speedThreshold) reasons.push(`Speed>${speedThreshold}`);
            if (segment.power > powerThreshold) reasons.push(`Power>${powerThreshold}`);

            if (reasons.length > 0) {
                segment.interest = reasons.join(", ");
                return true;
            }
            return false;
        });
    }

    /* Combine highlights into a single block */
    function combineHighlights(highlights) {
        console.log('Combining highlights into a single block');
        
        const combined = `${highlights.riderName} - ${highlights.dateTime} - ${highlights.location}
${highlights.title}
${highlights.stats}
Top Achievements: ${highlights.achievements}

Sauce Info:
${highlights.sauceContent}`;

        return combined.replace(/\n+/g, '\n');
    }

    /* Format interesting segments as a bulleted list */
    function formatInterestingSegments(parsedSegments) {
        console.log('Formatting interesting segments as a bulleted list');
        return parsedSegments.map(seg => {
            const climbInfo = seg.isCategorized ? `, Climb Category: ${seg.climbCategory}` : '';
            return `• ${seg.name} - Stats: ${seg.stats}, Speed: ${seg.speed} mi/h, Power: ${seg.power} W, Time: ${seg.time}, Achievement: ${seg.achievement}, Interest: ${seg.interest}${climbInfo}`;
        }).join('\n');
    }

    /* Build Claude URL with optional project parameter */
    function buildClaudeUrl(prompt, rideSummary) {
        console.log('Building Claude URL with project parameter');
        const baseUrl = "https://claude.ai/new";
        const queryParams = new URLSearchParams();
        
        queryParams.set('q', prompt + "\n\n" + rideSummary);
        
        if (CLAUDE_PROJECT && CLAUDE_PROJECT.trim() !== '') {
            queryParams.set('project', CLAUDE_PROJECT.trim());
        }
        
        return baseUrl + '?' + queryParams.toString();
    }

    /* Display ride summary and send to Claude for analysis */
    function displayRideSummary(powerThreshold, speedThreshold) {
        console.log('Combining all highlights and interesting segments');
        const combinedHighlights = combineHighlights(getHighlights());
        const formattedSegments = formatInterestingSegments(getInterestingSegments(powerThreshold, speedThreshold));
        const rideSummary = `${combinedHighlights}\n\nInteresting Segments:\n${formattedSegments}`;

        console.log('Sending ride summary to Claude for analysis');
        const prompt = "Review this Strava ride summary and highlight the most notable achievements and interesting segments:";
        const url = buildClaudeUrl(prompt, rideSummary);
        window.open(url, '_blank');
    }

    /* Error handling wrapper to catch and log any errors */
    function executeWithErrorHandling() {
        try {
            displayRideSummary(300, 25);
        } catch (error) {
            console.error('Strava Analysis Bookmarklet Error:', error);
            alert('Error analyzing Strava ride: ' + error.message);
        }
    }

    /* Main execution */
    executeWithErrorHandling();
})();
