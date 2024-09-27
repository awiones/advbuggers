/*!
 * Debugger Demo v1
 * Copyright 2024 The Awiones 
 * Licensed under GNU 3.0 (https://github.com/awiones/advbuggers/blob/main/LICENSE)
 */

(function () {
    const html = `
        <div class="debugger-container" id="debugger">
            <div class="debugger-header">
                <h2>Debugger Console</h2>
                <button id="close-btn">Close</button>
            </div>
            
            <div class="debugger-tabs">
                <button class="tab-link" data-tab="logs"><i class="icon">📜</i> Logs</button>
                <button class="tab-link" data-tab="database"><i class="icon">💾</i> Database</button>
                <button class="tab-link" data-tab="views"><i class="icon">🖥️</i> Views</button>
                <button class="tab-link" data-tab="files"><i class="icon">📂</i> Files</button>
                <button class="tab-link" data-tab="routes"><i class="icon">🛤️</i> Routes</button>
                <button class="tab-link" data-tab="events"><i class="icon">🎟️</i> Events</button>
                <button class="tab-link" data-tab="history"><i class="icon">⏳</i> History</button>
                <button class="tab-link" data-tab="vars"><i class="icon">⚙️</i> Vars</button>
                <button class="tab-link" data-tab="performance"><i class="icon">🚀</i> Performance</button>
                <button class="tab-link" data-tab="settings"><i class="icon">⚙️</i> Settings</button>
            </div>
            
            <div class="debugger-content" id="debugger-content">
                <div id="logs" class="tab-content">
                    <input type="text" id="log-search" placeholder="Search logs..." />
                    <div class="logs-list" id="logs-list">No logs yet...</div>
                </div>
                <div id="database" class="tab-content">
                    <h3>Database Viewer</h3>
                    <input type="text" id="db-search" placeholder="Search database..." />
                    <div id="db-content">No database info...</div>
                </div>
                <div id="views" class="tab-content">
                    <h3>Rendered Views</h3>
                    <div id="views-content">No views rendered yet...</div>
                </div>
                <div id="files" class="tab-content">
                    <h3>Loaded Files</h3>
                    <div id="files-content">No files loaded yet...</div>
                </div>
                <div id="routes" class="tab-content">
                    <h3>Active Routes</h3>
                    <div id="routes-content">No routes loaded yet...</div>
                </div>
                <div id="events" class="tab-content">
                    <h3>Registered Events</h3>
                    <div id="events-content">No events registered yet...</div>
                </div>
                <div id="history" class="tab-content">
                    <h3>Browser History</h3>
                    <div id="history-content">No browser history available...</div>
                </div>
                <div id="vars" class="tab-content">
                    <h3>Global Variables</h3>
                    <div id="vars-content">No variables detected...</div>
                </div>
                <div id="performance" class="tab-content">
                    <div>Page Load Time: <span id="load-time">Calculating...</span></div>
                    <div>Memory Usage: <span id="memory-usage">Calculating...</span></div>
                </div>
                <div id="settings" class="tab-content">
                    <h3>Debugger Settings</h3>
                    <label><input type="checkbox" id="log-toggle" checked> Enable Logs</label>
                    <label><input type="checkbox" id="perf-toggle" checked> Enable Performance Tracking</label>
                    <label><input type="checkbox" id="theme-toggle"> Dark Mode</label>
                </div>
            </div>
        </div>
        
        <button id="debugger-toggle" class="debugger-icon">Advanced Debugger</button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);

    // Inject CSS into the head
    const css = `
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .debugger-container {
            position: fixed;
            bottom: -100%;
            left: 0;
            right: 0;
            background-color: #e6e2d3;
            color: #1a3302;
            transition: bottom 0.4s ease;
            max-height: 50%;
            overflow-y: auto;
            border-top: 4px solid #5a5b55;
            z-index: 9999;
            font-family: 'Courier New', Courier, monospace;
        }

        .debugger-container.active {
            bottom: 0;
        }

        .debugger-header {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            background-color: #4e4d41;
            border-bottom: 2px solid #5a5b55;
            color: #f0d8a8;
        }

        .debugger-tabs {
            display: flex;
            justify-content: space-around;
            background-color: #4e4d41;
            padding: 10px 0;
        }

        .tab-link {
            color: #f0d8a8;
            background: none;
            border: none;
            padding: 5px 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .tab-link:hover, .tab-link.active {
            background-color: #8e936d;
        }

        .tab-link i {
            margin-right: 8px;
        }

        .debugger-content {
            padding: 15px;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        #log-search, #db-search {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
        }

        .logs-list, #db-content, #files-content, #routes-content, #events-content, #views-content {
            max-height: 200px;
            overflow-y: auto;
        }

        .debugger-icon {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background-color: #8e936d;
            color: #1a3302;
            border: none;
            cursor: pointer;
            border-radius: 20px;
            z-index: 10000;
            transition: background-color 0.3s;
        }

        .debugger-icon:hover {
            background-color: #5a5b55;
        }

        #close-btn {
            background: #c49f47;
            border: none;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        }

        #close-btn:hover {
            background-color: #b57c2b;
        }

        /* Error Highlighting */
        .log-entry.error {
            background-color: #ff0000;
            color: #ffffff; /* Set error message text to white */
            padding: 5px;
            margin: 5px 0;
        }

        .code-preview {
            background-color: #333;
            color: #fff;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            overflow-x: auto;
        }
    `;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // JavaScript Logic for Debugger
    const debuggerToggle = document.getElementById('debugger-toggle');
    const debuggerContainer = document.getElementById('debugger');
    const closeBtn = document.getElementById('close-btn');
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const logSearch = document.getElementById('log-search');
    const logsList = document.getElementById('logs-list');

    debuggerToggle.addEventListener('click', () => {
        debuggerContainer.classList.add('active'); 
        loadLogs();  
    });

    closeBtn.addEventListener('click', () => {
        debuggerContainer.classList.remove('active');
    });

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            tabLinks.forEach(link => link.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'logs') loadLogs();
            if (targetTab === 'performance') loadPerformance();
        });
    });

    // Real-time Log Capture
    const originalLog = console.log;
    console.log = function(...args) {
        appendLog('Log', args.join(' '));
        originalLog.apply(console, arguments);
    };

    const originalError = console.error;
    console.error = function(...args) {
        appendLog('Error', args.join(' '), true);
        originalError.apply(console, arguments);
    };

    // Append logs to the debugger
    function appendLog(type, message, isError = false) {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');
        logEntry.innerHTML = `<strong>${type}:</strong> ${message}`;
        if (isError) {
            logEntry.classList.add('error');
            logEntry.appendChild(generateCodePreview());  // Add code preview on error
        }
        logsList.appendChild(logEntry);
        logsList.scrollTop = logsList.scrollHeight;  // Auto scroll to bottom
    }

    // Generate a fake code preview (you can extend this with more realistic code)
    function generateCodePreview() {
        const codePreview = document.createElement('div');
        codePreview.classList.add('code-preview');
        codePreview.innerHTML = `
            <pre>
function example() {
    throw new Error("Something went wrong");
}
example();
            </pre>
        `;
        return codePreview;
    }

    // Logs Search Feature
    logSearch.addEventListener('input', filterLogs);

    function filterLogs(event) {
        const searchTerm = event.target.value.toLowerCase();
        document.querySelectorAll('.log-entry').forEach(entry => {
            if (entry.textContent.toLowerCase().includes(searchTerm)) {
                entry.style.display = 'block';
            } else {
                entry.style.display = 'none';
            }
        });
    }

    function loadPerformance() {
        document.getElementById('load-time').textContent = `${window.performance.timing.domComplete - window.performance.timing.navigationStart} ms`;
        if (window.performance.memory) {
            document.getElementById('memory-usage').textContent = `${Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024)} MB`;
        }
    }

    // Simulate errors for testing
    function simulateErrors() {
        console.log('Debugger started');
        setTimeout(() => {
            console.error('Sample error message');
            fetch('https://jsonplaceholder.typicode.com/todos/1');
        }, 1000);
    }
    
    simulateErrors();
})();
