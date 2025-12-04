javascript:(function(){
    /* @title: Compare Bitbucket PR Commits */
    /* @description: Opens a comparison view between commits in a Bitbucket pull request */
    console.log('Bitbucket Compare Helper: Starting...');
    
    /* Check if we're on a Bitbucket commits page */
    if (!document.querySelector('.commits-table')) {
        alert('This bookmarklet only works on Bitbucket commit pages');
        return;
    }
    
    let selectedCommits = [];
    const maxSelections = 2;
    
    /* Extract project and repo from URL */
    const urlParts = window.location.pathname.split('/');
    const projectIndex = urlParts.indexOf('projects');
    const repoIndex = urlParts.indexOf('repos');
    
    if (projectIndex === -1 || repoIndex === -1) {
        alert('Could not determine project and repository from URL');
        return;
    }
    
    const project = urlParts[projectIndex + 1];
    const repo = urlParts[repoIndex + 1];
    console.log(`Project: ${project}, Repo: ${repo}`);
    
    /* Add selection UI styles */
    const style = document.createElement('style');
    style.textContent = `
        .commit-selector {
            cursor: pointer;
            padding: 4px 8px;
            margin: 2px;
            border: 2px solid #ccc;
            border-radius: 4px;
            background: #f5f5f5;
            font-size: 11px;
            display: inline-block;
        }
        .commit-selector:hover {
            background: #e0e0e0;
            border-color: #999;
        }
        .commit-selector.selected {
            background: #007acc;
            color: white;
            border-color: #005a99;
        }
        .compare-toolbar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: white;
            border: 2px solid #007acc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        .compare-button {
            background: #007acc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
        }
        .compare-button:hover {
            background: #005a99;
        }
        .compare-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .selection-info {
            font-size: 12px;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
    
    /* Create the compare toolbar */
    const toolbar = document.createElement('div');
    toolbar.className = 'compare-toolbar';
    toolbar.innerHTML = `
        <div class="selection-info">
            <strong>Bitbucket Compare Helper</strong><br>
            Select 2 commits to compare<br>
            <span id="selection-count">Selected: 0/2</span>
        </div>
        <button class="compare-button" id="compare-btn" disabled>Compare Commits</button>
        <button class="compare-button" id="clear-btn">Clear Selection</button>
        <button class="compare-button" id="close-btn">Close</button>
    `;
    document.body.appendChild(toolbar);
    
    /* Function to extract commit hash from row */
    function getCommitHash(row) {
        const commitLink = row.querySelector('.commit-hash a');
        if (!commitLink) return null;
        
        const href = commitLink.getAttribute('href');
        const hashMatch = href.match(/commits\/([a-f0-9]+)/);
        return hashMatch ? hashMatch[1] : null;
    }
    
    /* Function to update selection display */
    function updateSelectionDisplay() {
        document.getElementById('selection-count').textContent = `Selected: ${selectedCommits.length}/2`;
        document.getElementById('compare-btn').disabled = selectedCommits.length !== 2;
        console.log('Current selection:', selectedCommits);
    }
    
    /* Function to toggle commit selection */
    function toggleCommitSelection(row, hash) {
        const selector = row.querySelector('.commit-selector');
        const existingIndex = selectedCommits.findIndex(c => c.hash === hash);
        
        if (existingIndex !== -1) {
            /* Deselect */
            selectedCommits.splice(existingIndex, 1);
            selector.classList.remove('selected');
            selector.textContent = 'Select';
            console.log(`Deselected commit: ${hash}`);
        } else if (selectedCommits.length < maxSelections) {
            /* Select */
            selectedCommits.push({
                hash: hash,
                row: row
            });
            selector.classList.add('selected');
            selector.textContent = `#${selectedCommits.length}`;
            console.log(`Selected commit: ${hash}`);
        } else {
            alert('Maximum 2 commits can be selected. Clear selection first.');
            return;
        }
        
        updateSelectionDisplay();
    }
    
    /* Add selectors to each commit row */
    const commitRows = document.querySelectorAll('.commits-table tbody tr');
    console.log(`Found ${commitRows.length} commit rows`);
    
    commitRows.forEach((row, index) => {
        const hash = getCommitHash(row);
        if (!hash) {
            console.log(`Could not extract hash for row ${index}`);
            return;
        }
        
        console.log(`Adding selector for commit: ${hash}`);
        
        const commitCell = row.querySelector('.commit');
        if (commitCell) {
            const selector = document.createElement('div');
            selector.className = 'commit-selector';
            selector.textContent = 'Select';
            selector.title = `Select commit ${hash} for comparison`;
            
            selector.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleCommitSelection(row, hash);
            });
            
            commitCell.appendChild(selector);
        }
    });
    
    /* Compare button handler */
    document.getElementById('compare-btn').addEventListener('click', function() {
        if (selectedCommits.length !== 2) {
            alert('Please select exactly 2 commits');
            return;
        }
        
        const baseUrl = window.location.origin;
        const sourceBranch = selectedCommits[1].hash; /* Second selected (newer) */
        const targetBranch = selectedCommits[0].hash; /* First selected (older) */
        
        const compareUrl = `${baseUrl}/projects/${project}/repos/${repo}/compare/diff?sourceBranch=${sourceBranch}&targetBranch=${targetBranch}`;
        
        console.log('Opening compare URL:', compareUrl);
        window.open(compareUrl, '_blank');
    });
    
    /* Clear button handler */
    document.getElementById('clear-btn').addEventListener('click', function() {
        selectedCommits.forEach(commit => {
            const selector = commit.row.querySelector('.commit-selector');
            selector.classList.remove('selected');
            selector.textContent = 'Select';
        });
        selectedCommits = [];
        updateSelectionDisplay();
        console.log('Selection cleared');
    });
    
    /* Close button handler */
    document.getElementById('close-btn').addEventListener('click', function() {
        toolbar.remove();
        style.remove();
        
        /* Remove all selectors */
        document.querySelectorAll('.commit-selector').forEach(selector => {
            selector.remove();
        });
        
        console.log('Bitbucket Compare Helper closed');
    });
    
    console.log('Bitbucket Compare Helper: Ready!');
})();
