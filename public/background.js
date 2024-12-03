// background.js

let activeTab = null;

// Message Handling
chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
  const { type } = message;
  switch (type) {
    case "set-selection":
      break;
    case "set-active-tab":
      {
        activeTab = message.data.activeTab;
        sendResponse({ status: "done" });
      }
      break;
    case "unset-active-tab":
      {
        activeTab = null;
        sendResponse({ status: "done" });
      }
      break;
    case "unset-selection":
      break;
    default:
      break;
  }
  return true;
}

// Open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Open side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Handle tab update
chrome.tabs.onUpdated.addListener((tabId) => {
  handleActiveTabRemoval(tabId);
});

// Handle tab remove
chrome.tabs.onRemoved.addListener((tabId) => {
  handleActiveTabRemoval(tabId);
});

// Handle tab detach
chrome.tabs.onDetached.addListener((tabId) => {
  handleActiveTabRemoval(tabId);
  if (!activeTab || activeTab !== tabId) return;
  const details = {
    target: { tabId },
    func: () => {
      return clear();
    },
  };
  chrome.scripting.executeScript(details);
});

function handleActiveTabRemoval(tabId) {
  if (!activeTab || activeTab !== tabId) return;
  const message = { type: "unset-selection", data: null };
  chrome.runtime.sendMessage(message).then((response) => {
    if (response.status === "done") activeTab = null;
  });
}
