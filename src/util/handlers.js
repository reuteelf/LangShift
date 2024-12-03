// handlers.js
import { setTranslationRunning } from "../components/setupActionButtons";
import { getLanguagePair } from "../components/setupDropdowns";
import { toggleStartClearButtons } from "../components/setupStartClearButtons";
import { canTranslate, translate } from "./translate";

let activeTab = null;
let dimensions = null;

// Message handling
chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message, sender, sendResponse) {
  const { type } = message;
  switch (type) {
    case "set-selection":
      {
        activeTab = sender.tab.id;
        dimensions = message.data.dimensions;
        message = {
          type: "set-active-tab",
          data: { activeTab: activeTab },
        };
        chrome.runtime.sendMessage(message).then((response) => {
          if (response.status === "done") {
            toggleStartClearButtons(true);
            sendResponse({ status: "done" });
          }
        });
      }
      break;
    case "set-active-tab":
      break;
    case "unset-active-tab":
      break;
    case "unset-selection":
      {
        activeTab = null;
        dimensions = null;
        toggleStartClearButtons(false);
        sendResponse({ status: "done" });
      }
      break;
    default:
      break;
  }
  return true;
}

// Tab Handling
export async function getCurrentTab() {
  const queryInfo = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryInfo);
  return tabs[0];
}

export async function isActiveTab() {
  if (!activeTab) return false;
  return (await getCurrentTab().id) === activeTab;
}

export function setActiveTab(value) {
  activeTab = value;
}

export function getActiveTab(value) {
  return activeTab;
}

export function setDimensions(value) {
  dimensions = value;
}

export function getDimensions() {
  return dimensions;
}

// Window messeage event handling
window.addEventListener("message", (event) => {
  const { type } = event.data;

  switch (type) {
    case "set-language":
      break;
    case "language-set":
      {
        canTranslate(getLanguagePair());
      }
      break;
    case "run-OCR":
      break;
    case "OCR-done":
      {
        const data = event.data.data;
        if (data.confidence < 60) {
          document.getElementById("output").textContent =
            "Text is not in the input language specified, change the input language";
          setTranslationRunning(false);
        } else {
          document.getElementById("output").textContent = "Translating";
          translate(data.text);
        }
      }
      break;
    default:
      break;
  }
});
