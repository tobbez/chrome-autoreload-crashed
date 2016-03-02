var savedTabs = {};
function recordTabs () {
        savedTabs = {};
        chrome.tabs.query({currentWindow: true}, function(tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                        (function (tabidx) {
                        chrome.processes.getProcessIdForTab(tabs[tabidx].id, function (pid) {
                                if (pid in savedTabs) {
                                        savedTabs[pid].add(tabs[tabidx].id);
                                } else {
                                        savedTabs[pid] = new Set([tabs[tabidx].id]);
                                }
                        });
                        })(i);
                }
        });
}
chrome.tabs.onUpdated.addListener(recordTabs);
chrome.runtime.onStartup.addListener(recordTabs);
chrome.runtime.onInstalled.addListener (recordTabs);

// Apparently required for onExited to fire at all
chrome.processes.onUpdated.addListener(function(process){});

chrome.processes.onExited.addListener (function (id, exitType, exitCode) {
        console.log(JSON.stringify([id, exitType, exitCode]));
        console.log(savedTabs);
        // 4 == normal, probably
        if (exitType == 4 || !(id in savedTabs)) return;
        savedTabs[id].forEach(function (v) {
                chrome.tabs.reload(v);
        });
});
