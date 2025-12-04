javascript: (function () {
    /* @title: Strava Year-over-Year Analysis */
    /* @description: Analyzes and compares Strava performance metrics year-over-year for progress tracking */
    /* @domains: strava.com */
    const DEFAULT_FTP = 270; /* Set your default FTP here */

    /* Utility function to calculate FTP */
    function calculateFTP() {
        const powerController = pageView?._powerController?.attributes;
        if (!powerController?.weighted_power || !powerController?.relative_intensity) {
            return DEFAULT_FTP;  /* Return default if no power data available */
        }
        return (powerController.weighted_power / powerController.relative_intensity) * 100;
    }

    /* Format time from seconds to human readable */
    function formatTime(seconds) {
        seconds = Math.round(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /* Create results display */
    function createResultsDisplay(results) {
        const container = document.createElement('div');
        container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 80vh;
        overflow-y: auto;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

        container.innerHTML = `
        <style>
            .segment-table {
                border-collapse: collapse;
                margin: 10px 0;
                min-width: 500px;
            }
            .segment-table th,
            .segment-table td {
                padding: 4px 8px;
                border: 1px solid #ddd;
                text-align: right;
            }
            .segment-table th:first-child,
            .segment-table td:first-child {
                text-align: left;
            }
            .positive { color: #2ecc71; }
            .negative { color: #e74c3c; }
            .close-btn {
                position: absolute;
                top: 5px;
                right: 5px;
                padding: 5px 10px;
                cursor: pointer;
                border: none;
                background: none;
                font-size: 20px;
                color: #666;
            }
            .segment-name {
                font-size: 16px;
                font-weight: bold;
                margin: 15px 0 5px;
            }
            .efforts-count {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
            }
            .efforts-link {
                color: #666;
                text-decoration: none;
            }
            .efforts-link:hover {
                text-decoration: underline;
                color: #333;
            }
        </style>
        <button class="close-btn">×</button>
        <h2 style="margin-top: 0;">Segment YoY Performance Analysis</h2>
    `;

        results.forEach(result => {
            const segmentHtml = `
            <div class="segment-name">${result.segmentName}</div>
            <div class="efforts-count">
                <a href="https://www.strava.com/segments/${result.segmentId}?filter=my_results" 
                   class="efforts-link" 
                   target="_blank">${result.totalEfforts} efforts</a>
            </div>
            <table class="segment-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>This Ride</th>
                        <th>YoY Avg</th>
                        <th>Diff</th>
                        <th>YoY Pos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Power</td>
                        <td>${result.currentPower ? result.currentPower.toFixed(1) + 'W' : 'N/A'}</td>
                        <td>${result.averagePower ? result.averagePower.toFixed(1) + 'W' : 'N/A'}</td>
                        <td class="${result.powerImprovement >= 0 ? 'positive' : 'negative'}">
                            ${result.powerImprovement ? (result.powerImprovement >= 0 ? '+' : '') + result.powerImprovement.toFixed(1) + '%' : 'N/A'}
                        </td>
                        <td>${result.powerRank || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td>Time</td>
                        <td>${result.currentTime ? formatTime(result.currentTime) : 'N/A'}</td>
                        <td>${result.averageTime ? formatTime(result.averageTime) : 'N/A'}</td>
                        <td class="${result.timeImprovement <= 0 ? 'positive' : 'negative'}">
                            ${result.timeImprovement ? (result.timeImprovement >= 0 ? '+' : '') + result.timeImprovement.toFixed(1) + '%' : 'N/A'}
                        </td>
                        <td>${result.timeRank || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        `;
            container.insertAdjacentHTML('beforeend', segmentHtml);
        });

        container.querySelector('.close-btn').onclick = () => container.remove();
        document.body.appendChild(container);
    }

    /* Analyze segment performance */
    function analyzeSegmentPerformance(currentEffort, historyData) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        /* Ensure historyData and efforts exist */
        if (!historyData?.efforts?.length) {
            return null;
        }

        const recentEfforts = historyData.efforts.filter(effort =>
            new Date(effort.start_date) > oneYearAgo
        );

        /* Filter valid power efforts before sorting/averaging */
        const powerEfforts = recentEfforts.filter(e => e.avg_watts_calc && !isNaN(e.avg_watts_calc));

        const sortedByPower = [...powerEfforts].sort((a, b) => b.avg_watts_calc - a.avg_watts_calc);
        const sortedByTime = [...recentEfforts].sort((a, b) => a.elapsed_time - b.elapsed_time);

        const avgPower = powerEfforts.length > 0 ?
            powerEfforts.reduce((sum, e) => sum + e.avg_watts_calc, 0) / powerEfforts.length : null;

        const avgTime = recentEfforts.length > 0 ?
            recentEfforts.reduce((sum, e) => sum + e.elapsed_time, 0) / recentEfforts.length : null;

        const currentPower = currentEffort.attributes.avg_watts_raw;
        const currentTime = currentEffort.attributes.elapsed_time_raw;

        /* Calculate rankings only if we have valid data */
        let powerRank = null;
        let timeRank = null;
        let powerImprovement = null;
        let timeImprovement = null;

        if (currentPower && sortedByPower.length) {
            const powerPosition = sortedByPower.findIndex(e => e.avg_watts_calc <= currentPower);
            const actualPowerPos = powerPosition === -1 ? sortedByPower.length + 1 : powerPosition + 1;
            powerRank = getOrdinalSuffix(actualPowerPos);
        }

        if (currentTime && sortedByTime.length) {
            const timePosition = sortedByTime.findIndex(e => e.elapsed_time >= currentTime);
            const actualTimePos = timePosition === -1 ? sortedByTime.length + 1 : timePosition + 1;
            timeRank = getOrdinalSuffix(actualTimePos);
        }

        if (currentPower && avgPower) {
            powerImprovement = ((currentPower - avgPower) / avgPower) * 100;
        }

        if (currentTime && avgTime) {
            timeImprovement = ((currentTime - avgTime) / avgTime) * 100;
        }

        return {
            currentPower,
            currentTime,
            averagePower: avgPower,
            averageTime: avgTime,
            powerImprovement,
            timeImprovement,
            totalEfforts: recentEfforts.length,
            segmentName: currentEffort.attributes.name,
            segmentId: currentEffort.attributes.segment_id,  /* Added this line */
            powerRank,
            timeRank
        };
    }

    /* Helper function for ordinal suffixes */
    function getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j == 1 && k != 11) return num + "st";
        if (j == 2 && k != 12) return num + "nd";
        if (j == 3 && k != 13) return num + "rd";
        return num + "th";
    }

    /* Process single segment history */
    async function fetchSegmentHistory(segmentId, csrfToken) {
        try {
            const response = await fetch(`https://www.strava.com/athlete/segments/${segmentId}/history`, {
                headers: {
                    'accept': 'text/javascript, application/javascript',
                    'x-csrf-token': csrfToken,
                    'x-requested-with': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch history for segment ${segmentId}:`, error);
            return null;
        }
    }

    /* Main execution */
    async function analyze() {
        /* Get CSRF token */
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            alert('Unable to find CSRF token. Please ensure you are on a Strava activity page.');
            return;
        }

        /* Calculate FTP or use default */
        const ftp = calculateFTP();

        /* Get segment efforts */
        const efforts = pageView?.segmentEfforts()?.models;
        if (!efforts?.length) {
            alert('No segment efforts found on this page.');
            return;
        }

        /* Filter relevant segments - now more permissive */
        const relevantEfforts = efforts.filter(effort => {
            const attrs = effort.attributes;
            return (
                attrs.activity_leaderboard_eligible &&
                attrs.effort_leaderboard_eligible &&
                !attrs.hidden &&
                !attrs.flagged &&
                (!attrs.avg_watts_raw || attrs.avg_watts_raw > ftp)  /* Include if no power or exceeds FTP */
            );
        });

        if (!relevantEfforts.length) {
            alert('No segments found matching criteria.');
            return;
        }

        /* Fetch and analyze segment histories */
        const analyses = await Promise.all(
            relevantEfforts.map(async effort => {
                const history = await fetchSegmentHistory(effort.attributes.segment_id, csrfToken);
                if (!history) return null;
                return analyzeSegmentPerformance(effort, history);
            })
        );

        /* Display results */
        const validAnalyses = analyses.filter(Boolean);
        if (validAnalyses.length === 0) {
            alert('No valid segment analyses available.');
            return;
        }

        createResultsDisplay(validAnalyses);
    }

    analyze();
})();
