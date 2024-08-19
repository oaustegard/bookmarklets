javascript:(function() {
    const sortFunctions = {
        star: (a, b) => {
            const aStarred = a.querySelector('.starred-segment.active') !== null;
            const bStarred = b.querySelector('.starred-segment.active') !== null;
            if (aStarred !== bStarred) return bStarred - aStarred;
            const getStarValue = row => {
                const scoreDiv = row.querySelector('.sauce-segment-score');
                if (scoreDiv) {
                    return parseInt(scoreDiv.textContent.replace(',', ''));
                }
                return 0;
            };
            return getStarValue(b) - getStarValue(a);
        },
        achievement: (a, b) => {
            const getAchievementValue = row => {
                const achievementDiv = row.querySelector('.achievement-col .app-icon');
                if (!achievementDiv) return 0;
                const classes = achievementDiv.className;
                console.log('Achievement classes:', classes);
                if (classes.includes('icon-at-kom-1')) return 1000;
                if (classes.includes('icon-at-kom-')) {
                    const komNumber = parseInt(classes.match(/icon-at-kom-(\d+)/)[1]);
                    return 1000 - komNumber;
                }
                if (classes.includes('icon-at-pr-')) {
                    const prNumber = parseInt(classes.match(/icon-at-pr-(\d+)/)[1]);
                    return 500 - prNumber;
                }
                return 0;
            };
            const aValue = getAchievementValue(a);
            const bValue = getAchievementValue(b);
            console.log('Achievement values:', aValue, bValue);
            return bValue - aValue;
        },
        legend: (a, b) => {
            const getLegendValue = row => {
                const legendDiv = row.querySelector('.local-legend-col .app-icon');
                if (legendDiv) {
                    if (legendDiv.classList.contains('icon-local-legend')) return 1000;
                    return 500; // Other values
                }
                return 0; // No icon present
            };
            const aValue = getLegendValue(a);
            const bValue = getLegendValue(b);
            console.log('Legend values:', aValue, bValue);
            return bValue - aValue || a.rowIndex - b.rowIndex; // Stable sort
        },
        name: (a, b) => a.querySelector('.name').textContent.localeCompare(b.querySelector('.name').textContent),
        time: (a, b) => {
            const getSeconds = timeString => {
                if (timeString.includes(':')) {
                    const parts = timeString.split(':').map(Number);
                    return parts.length === 3 ? parts[0]*3600 + parts[1]*60 + parts[2] : parts[0]*60 + parts[1];
                } else {
                    return parseInt(timeString);
                }
            };
            return getSeconds(a.querySelector('.time-col').textContent) - getSeconds(b.querySelector('.time-col').textContent);
        },
        numeric: (a, b, selector) => {
            const aValue = parseFloat(a.querySelector(selector).textContent);
            const bValue = parseFloat(b.querySelector(selector).textContent);
            return bValue - aValue;
        },
        intensity: (a, b) => {
            const getIntensity = row => {
                const intensityDiv = row.querySelector('.effort-intensity');
                if (!intensityDiv) return 0;
                const eiValueDiv = intensityDiv.querySelector('.ei-value');
                if (!eiValueDiv) return 0;
                return parseFloat(eiValueDiv.textContent);
            };
            return getIntensity(b) - getIntensity(a);
        }
    };

    function prepareTable(table) {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.removeAttribute('colspan');
            header.style.cursor = 'pointer';
            const oldNode = header;
            const newNode = oldNode.cloneNode(true);
            oldNode.parentNode.replaceChild(newNode, oldNode);
        });

        const starHeader = table.querySelector('th.starred-col');
        if (starHeader) starHeader.textContent = '⭐️';
        const achievementHeader = table.querySelector('th.achievement-col');
        if (achievementHeader) achievementHeader.textContent = '🎖️';
        const legendHeader = table.querySelector('th.local-legend-col');
        if (legendHeader) legendHeader.textContent = '🦸🏻';

        const nameHeader = table.querySelector('th.name-col');
        if (nameHeader) {
            const climbCatHeader = document.createElement('th');
            climbCatHeader.textContent = '🏔️';
            climbCatHeader.style.cursor = 'pointer';
            nameHeader.after(climbCatHeader);
        }

        const powerIntensityHeader = table.querySelector('th:nth-child(8)');
        if (powerIntensityHeader) {
            const powerHeader = document.createElement('th');
            powerHeader.textContent = 'Power';
            powerHeader.style.cursor = 'pointer';
            const intensityHeader = document.createElement('th');
            intensityHeader.textContent = 'Intensity';
            intensityHeader.style.cursor = 'pointer';
            powerIntensityHeader.parentNode.replaceChild(powerHeader, powerIntensityHeader);
            powerHeader.after(intensityHeader);
        }
    }

    function makeSortable(table) {
        prepareTable(table);
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => sortTable(table, index));
        });
    }

    function sortTable(table, column) {
        console.log('Sorting column:', column);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const sortFunction = (() => {
            switch(column) {
                case 0: return sortFunctions.star;
                case 1: return sortFunctions.achievement;
                case 2: return sortFunctions.legend;
                case 3: return sortFunctions.name;
                case 4: return () => 0;
                case 5: return sortFunctions.time;
                case 6: return (a, b) => sortFunctions.numeric(a, b, 'td:nth-child(7)');
                case 7: return (a, b) => sortFunctions.numeric(a, b, 'td:nth-child(8)');
                case 8: return sortFunctions.intensity;
                case 9: return (a, b) => sortFunctions.numeric(a, b, 'td:nth-child(10)');
                case 10: return (a, b) => sortFunctions.numeric(a, b, 'td:nth-child(11)');
                default: return (a, b) => 0;
            }
        })();

        rows.sort(sortFunction);

        if (table.sorted && table.sorted.column === column) {
            rows.reverse();
            table.sorted.asc = !table.sorted.asc;
        } else {
            table.sorted = { column: column, asc: true };
        }

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }

    const segmentsSection = document.getElementById('segments');
    if (segmentsSection) {
        const table = segmentsSection.querySelector('table');
        if (table) {
            makeSortable(table);
            console.log('Table made sortable');
        } else {
            console.log('Table not found');
        }
    } else {
        console.log('Segments section not found');
    }
})();
