javascript: (function() {
  /* @title: Search DOM Properties */
  /* @description: Search window object properties by key, value, regex, or range with interactive UI */
  /* Helper function to create elements with properties */
  function createElement(tag, props = {}, ...children) {
    const elem = document.createElement(tag);
    for (let [key, value] of Object.entries(props)) {
      if (key === 'style') {
        Object.assign(elem.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        elem.addEventListener(key.substring(2), value);
      } else {
        elem[key] = value;
      }
    }
    children.forEach(child => {
      if (child === null || child === undefined) return;
      if (typeof child === 'string') {
        elem.appendChild(document.createTextNode(child));
      } else {
        elem.appendChild(child);
      }
    });
    return elem;
  }

  /* Remove existing modals */
  function removeExistingModals() {
    ['searchModal', 'resultsOverlay', 'valueModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  /* Show search input modal */
  function showInputModal() {
    removeExistingModals();

    const modal = createElement('div', {
        id: 'searchModal',
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          color: '#333',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }
      });

    const modalContent = createElement('div', {
        style: {
          color: '#333',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '300px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          fontFamily: 'Arial, sans-serif',
          position: 'relative'
        }
      },
      createElement('h2', {
        style: {
          marginTop: '0',
          fontSize: '18px'
        }
      }, 'Search Window Properties'),
      createElement('label', {
        style: {
          display: 'block',
          margin: '10px 0 5px'
        }
      }, 'Search String:'),
      createElement('input', {
        type: 'text',
        required: true,
        style: {
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box'
        }
      }),
      createElement('label', {
        style: {
          display: 'block',
          margin: '10px 0 5px'
        }
      }, 'Search Type:'),
      createElement('select', {
          style: {
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box'
          }
        },
        createElement('option', {
          value: 'key'
        }, 'Key'),
        createElement('option', {
          value: 'value'
        }, 'Value'),
        createElement('option', {
          value: 'both'
        }, 'Both')
      ),
      createElement('div', {
          style: {
            marginTop: '15px',
            display: 'flex',
            gap: '10px'
          }
      },
      createElement('button', {
          type: 'button',
          style: {
            flex: 1,
            padding: '10px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          },
          onclick: () => {
            const input = modal.querySelector('input').value.trim();
            const type = modal.querySelector('select').value;
            if (input) {
              modal.remove();
              performSearch(input, type);
            }
          }
      }, 'Search'),
      createElement('button', {
          type: 'button',
          style: {
            flex: 1,
            padding: '10px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          },
          onclick: () => modal.remove()
        }, 'Cancel')
      )
    );

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  function performSearch(searchString, searchType) {
    const standardProps = new Set([
      "window", "self", "name", "customElements", "console", "parent",
      "frames", "frameElement", "history", "locationbar", "menubar",
      "personalbar", "scrollbars", "statusbar", "toolbar", "status",
      "closed", "length", "top", "opener", "external", "screen",
      "innerWidth", "innerHeight", "scrollX", "pageXOffset", "scrollY",
      "pageYOffset", "screenX", "screenY", "outerWidth", "outerHeight",
      "devicePixelRatio", "screenLeft", "screenTop", "clientInformation",
      "navigator", "crypto", "performance"
    ]);

    const matches = new Map();
    let visited = new WeakSet();
    const containsMatch = new WeakSet();

    function isExactMatch(key, value) {
      if (searchType === 'key' || searchType === 'both') {
        if (key.toLowerCase().includes(searchString.toLowerCase())) {
          return true;
        }
      }

      if (searchType === 'value' || searchType === 'both') {
        if (value === null) return 'null'.includes(searchString.toLowerCase());
        if (typeof value !== 'object' && typeof value !== 'function') {
          return String(value).toLowerCase().includes(searchString.toLowerCase());
        }
      }

      return false;
    }

    function cleanPath(path) {
      return path.replace(/^window\./, '')
        .replace(/^0\./, '')
        .replace(/^self\./, '')
        .replace(/\[\d+\]/g, '');
    }

    /* First pass: find all objects containing matches */
    function markContainers(obj, path = []) {
      if (obj === null || typeof obj !== 'object') return false;
      if (visited.has(obj)) return containsMatch.has(obj);
      visited.add(obj);

      let hasMatch = false;
      try {
        const props = Object.getOwnPropertyNames(obj);
        for (const prop of props) {
          if (standardProps.has(prop)) continue;

          try {
            const value = obj[prop];
            if (isExactMatch(prop, value)) {
              hasMatch = true;
            }
            if (value && typeof value === 'object' && !visited.has(value)) {
              if (markContainers(value, [...path, prop])) {
                hasMatch = true;
              }
            }
          } catch {}
        }
      } catch {}

      if (hasMatch) {
        containsMatch.add(obj);
      }
      return hasMatch;
    }

    /* Reset visited Set for second pass */
    markContainers(window);
    visited = new WeakSet(); // Create new WeakSet instead of clearing

    /* Second pass: collect only leaf matches */
    function traverse(obj, path = []) {
      if (obj === null || typeof obj !== 'object') return;
      if (visited.has(obj)) return;
      visited.add(obj);

      try {
        const props = Object.getOwnPropertyNames(obj);
        for (const prop of props) {
          if (standardProps.has(prop)) continue;

          try {
            const value = obj[prop];
            const currentPath = [...path, prop];
            const cleanedPath = cleanPath(currentPath.join('.'));

            /* Add match only if:
               1. It's a direct match of a primitive value
               2. It's an object that matches by key but doesn't contain matching children */
            if (isExactMatch(prop, value) &&
              (typeof value !== 'object' || !containsMatch.has(value))) {
              matches.set(cleanedPath, {
                path: cleanedPath,
                key: prop,
                value: value,
                type: typeof value
              });
            }

            if (value && typeof value === 'object' && !visited.has(value)) {
              traverse(value, currentPath);
            }
          } catch {}
        }
      } catch {}
    }

    traverse(window);

    /* Sort results by path length (shortest first) */
    const sortedMatches = Array.from(matches.values())
      .sort((a, b) => a.path.split('.').length - b.path.split('.').length);

    showResults(sortedMatches);
  }

  /* Modified showResults function */
  function showResults(matches) {
    removeExistingModals();

    const overlay = createElement('div', {
      id: 'resultsOverlay',
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }
    });

    const content = createElement('div', {
      style: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '80%',
        height: '80%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }
    });

    const header = createElement('div', {
        style: {
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }
      },
      createElement('h2', {
          style: {
            margin: 0,
            fontSize: '18px'
          }
        },
        `Found ${matches.length} match${matches.length === 1 ? '' : 'es'}`
      ),
      createElement('button', {
        type: 'button',
        style: {
          padding: '5px 10px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        },
        onclick: () => overlay.remove()
      }, 'Close')
    );

    const scrollableContent = createElement('div', {
        style: {
          padding: '20px',
          overflowY: 'auto',
          flex: 1
        }
      },
      createElement('ul', {
          style: {
            listStyleType: 'none',
            padding: 0,
            margin: 0
          }
        },
        ...matches.slice(0, 100).map(match => {
          const valuePreview = match.value === null ? 'null' :
            match.type === 'function' ? 'function' :
            match.type === 'object' ? `[${match.value === null ? 'null' : 'object ' + match.value.constructor.name}]` :
            String(match.value).slice(0, 100) + (String(match.value).length > 100 ? '...' : '');

          return createElement('li', {
              style: {
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px'
              }
            },
            createElement('div', {
                style: {
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }
              },
              match.path
            ),
            createElement('div', {
              style: {
                marginBottom: '5px',
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#666'
              }
            }, valuePreview),
            createElement('button', {
              style: {
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              },
              onclick: () => showValueModal(match.path, match.value)
            }, 'View Details')
          );
        })
      ),
      matches.length > 100 ? createElement('p', {
        style: {
          marginTop: '10px',
          color: '#666'
        }
      }, `...and ${matches.length - 100} more matches`) : null
    );

    content.appendChild(header);
    content.appendChild(scrollableContent);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
  }
  /* Show value details modal */
  function showValueModal(path, value) {
    const modal = createElement('div', {
      id: 'valueModal',
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001
      }
    });

    const modalContent = createElement('div', {
      style: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        width: '80%',
        height: '80%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
      }
    });

    const header = createElement('div', {
        style: {
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },
      createElement('h3', {
          style: {
            margin: 0,
            fontSize: '16px'
          }
        },
        `Value of "${path}"`
      ),
      createElement('button', {
        type: 'button',
        style: {
          padding: '5px 10px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        },
        onclick: () => modal.remove()
      }, 'Close')
    );

    const content = createElement('pre', {
      style: {
        margin: 0,
        padding: '20px',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        flex: 1,
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
      }
    }, (() => {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    })());

    modalContent.appendChild(header);
    modalContent.appendChild(content);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }

  /* Initialize */
  showInputModal();
})();
