# Strava Activity Data Extractor Bookmarklet

## Overview

The [Strava Activity Data Extractor](strava_activity_data_extractor.js) is a JavaScript bookmarklet designed to extract detailed activity data from a Strava Activity webpage and copy it to the clipboard in JSON format. It also opens a new window displaying the extracted data.

## Features

- Extracts activity details, weather data, statistics, and segment efforts from the webpage.
- Copies the extracted data to the clipboard in JSON format.
- Opens a new window displaying the extracted data.

## Usage

1. Create a new bookmark in your browser.
2. Edit the bookmark and paste the following code into the URL field:

    ```javascript
    javascript:(function(){
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
                    segmentEfforts: Array.from(document.querySelectorAll('#segments-container table.segments tbody tr:not(.hidden-segments)'))
                    .map(row => {
                        return {
                            name: safeGet('.name-col .name', 'innerText', 'N/A', row),
                            distance: safeGet('.stats span[title="Distance"]', 'innerText', 'N/A', row),
                            elevation: safeGet('.stats span[title="Elevation difference"]', 'innerText', 'N/A', row),
                            grade: safeGet('.stats span[title="Average grade"]', 'innerText', 'N/A', row),
                            time: safeGet('.time-col', 'innerText', 'N/A', row),
                            speed: safeGet('td:nth-child(7)', 'innerText', 'N/A', row),
                            power: safeGet('td:nth-child(8)', 'innerText', 'N/A', row),
                            intensity: safeGet('.effort-intensity .ei-value', 'innerText', 'N/A', row),
                            heartRate: safeGet('td:nth-last-child(2)', 'innerText', 'N/A', row)
                        };
                    })
                    .filter(segment => segment.name !== 'N/A')
                }
            };
            return JSON.stringify(data, null, 2);
        }

        async function copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                console.log('JSON data copied to clipboard');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }

        var jsonData = extractData();
        /* Open in new window */
        var newWindow = window.open();
        newWindow.document.write('<pre>' + jsonData + '</pre>');
        newWindow.document.close(); // Prevent the spinning icon
        /* Copy to clipboard */
        copyToClipboard(jsonData);
    })();
    ```

3. Save the bookmark.
4. Navigate to the desired activity webpage.
5. Click the bookmark to extract the data.


## License

This project is licensed under the MIT License.
