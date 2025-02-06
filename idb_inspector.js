javascript:(function() {
    /* Load idb library */
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

        /* Create header with controls */
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h3 style="margin:0;font-size:16px;">IndexedDB Inspector</h3>
                <button id="idb-inspector-close" style="border:none;background:none;cursor:pointer;font-size:20px;">&times;</button>
            </div>
            <div style="margin-bottom:15px;">
                <select id="idb-database-select" style="width:100%;padding:5px;margin-bottom:10px;">
                    <option value="">Select Database</option>
                </select>
                <select id="idb-store-select" style="width:100%;padding:5px;">
                    <option value="">Select Store</option>
                </select>
            </div>
            <div style="margin-bottom:15px;">
                <input type="text" id="idb-search" placeholder="Search values..." style="width:100%;padding:5px;">
            </div>
        `;
        container.appendChild(header);

        /* Create content area */
        const content = document.createElement('div');
        content.id = 'idb-content';
        content.style.cssText = 'font-family: monospace;font-size:12px;';
        container.appendChild(content);

        document.body.appendChild(container);

        /* Get list of databases */
        const databases = await window.indexedDB.databases().catch(() => []);
        const dbSelect = document.getElementById('idb-database-select');
        const storeSelect = document.getElementById('idb-store-select');
        const searchInput = document.getElementById('idb-search');
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
                /* Convert DOMStringList to Array and iterate */
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

        /* Handle store selection and display data */
        async function displayStoreData(searchTerm = '') {
            if (!currentDb || !storeSelect.value) return;

            try {
                const tx = currentDb.transaction(storeSelect.value, 'readonly');
                const store = tx.objectStore(storeSelect.value);
                let data = [];

                /* Get all data from store */
                try {
                    for await (const cursor of store) {
                        const item = {
                            key: cursor.key,
                            value: cursor.value
                        };
                        
                        /* Apply search filter if exists */
                        if (!searchTerm || 
                            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())) {
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
        
        /* Handle search */
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                displayStoreData(searchInput.value);
            }, 300);
        });

        /* Handle close button */
        document.getElementById('idb-inspector-close').addEventListener('click', () => {
            if (currentDb) {
                currentDb.close();
            }
            container.remove();
        });
    };

    document.head.appendChild(script);
})();
