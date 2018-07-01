// Apparently required for onExited to fire at all
chrome.processes.onUpdated.addListener(function(process){});

chrome.processes.onExited.addListener (function (id, exitType, exitCode) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(t => {
      chrome.processes.getProcessIdForTab(t.id, pid => {
        if (id === pid) {
          chrome.tabs.reload(t.id);
        }
      });
    });
  });
});
