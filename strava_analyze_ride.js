javascript:(function() {
    /* Enhanced Strava Analysis Bookmarklet
     * Extracts concise ride summaries from Strava activity pages and sends to Claude for analysis.
     * Includes configurable thresholds for power, speed, and climb characteristics.
     * Optimized for URL length limits by focusing only on interesting segments.
     */

    /* ========== CONFIGURATION SECTION - Edit these values as needed ========== */
    const CLAUDE_PROJECT = ""; /* Set to your project UUID, or leave empty for default workspace */
    const POWER_THRESHOLD = 300; /* Minimum power (watts) to mark segment as interesting */
    const SPEED_THRESHOLD = 25; /* Minimum speed (mph) to mark segment as interesting */
    const ELEVATION_THRESHOLD = 200; /* Minimum elevation gain (ft) to mark climb as interesting */
    const GRADE_THRESHOLD = 6.0; /* Minimum average grade (%) to mark climb as interesting */
    const CLIMB_DISTANCE_THRESHOLD = 0.5; /* Minimum distance (mi) with >3% grade to mark as long climb */
    const CLAUDE_PROMPT = "Analyze this Strava ride summary and highlight the most notable achievements, interesting segments, and overall performance. Focus on the segments that exceeded the filtering thresholds and any standout power/speed performances:";
    /* ========================================================================== */

    /* Validate that we're on a Strava activity page */
    function validateActivityPage() {
        const currentUrl = window.location.href;
        
        /* Check if we're on Strava */
        if (!currentUrl.includes('strava.com')) {
            throw new Error('This bookmarklet only works on Strava.com. Please navigate to a Strava activity page first.');
        }
        
        /* Check if we're on an activity page (not segment, profile, etc.) */
        if (!currentUrl.includes('/activities/')) {
            throw new Error('Please navigate to a Strava activity page (not a segment, profile, or other page). Look for URLs like: strava.com/activities/123456789');
        }
        
        /* Check if essential activity elements exist */
        const activityTitle = document.querySelector('h1.activity-name');
        const inlineStats = document.querySelector('.inline-stats');
        
        if (!activityTitle || !inlineStats) {
            throw new Error('This doesn\'t appear to be a complete Strava activity page. Please make sure the page has fully loaded and try again.');
        }
        
        console.log('✅ Valid Strava activity page detected');
        return true;
    }

    /* Helper function to safely get text content from elements */
    function validateActivityPage() {
        const currentUrl = window.location.href;
        
        /* Check if we're on Strava */
        if (!currentUrl.includes('strava.com')) {
            throw new Error('This bookmarklet only works on Strava.com. Please navigate to a Strava activity page first.');
        }
        
        /* Check if we're on an activity page (not segment, profile, etc.) */
        if (!currentUrl.includes('/activities/')) {
            throw new Error('Please navigate to a Strava activity page (not a segment, profile, or other page). Look for URLs like: strava.com/activities/123456789');
        }
        
        /* Check if essential activity elements exist */
        const activityTitle = document.querySelector('h1.activity-name');
        const inlineStats = document.querySelector('.inline-stats');
        
        if (!activityTitle || !inlineStats) {
            throw new Error('This doesn\'t appear to be a complete Strava activity page. Please make sure the page has fully loaded and try again.');
        }
        
        console.log('✅ Valid Strava activity page detected');
        return true;
    }
    function safeGet(selector, property = 'innerText', fallback = 'N/A', context = document) {
        const element = context.querySelector(selector);
        return element ? element[property].trim() : fallback;
    }

    /* Extract structured table data (for stats tables) */
    function getTableData(selector) {
        const table = document.querySelector(selector);
        if (!table) return {};
        const rows = table.querySelectorAll('tr');
        const data = {};
        rows.forEach(row => {
            const th = row.querySelector('th');
            const tds = row.querySelectorAll('td');
            if (th && tds.length > 0) {
                const key = th.innerText.trim();
                if (tds.length === 1) {
                    data[key] = tds[0].innerText.trim();
                } else if (tds.length >= 2) {
                    data[key] = {
                        avg: tds[0].innerText.trim(),
                        max: tds[1].innerText.trim()
                    };
                }
            }
        });
        return data;
    }

    /* Parse Sauce for Strava info panel */
    function parseSauceInfo() {
        const saucePanel = document.getElementById('sauce-infopanel');
        if (!saucePanel) return 'Sauce info not available';

        const selectedOption = saucePanel.querySelector('.drop-down-menu .selection')?.textContent.trim() || '';
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

    /* Extract concise activity summary for analysis */
    function extractActivityData() {
        console.log('Extracting concise activity data for analysis');
        console.log(`Using thresholds: Power>${POWER_THRESHOLD}W, Speed>${SPEED_THRESHOLD}mph, Elevation>${ELEVATION_THRESHOLD}ft, Grade>${GRADE_THRESHOLD}%, ClimbDistance>${CLIMB_DISTANCE_THRESHOLD}mi`);
        
        const statsData = getTableData('.more-stats table');
        
        /* Extract key activity info */
        const activityInfo = {
            title: safeGet('h1.activity-name'),
            athlete: safeGet('h2.text-title3 span.title a'),
            date: safeGet('time', 'innerText', '').split(' on ')[1] || 'N/A',
            location: safeGet('span.location'),
            description: safeGet('.activity-description-container .content')
        };

        /* Extract key stats */
        const keyStats = {
            distance: safeGet('.inline-stats li:nth-child(1) strong'),
            movingTime: safeGet('.inline-stats li:nth-child(2) strong'),
            elevationGain: safeGet('.inline-stats li:nth-child(3) strong'),
            avgPower: statsData['Power']?.avg || 'N/A',
            maxPower: statsData['Power']?.max || 'N/A',
            weightedAvgPower: safeGet('.secondary-stats li:nth-child(1) strong'),
            avgSpeed: statsData['Speed']?.avg || 'N/A',
            maxSpeed: statsData['Speed']?.max || 'N/A',
            achievements: safeGet('footer.achievements')
        };

        /* Extract and filter interesting segments only */
        const interestingSegments = Array.from(document.querySelectorAll('#segments-container table.segments tbody tr:not(.hidden-segments)'))
        .map(row => {
            const name = safeGet('.name-col .name', 'innerText', 'N/A', row);
            if (name === 'N/A') return null;
            
            const speedText = safeGet('td:nth-child(7)', 'innerText', 'N/A', row);
            const powerText = safeGet('td:nth-child(8)', 'innerText', 'N/A', row);
            const speed = parseFloat(speedText.replace(/[^\d.]/g, '')) || 0;
            const power = parseFloat(powerText.replace(/[^\d.]/g, '')) || 0;
            const time = safeGet('.time-col', 'innerText', 'N/A', row);
            
            const achievement = row.querySelector('.achievement-col div');
            const achievementTitle = achievement ? achievement.title : null;
            const isStarred = row.querySelector('.starred-col .starred.active') !== null;
            const hasAchievement = achievement !== null;
            const isLocalLegend = row.querySelector('.local-legend-col').innerHTML.trim() !== '';
            
            const climbCatElement = row.querySelector('.climb-cat-col span');
            const climbCategory = climbCatElement ? climbCatElement.className.match(/icon-cat-([A-Za-z0-9]+)/)?.[1] || null : null;
            const isCategorized = climbCategory !== null;

            /* Check all interest criteria */
            const reasons = [];
            if (isStarred) reasons.push("⭐");
            if (hasAchievement) reasons.push("🏆" + achievementTitle);
            if (isLocalLegend) reasons.push("👑");
            if (isCategorized) reasons.push("🗻" + climbCategory);
            if (speed > SPEED_THRESHOLD) reasons.push(`💨${speed}mph`);
            if (power > POWER_THRESHOLD) reasons.push(`⚡${power}W`);
            
            /* Check climb-specific thresholds */
            const elevationFt = parseFloat(safeGet('.stats span[title="Elevation difference"]', 'innerText', '0', row).replace(/[^\d.]/g, '')) || 0;
            const gradePercent = parseFloat(safeGet('.stats span[title="Average grade"]', 'innerText', '0', row).replace(/[^\d.]/g, '')) || 0;
            const distanceMi = parseFloat(safeGet('.stats span[title="Distance"]', 'innerText', '0', row).replace(/[^\d.]/g, '')) || 0;
            
            if (elevationFt > ELEVATION_THRESHOLD) reasons.push(`⛰️${elevationFt}ft`);
            if (gradePercent > GRADE_THRESHOLD) reasons.push(`📈${gradePercent}%`);
            if (distanceMi > CLIMB_DISTANCE_THRESHOLD && gradePercent > 3.0) reasons.push(`🚵${distanceMi}mi`);

            /* Only return if interesting */
            if (reasons.length === 0) return null;

            const stats = safeGet('.name-col .stats', 'innerText', 'N/A', row).replace(/\s+/g, ' ').trim();
            
            return {
                name,
                stats,
                time,
                reasons: reasons.join(' '),
                power: power > 0 ? power + 'W' : 'N/A',
                speed: speed > 0 ? speed + 'mph' : 'N/A'
            };
        })
        .filter(segment => segment !== null);

        /* Get Sauce power data summary */
        const sauceHighlights = parseSauceInfo().split('\n').slice(0, 6).join('\n');

        /* Create compact summary */
        const summary = {
            ride: `${activityInfo.athlete} - ${activityInfo.date} - ${activityInfo.title}`,
            location: activityInfo.location,
            description: activityInfo.description,
            stats: `${keyStats.distance} | ${keyStats.movingTime} | ${keyStats.elevationGain} | Avg: ${keyStats.avgPower} | Max: ${keyStats.maxPower} | Speed: ${keyStats.avgSpeed}/${keyStats.maxSpeed}`,
            achievements: keyStats.achievements,
            powerHighlights: sauceHighlights,
            interestingSegments: interestingSegments
        };

        return JSON.stringify(summary, null, 2);
    }

    /* Build Claude URL with optional project parameter */
    function buildClaudeUrl(prompt, activityData) {
        console.log('Building Claude URL with project parameter');
        const baseUrl = "https://claude.ai/new";
        const queryParams = new URLSearchParams();
        
        queryParams.set('q', prompt + "\n\n" + activityData);
        
        if (CLAUDE_PROJECT && CLAUDE_PROJECT.trim() !== '') {
            queryParams.set('project', CLAUDE_PROJECT.trim());
        }
        
        return baseUrl + '?' + queryParams.toString();
    }

    /* Send concise summary to Claude for analysis */
    function sendToClaudeForAnalysis(activitySummary) {
        console.log('Sending concise activity summary to Claude for analysis');
        const url = buildClaudeUrl(CLAUDE_PROMPT, activitySummary);
        window.open(url, '_blank');
    }

    /* Error handling wrapper */
    function executeWithErrorHandling() {
        try {
            /* First validate we're on the right page */
            validateActivityPage();
            
            /* Then extract and analyze the data */
            const activitySummary = extractActivityData();
            sendToClaudeForAnalysis(activitySummary);
        } catch (error) {
            console.error('Enhanced Strava Analysis Bookmarklet Error:', error);
            alert('Strava Analysis Error:\n\n' + error.message);
        }
    }

    /* Main execution */
    executeWithErrorHandling();
})();
