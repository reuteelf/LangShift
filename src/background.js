// background.js

let activeTab = null;

// Opens sidepanel
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("http://") || tab.url.startsWith("https://"))
    chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listens for messages from handler and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, target } = message;
  if (target === "background") {
    switch (type) {
      case "enable-selection":
        handleEnableSelection(sendResponse);
        break;

      case "clear-selection":
        handleClearSelection(sendResponse);
        break;

      case "screenshot":
        handleScreenshot(sendResponse);
        break;

      default:
        sendResponse({ success: false });
        break;
    }
  }
  return true;
});

// Fetches the current tab
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/*
  promise.then(
    ()=>{on resolve},
    ()=> {on reject}
  )
*/
function handleEnableSelection(callback) {
  getCurrentTab().then((tab) => {
    if (tab === null) {
      callback({ success: false });
      return;
    }

    const message = { type: "enable-selection", target: "content-script" };

    chrome.tabs.sendMessage(tab.id, message).then(
      (response) => {
        const { success } = response;
        if (success === true) {
          activeTab = tab.id;
          callback({ success: true, activeTab });
        } else {
          callback({ success: false });
        }
      },

      () => {
        callback({ success: false });
      }
    );
  });
}

function handleClearSelection(callback) {
  if (activeTab === null) {
    callback({ success: false });
    return;
  }

  const message = { type: "clear-selection", target: "content-script" };

  chrome.tabs.sendMessage(activeTab, message).then(
    (response) => {
      if (response.success === true) {
        activeTab = null;
        callback({ success: true });
      } else {
        callback({ success: false });
      }
    },

    () => {
      callback({ success: false });
    }
  );
}

function handleScreenshot(callback) {
  getCurrentTab().then((tab) => {
    if (tab.id !== activeTab) {
      callback({ success: false, note: "not-current-tab" });
    } else {
      try {
        chrome.tabs
          .captureVisibleTab(null, {
            format: "png",
          })
          .then((imageUrl) => {
            callback({ success: true, imageUrl });
          });
      } catch (error) {
        sendResponse({ success: false });
      }
    }
  });
}

// If tab with selection is removed
chrome.tabs.onUpdated.addListener((tabId) => {
  activeTabRemoval(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabRemoval(tabId);
});

function activeTabRemoval(tabId) {
  if (activeTab !== tabId) return;
  const message = { type: "active-tab-removed", target: "handler" };
  chrome.runtime.sendMessage(message).then(
    (response) => {
      if (response.success === true) activeTab = null;
      else console.log("Error: ", response.error);
    },
    (reason) => {
      console.log("Error: ", reason);
    }
  );
}
