javascript:(function() {
    /* Quick and easy access to IndexedDB tables and data */
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/idb@8/build/umd.js';
    
    script.onload = async function() {
        /* Create UI container */
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 999999;
            overflow: auto;
            font-family: system-ui, sans-serif;
        `;

        /* Add draggable functionality */
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        /* Create header with controls */
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="position:sticky;top:0;background:white;border-bottom:1px solid #eee;margin:-15px -15px 15px -15px;padding:15px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;" class="drag-handle">
                    <h3 style="margin:0;font-size:16px;cursor:move;">
                        <span style="color:#666;margin-right:5px;">☰</span>
                        IndexedDB Inspector
                    </h3>
                    <div>
                        <button id="idb-inspector-minimize" 
                            style="border:none;background:#f0f0f0;cursor:pointer;font-size:14px;margin-right:5px;padding:2px 8px;border-radius:3px;">−</button>
                        <button id="idb-inspector-close" 
                            style="border:none;background:#f0f0f0;cursor:pointer;font-size:14px;padding:2px 8px;border-radius:3px;">×</button>
                    </div>
                </div>
                <div id="idb-inspector-content">
                    <div style="margin-bottom:15px;">
                        <select id="idb-database-select" style="width:100%;padding:5px;margin-bottom:10px;border:1px solid #ccc;border-radius:3px;">
                            <option value="">Select Database</option>
                        </select>
                        <select id="idb-store-select" style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;">
                            <option value="">Select Store</option>
                        </select>
                    </div>
                    <div style="margin-bottom:15px;">
                        <select id="idb-query-type" style="width:100%;padding:5px;margin-bottom:10px;border:1px solid #ccc;border-radius:3px;">
                            <option value="simple">Simple Text Search</option>
                            <option value="key">Key Search</option>
                            <option value="value">Value Path Search</option>
                            <option value="regex">Regex Search</option>
                            <option value="range">Key Range</option>
                        </select>
                        <div id="query-inputs">
                            <input type="text" id="idb-search" 
                                placeholder="Search values..." 
                                style="width:100%;padding:5px;border:1px solid #ccc;border-radius:3px;">
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(header);

        /* Create content area */
        const content = document.createElement('div');
        content.id = 'idb-content';
        content.style.cssText = 'font-family: monospace;font-size:12px;';
        container.appendChild(content);

        document.body.appendChild(container);

        /* Initialize dragging */
        const dragHandle = container.querySelector('.drag-handle');
        
        dragHandle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === dragHandle || e.target.parentNode === dragHandle) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                
                container.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        /* Setup query type handling */
        const queryType = document.getElementById('idb-query-type');
        const queryInputs = document.getElementById('query-inputs');

        queryType.addEventListener('change', () => {
            switch(queryType.value) {
                case 'simple':
                    queryInputs.innerHTML = `
                        <input type="text" id="idb-search" placeholder="Search values..." style="width:100%;padding:5px;">
                    `;
                    break;
                case 'key':
                    queryInputs.innerHTML = `
                        <input type="text" id="idb-search" placeholder="Exact key to search..." style="width:100%;padding:5px;">
                    `;
                    break;
                case 'value':
                    queryInputs.innerHTML = `
                        <input type="text" id="idb-search" placeholder="Path (e.g. user.name)" style="width:100%;padding:5px;margin-bottom:5px;">
                        <input type="text" id="idb-search-value" placeholder="Value to match" style="width:100%;padding:5px;">
                    `;
                    break;
                case 'regex':
                    queryInputs.innerHTML = `
                        <input type="text" id="idb-search" placeholder="Regular expression" style="width:100%;padding:5px;">
                        <div style="font-size:11px;color:#666;margin-top:3px;">Use format: /pattern/flags</div>
                    `;
                    break;
                case 'range':
                    queryInputs.innerHTML = `
                        <input type="text" id="idb-search-min" placeholder="Min value" style="width:calc(50% - 5px);padding:5px;margin-right:5px;">
                        <input type="text" id="idb-search-max" placeholder="Max value" style="width:calc(50% - 5px);padding:5px;">
                    `;
                    break;
            }
        });

        /* Get list of databases */
        const databases = await window.indexedDB.databases().catch(() => []);
        const dbSelect = document.getElementById('idb-database-select');
        const storeSelect = document.getElementById('idb-store-select');
        const contentArea = document.getElementById('idb-content');

        /* Populate database dropdown */
        databases.forEach(db => {
            const option = document.createElement('option');
            option.value = db.name;
            option.textContent = `${db.name} (v${db.version})`;
            dbSelect.appendChild(option);
        });

        let currentDb = null;

        /* Handle database selection */
        dbSelect.addEventListener('change', async () => {
            if (currentDb) {
                currentDb.close();
            }
            storeSelect.innerHTML = '<option value="">Select Store</option>';
            contentArea.innerHTML = '';
            
            if (!dbSelect.value) return;

            try {
                currentDb = await idb.openDB(dbSelect.value);
                Array.from(currentDb.objectStoreNames).forEach(storeName => {
                    const option = document.createElement('option');
                    option.value = storeName;
                    option.textContent = storeName;
                    storeSelect.appendChild(option);
                });
            } catch (err) {
                contentArea.innerHTML = `<div style="color:red">Error opening database: ${err.message}</div>`;
            }
        });

        /* Query execution function */
        function executeQuery(item, queryConfig) {
            const { type, searchStr, searchValue, minValue, maxValue } = queryConfig;
            
            switch(type) {
                case 'simple':
                    return JSON.stringify(item).toLowerCase().includes(searchStr.toLowerCase());
                    
                case 'key':
                    return String(item.key) === searchStr;
                    
                case 'value':
                    const path = searchStr.split('.');
                    let value = item.value;
                    for (const key of path) {
                        value = value?.[key];
                        if (value === undefined) return false;
                    }
                    return String(value) === searchValue;
                    
                case 'regex':
                    try {
                        const [, pattern, flags] = searchStr.match(/^\/(.+)\/([gimuy]*)$/);
                        const regex = new RegExp(pattern, flags);
                        return regex.test(JSON.stringify(item));
                    } catch {
                        return false;
                    }
                    
                case 'range':
                    const key = Number(item.key);
                    const min = Number(minValue);
                    const max = Number(maxValue);
                    return !isNaN(key) && (isNaN(min) || key >= min) && (isNaN(max) || key <= max);
                    
                default:
                    return true;
            }
        }

        /* Handle store selection and display data */
        async function displayStoreData() {
            if (!currentDb || !storeSelect.value) return;

            try {
                const tx = currentDb.transaction(storeSelect.value, 'readonly');
                const store = tx.objectStore(storeSelect.value);
                let data = [];

                /* Get query configuration */
                const type = queryType.value;
                const queryConfig = {
                    type,
                    searchStr: document.getElementById('idb-search')?.value || '',
                    searchValue: document.getElementById('idb-search-value')?.value || '',
                    minValue: document.getElementById('idb-search-min')?.value || '',
                    maxValue: document.getElementById('idb-search-max')?.value || ''
                };

                /* Get all data from store */
                try {
                    for await (const cursor of store) {
                        const item = {
                            key: cursor.key,
                            value: cursor.value
                        };
                        
                        if (executeQuery(item, queryConfig)) {
                            data.push(item);
                        }
                    }
                } catch (err) {
                    throw new Error(`Failed to read store data: ${err.message}`);
                }

                /* Display data */
                contentArea.innerHTML = data.map(item => `
                    <div style="margin-bottom:10px;padding:5px;border-bottom:1px solid #eee;">
                        <div style="color:#666;margin-bottom:3px;">Key: ${
                            typeof item.key === 'object' ? 
                            JSON.stringify(item.key) : 
                            String(item.key)
                        }</div>
                        <div style="white-space:pre-wrap;">${
                            JSON.stringify(item.value, null, 2)
                        }</div>
                    </div>
                `).join('') || '<div style="color:#666">No data found</div>';

            } catch (err) {
                contentArea.innerHTML = `<div style="color:red">Error: ${err.message}</div>`;
            }
        }

        storeSelect.addEventListener('change', () => displayStoreData());
        
        /* Handle search input changes */
        function setupSearchListeners() {
            const inputs = queryInputs.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    clearTimeout(input.searchTimeout);
                    input.searchTimeout = setTimeout(() => {
                        displayStoreData();
                    }, 300);
                });
            });
        }

        queryType.addEventListener('change', setupSearchListeners);
        setupSearchListeners();

        /* Handle minimize/maximize */
        let isMinimized = false;
        document.getElementById('idb-inspector-minimize').addEventListener('click', () => {
            const content = document.getElementById('idb-inspector-content');
            const contentArea = document.getElementById('idb-content');
            
            if (isMinimized) {
                content.style.display = 'block';
                contentArea.style.display = 'block';
                container.style.height = 'auto';
            } else {
                content.style.display = 'none';
                contentArea.style.display = 'none';
                container.style.height = 'auto';
            }
            isMinimized = !isMinimized;
        });

        /* Handle close button */
        document.getElementById('idb-inspector-close').addEventListener('click', () => {
            if (currentDb) {
                currentDb.close();
            }
            container.remove();
        });

        /* Handle escape key to close */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (currentDb) {
                    currentDb.close();
                }
                container.remove();
            }
        });
    };

    document.head.appendChild(script);
})();
