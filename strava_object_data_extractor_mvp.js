javascript:(function() {
    /* Segment Data Extractor for Bike Coaches -- https://claude.ai/chat/a5f510fd-eac5-4913-bc54-0064effd7e5c */
    function extractSegmentData() {
        const segmentEfforts = pageView._segmentEffortsTableContext.segmentEfforts.models;
        const data = segmentEfforts.map(effort => {
            const attrs = effort.attributes;
            return {
                name: attrs.name,
                distance: attrs.distance,
                elapsedTime: attrs.elapsed_time,
                avgSpeed: attrs.avg_speed,
                maxSpeed: attrs.max_speed,
                avgWatts: attrs.avg_watts,
                avgHR: attrs.avg_hr,
                maxHR: attrs.max_hr,
                avgCadence: attrs.avg_cadence,
                maxCadence: attrs.max_cadence,
                elevGain: attrs.elev_gain,
                avgGrade: attrs.avg_grade
            };
        });

        return data;
    }

    function createPopup(data) {
        const popupStyle = `
            position: fixed;
            top: 20px;
            left: 20px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        const popupHTML = `
            <div id="segmentDataPopup" style="${popupStyle}">
                <h2>Segment Performance Data</h2>
                <button onclick="document.body.removeChild(document.getElementById('segmentDataPopup'))">Close</button>
                <table border="1" cellpadding="5" style="border-collapse: collapse; margin-top: 10px;">
                    <tr>
                        <th>Segment</th>
                        <th>Distance</th>
                        <th>Time</th>
                        <th>Avg Speed</th>
                        <th>Max Speed</th>
                        <th>Avg Watts</th>
                        <th>Avg HR</th>
                        <th>Max HR</th>
                        <th>Avg Cadence</th>
                        <th>Max Cadence</th>
                        <th>Elev Gain</th>
                        <th>Avg Grade</th>
                    </tr>
                    ${data.map(segment => `
                        <tr>
                            <td>${segment.name}</td>
                            <td>${segment.distance}</td>
                            <td>${segment.elapsedTime}</td>
                            <td>${segment.avgSpeed}</td>
                            <td>${segment.maxSpeed}</td>
                            <td>${segment.avgWatts}</td>
                            <td>${segment.avgHR}</td>
                            <td>${segment.maxHR}</td>
                            <td>${segment.avgCadence}</td>
                            <td>${segment.maxCadence}</td>
                            <td>${segment.elevGain}</td>
                            <td>${segment.avgGrade}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;

        const popupElement = document.createElement('div');
        popupElement.innerHTML = popupHTML;
        document.body.appendChild(popupElement.firstChild);
    }

    const segmentData = extractSegmentData();
    createPopup(segmentData);
})();
