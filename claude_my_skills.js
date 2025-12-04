javascript:(function() {
  /* @title: View My Skills */
  /* @description: Display a sortable list of all available Claude skills with descriptions and domains */
  /* @domains: claude.ai */
  /* Close existing overlay if present */
  const existing = document.getElementById('claude-skills-overlay');
  if (existing) {
    existing.remove();
    return;
  }

  /* Create overlay container */
  const overlay = document.createElement('div');
  overlay.id = 'claude-skills-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 400px;
    max-height: 80vh;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 999999;
    display: flex;
    flex-direction: column;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  /* Header */
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  header.innerHTML = `
    <div>
      <div style="font-size: 18px; font-weight: 600; color: #1f2937;">Claude Skills</div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Click to install skills directly</div>
    </div>
    <button id="close-overlay" style="
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
    ">×</button>
  `;
  overlay.appendChild(header);

  /* Loading state */
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  `;
  content.innerHTML = `
    <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
      <div style="margin-bottom: 12px;">Loading releases...</div>
      <div style="width: 32px; height: 32px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
    </div>
  `;
  overlay.appendChild(content);

  /* Add CSS animation */
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  document.body.appendChild(overlay);

  /* Close button handler */
  document.getElementById('close-overlay').addEventListener('click', () => {
    overlay.remove();
  });

  /* Fetch releases */
  fetch('https://api.github.com/repos/oaustegard/claude-skills/releases')
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      return response.json();
    })
    .then(releases => {
      /* Sort alphabetically by tag name */
      releases.sort((a, b) => {
        const nameA = (a.tag_name || a.name || '').toLowerCase();
        const nameB = (b.tag_name || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });

      /* Filter releases with .zip assets */
      const releasesWithZips = releases.filter(release => 
        release.assets && release.assets.some(asset => 
          asset.name.toLowerCase().endsWith('.zip')
        )
      );

      if (releasesWithZips.length === 0) {
        content.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
            No skill releases found
          </div>
        `;
        return;
      }

      /* Build skills list */
      content.innerHTML = '';
      releasesWithZips.forEach(release => {
        const zipAssets = release.assets.filter(asset => 
          asset.name.toLowerCase().endsWith('.zip')
        );

        zipAssets.forEach(asset => {
          const skillItem = document.createElement('div');
          skillItem.style.cssText = `
            padding: 12px;
            margin-bottom: 8px;
            background: #f9fafb;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s;
          `;

          skillItem.innerHTML = `
            <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${release.name || release.tag_name}</div>
            <div style="font-size: 12px; color: #6b7280;">${asset.name}</div>
            <div style="font-size: 11px; color: #9ca3af; margin-top: 4px;">Click to install</div>
          `;

          let fileData = null;

          /* Click to upload directly */
          skillItem.addEventListener('click', async () => {
            if (fileData) {
              /* Already uploaded */
              return;
            }

            try {
              /* Show loading state */
              skillItem.style.cursor = 'wait';
              skillItem.innerHTML = `
                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${release.name || release.tag_name}</div>
                <div style="font-size: 12px; color: #6b7280;">${asset.name}</div>
                <div style="font-size: 11px; color: #3b82f6; margin-top: 4px;">Downloading...</div>
              `;

              /* Fetch the blob */
              const response = await fetch(`https://api.github.com/repos/oaustegard/claude-skills/releases/assets/${asset.id}`, {
                headers: {
                  'Accept': 'application/octet-stream'
                }
              });
              
              if (!response.ok) {
                throw new Error(`Download failed: ${response.status}`);
              }
              const blob = await response.blob();
              
              /* Create File object */
              const file = new File([blob], asset.name, { type: 'application/zip' });
              
              /* Show uploading state */
              skillItem.innerHTML = `
                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${release.name || release.tag_name}</div>
                <div style="font-size: 12px; color: #6b7280;">${asset.name}</div>
                <div style="font-size: 11px; color: #3b82f6; margin-top: 4px;">Uploading to Claude...</div>
              `;

              /* Extract org ID from multiple sources */
              let orgId = null;
              
              /* Method 1: From lastActiveOrg in script tags (most reliable) */
              const scripts = Array.from(document.querySelectorAll('script'));
              for (const script of scripts) {
                if (script.textContent) {
                  /* Match with escaped quotes: \"name\":\"lastActiveOrg\",\"value\":\"UUID\" */
                  const lastActiveMatch = script.textContent.match(/\\"name\\":\\"lastActiveOrg\\",\\"value\\":\\"([a-f0-9-]{36})\\"/);
                  if (lastActiveMatch) {
                    orgId = lastActiveMatch[1];
                    break;
                  }
                  /* Also try without escaped quotes in case format differs */
                  const simpleMatch = script.textContent.match(/"name":"lastActiveOrg","value":"([a-f0-9-]{36})"/);
                  if (simpleMatch) {
                    orgId = simpleMatch[1];
                    break;
                  }
                  /* Simplest: just find lastActiveOrg followed by any UUID */
                  const looseMatch = script.textContent.match(/lastActiveOrg[^\w]*([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/);
                  if (looseMatch) {
                    orgId = looseMatch[1];
                    break;
                  }
                }
              }
              
              /* Method 2: From URL path */
              if (!orgId) {
                const pathMatch = window.location.pathname.match(/\/organizations\/([a-f0-9-]{36})/);
                if (pathMatch) orgId = pathMatch[1];
              }
              
              /* Method 3: From any link with organizations path */
              if (!orgId) {
                const orgLink = document.querySelector('a[href*="/organizations/"]');
                if (orgLink) {
                  const linkMatch = orgLink.href.match(/\/organizations\/([a-f0-9-]{36})/);
                  if (linkMatch) orgId = linkMatch[1];
                }
              }
              
              /* Method 4: From localStorage/sessionStorage */
              if (!orgId) {
                const stored = localStorage.getItem('lastActiveOrg') ||
                               localStorage.getItem('selectedOrganizationId') || 
                               sessionStorage.getItem('selectedOrganizationId');
                if (stored) orgId = stored;
              }
              
              /* Method 5: From organizationId in script tags */
              if (!orgId) {
                for (const script of scripts) {
                  if (script.textContent) {
                    const match = script.textContent.match(/"organizationId":"([a-f0-9-]{36})"/);
                    if (match) {
                      orgId = match[1];
                      break;
                    }
                  }
                }
              }
              
              if (!orgId) {
                /* Debug output */
                console.error('Could not find org ID. Debug info:');
                console.log('URL:', window.location.href);
                console.log('Has scripts:', scripts.length);
                console.log('Sample script content:', scripts[0]?.textContent?.substring(0, 200));
                throw new Error('Could not determine organization ID. Check console for debug info.');
              }
              
              console.log('Using organization ID:', orgId);

              /* Upload to Claude API */
              const formData = new FormData();
              formData.append('file', file);
              
              const uploadResponse = await fetch(
                `https://claude.ai/api/organizations/${orgId}/skills/upload-skill?overwrite=false`,
                {
                  method: 'POST',
                  body: formData,
                  credentials: 'include'
                }
              );
              
              if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
              }
              
              /* Mark as uploaded */
              fileData = file;
              skillItem.style.cursor = 'default';
              skillItem.style.background = '#d1fae5';
              skillItem.style.borderColor = '#10b981';
              skillItem.innerHTML = `
                <div style="font-weight: 500; color: #1f2937; margin-bottom: 4px;">${release.name || release.tag_name}</div>
                <div style="font-size: 12px; color: #6b7280;">${asset.name}</div>
                <div style="font-size: 11px; color: #10b981; margin-top: 4px;">✓ Uploaded successfully!</div>
              `;
              
              console.log('Skill uploaded:', asset.name);
            } catch (error) {
              console.error('Failed to upload skill:', error);
              skillItem.style.cursor = 'pointer';
              skillItem.innerHTML = `
                <div style="font-weight: 500; color: #dc2626; margin-bottom: 4px;">${release.name || release.tag_name}</div>
                <div style="font-size: 12px; color: #6b7280;">${asset.name}</div>
                <div style="font-size: 11px; color: #dc2626; margin-top: 4px;">${error.message}</div>
              `;
              fileData = null;
            }
          });

          skillItem.addEventListener('mouseenter', () => {
            if (!fileData) {
              skillItem.style.background = '#f3f4f6';
              skillItem.style.borderColor = '#d1d5db';
            }
          });

          skillItem.addEventListener('mouseleave', () => {
            if (!fileData) {
              skillItem.style.background = '#f9fafb';
              skillItem.style.borderColor = '#e5e7eb';
            }
          });

          content.appendChild(skillItem);
        });
      });

      /* Add instruction footer */
      const footer = document.createElement('div');
      footer.style.cssText = `
        padding: 12px 16px;
        border-top: 1px solid #e5e7eb;
        font-size: 12px;
        color: #6b7280;
        background: #f9fafb;
        border-radius: 0 0 12px 12px;
      `;
      footer.textContent = `Click any skill to install it directly to your Claude account`;
      overlay.appendChild(footer);
    })
    .catch(error => {
      console.error('Failed to fetch releases:', error);
      content.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="color: #dc2626; font-weight: 500; margin-bottom: 8px;">Error Loading Skills</div>
          <div style="color: #6b7280; font-size: 14px;">${error.message}</div>
        </div>
      `;
    });
})();
