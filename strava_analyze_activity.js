javascript:(function(){
    /* Strava Analysis Bookmarklet
     * This bookmarklet extracts detailed ride data from a Strava activity page,
     * formats it as JSON, and sends it to Claude for analysis.
     */

    function extractData() {
        function safeGet(selector, property = 'innerText', fallback = 'N/A', context = document) {
            const element = context.querySelector(selector);
            return element ? element[property].trim() : fallback;
        }

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

        const statsData = getTableData('.more-stats table');
        const weatherData = {
            condition: safeGet('.weather-stats .weather-stat:first-child .weather-label', 'innerText', 'N/A'),
            temperature: safeGet('.weather-stats .weather-stat:nth-child(2) .weather-value', 'innerText', 'N/A'),
            humidity: safeGet('.weather-stats .weather-stat:nth-child(3) .weather-value', 'innerText', 'N/A'),
            feelsLike: safeGet('.weather-stats .weather-column:nth-child(2) .weather-stat:nth-child(1) .weather-value', 'innerText', 'N/A'),
            windSpeed: safeGet('.weather-stats .weather-column:nth-child(2) .weather-stat:nth-child(2) .weather-value', 'innerText', 'N/A'),
            windDirection: safeGet('.weather-stats .weather-column:nth-child(2) .weather-stat:nth-child(3) .weather-value', 'innerText', 'N/A')
        };

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

        var data = {
            activity: {
                title: safeGet('h1.activity-name'),
                type: safeGet('h2.text-title3 span.title', 'innerText', '').split('–')[1]?.trim() || 'N/A',
                athlete: safeGet('h2.text-title3 span.title a'),
                date: safeGet('time', 'innerText', '').split(' on ')[1] || 'N/A',
                time: safeGet('time', 'innerText', '').split(' on ')[0] || 'N/A',
                location: safeGet('span.location'),
                description: safeGet('.activity-description-container .content'),
                stats: {
                    distance: safeGet('.inline-stats li:nth-child(1) strong'),
                    movingTime: safeGet('.inline-stats li:nth-child(2) strong'),
                    elapsedTime: typeof statsData['Elapsed Time'] === 'string' ? statsData['Elapsed Time'] : 'N/A',
                    elevationGain: safeGet('.inline-stats li:nth-child(3) strong'),
                    relativeEffort: safeGet('.inline-stats li:nth-child(4) strong'),
                    weightedAveragePower: safeGet('.secondary-stats li:nth-child(1) strong'),
                    energyOutput: safeGet('.secondary-stats li:nth-child(2) strong'),
                    averageSpeed: statsData['Speed']?.avg || 'N/A',
                    maxSpeed: statsData['Speed']?.max || 'N/A',
                    averageHeartRate: statsData['Heart Rate']?.avg || 'N/A',
                    maxHeartRate: statsData['Heart Rate']?.max || 'N/A',
                    averageCadence: statsData['Cadence']?.avg || 'N/A',
                    maxCadence: statsData['Cadence']?.max || 'N/A',
                    averagePower: statsData['Power']?.avg || 'N/A',
                    maxPower: statsData['Power']?.max || 'N/A',
                    calories: typeof statsData['Calories'] === 'string' ? statsData['Calories'] : 'N/A'
                },
                weather: weatherData,
                gear: safeGet('.gear-name'),
                device: safeGet('.device'),
                kudos: safeGet('[data-testid="kudos_count"]'),
                comments: safeGet('[data-testid="comments_count"]'),
                achievements: safeGet('footer.achievements'),
                sauceInfo: parseSauceInfo(),
                segmentEfforts: Array.from(document.querySelectorAll('#segments-container table.segments tbody tr:not(.hidden-segments)'))
                .map(row => {
                    const name = safeGet('.name-col .name', 'innerText', 'N/A', row);
                    const stats = safeGet('.name-col .stats', 'innerText', 'N/A', row).replace(/\s+/g, ' ').trim();
                    const speedText = safeGet('td:nth-child(7)', 'innerText', 'N/A', row);
                    const powerText = safeGet('td:nth-child(8)', 'innerText', 'N/A', row);
                    const speed = parseFloat(speedText.replace(/[^\d.]/g, '')) || 0;
                    const power = parseFloat(powerText.replace(/[^\d.]/g, '')) || 0;
                    const time = safeGet('.time-col', 'innerText', 'N/A', row);
                    const achievement = row.querySelector('.achievement-col div');
                    const achievementTitle = achievement ? achievement.title : 'None';
                    const isStarred = row.querySelector('.starred-col .starred.active') !== null;
                    const hasAchievement = achievement !== null;
                    const isLocalLegend = row.querySelector('.local-legend-col').innerHTML.trim() !== '';
                    const climbCatElement = row.querySelector('.climb-cat-col span');
                    const climbCategory = climbCatElement ? climbCatElement.className.match(/icon-cat-([A-Za-z0-9]+)/)?.[1] || null : null;
                    const isCategorized = climbCategory !== null;

                    return {
                        name,
                        distance: safeGet('.stats span[title="Distance"]', 'innerText', 'N/A', row),
                        elevation: safeGet('.stats span[title="Elevation difference"]', 'innerText', 'N/A', row),
                        grade: safeGet('.stats span[title="Average grade"]', 'innerText', 'N/A', row),
                        time,
                        speed,
                        power,
                        intensity: safeGet('.effort-intensity .ei-value', 'innerText', 'N/A', row),
                        heartRate: safeGet('td:nth-last-child(2)', 'innerText', 'N/A', row),
                        stats,
                        achievement: achievementTitle,
                        isStarred,
                        hasAchievement,
                        isLocalLegend,
                        isCategorized,
                        climbCategory
                    };
                })
                .filter(segment => segment.name !== 'N/A')
            }
        };
        return JSON.stringify(data, null, 2);
    }

    function sendToClaudeForAnalysis(jsonData) {
        const prompt = "Analyze this Strava ride data and provide insights on the most notable achievements, interesting segments, and overall performance. Include any recommendations for improvement if applicable:";
        const url = "https://claude.ai/new?q=" + encodeURIComponent(prompt + "\n\n" + jsonData);
        window.open(url, '_blank');
    }

    var jsonData = extractData();
    sendToClaudeForAnalysis(jsonData);
})();
