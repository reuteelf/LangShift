// handler.js

import { resetDropdowns } from "../components/dropdown";
import showToast from "../components/toast";
import { list } from "./data";
import store from "./store";

// Listens for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, target } = message;

  if (target === "handler") {
    switch (type) {
      case "active-tab-removed":
        {
          store.resetState();
          store.setState("status", "idle");
          store.setState("activeTab", null);
          store.setState("sourceLanguageIndex", null);
          store.setState("targetLanguageIndex", null);
          store.setState("TranslatorReady", false);
          store.setState("OCRReady", false);
          store.setState("dimensions", null);
          store.setState("text", null);
          resetDropdowns();
          sendResponse({ success: true });
        }
        break;

      case "selection-end":
        {
          const { dimensions } = message;
          store.setState("dimensions", dimensions);
          sendResponse({ success: true });
        }
        break;

      default:
        sendResponse({ success: false });
        break;
    }
  }
  return true;
});

/*
  promise.then(
    ()=>{on resolve},
    ()=> {on reject}
  )
*/

// Select button click
document.querySelector("#selectBtn").addEventListener("click", () => {
  if (store.getState("status") === "error") {
    showToast("Reload the page and restart the runtime", "error");
    return;
  }

  if (store.getState("status") === "running") {
    showToast("A task is running");
    return;
  }

  if (store.getState("activeTab")) {
    showToast("Clear the previous selection", "error");
    return;
  }

  store.setState("status", "running");

  const message = {
    type: "enable-selection",
    target: "background",
  };

  chrome.runtime.sendMessage(message).then(
    (response) => {
      store.setState("status", "idle");

      const { success } = response;
      if (success === true) {
        const { activeTab } = response;
        store.setState("activeTab", activeTab);
        showToast("Please select the area you want to translate");
      } else {
        showToast("Not a valid webpage", "error");
      }
    },

    () => {
      showToast("An error occured", "error");
      store.setState("status", "error");
    }
  );
});

// Clear button click
document.querySelector("#clearBtn").addEventListener("click", () => {
  if (store.getState("status") === "error") {
    showToast("Reload the page and restart the runtime", "error");
    return;
  }

  if (store.getState("status") === "running") {
    showToast("A task is running");
    return;
  }

  if (store.getState("activeTab") === null) {
    showToast("Select an area", "error");
    return;
  }

  store.setState("status", "running");

  const message = {
    type: "clear-selection",
    target: "background",
  };

  chrome.runtime.sendMessage(message).then(
    (response) => {
      store.setState("status", "idle");
      store.setState("activeTab", null);
      store.setState("dimensions", null);

      const { success } = response;
      if (success === true) {
        showToast("Selection cleared.");
      } else {
        showToast("Could not find selection", "error");
      }
    },

    () => {
      showToast("An error occured", "error");
      store.setState("status", "error");
    }
  );
});

const sandbox = document.querySelector("#sandbox");

// Translate button clicked
document.querySelector("#translateBtn").addEventListener("click", () => {
  if (store.getState("status") === "error") {
    showToast("Reload the page and restart the runtime", "error");
    return;
  }

  if (store.getState("status") === "running") {
    showToast("A task is running");
    return;
  }

  if (store.getState("activeTab") === null) {
    showToast("Select an area", "error");
    return;
  }

  if (store.getState("dimensions") === null) {
    showToast("Select an area", "error");
    return;
  }

  if (store.getState("OCRReady") === false) {
    showToast("Select a source language", "error");
    return;
  }

  if (store.getState("TranslatorReady") === false) {
    showToast("Select a target language", "error");
    return;
  }

  store.setState("status", "running");
  store.setState("text", null);

  const message = { type: "screenshot", target: "background" };

  chrome.runtime.sendMessage(message).then(
    (response) => {
      const { success } = response;
      if (success === true) {
        const { imageUrl } = response;

        const message = {
          type: "run-OCR",
          target: "sandbox",
          imageUrl,
          dimensions: store.getState("dimensions"),
        };
        sandbox.contentWindow.postMessage(message, "*");
      } else {
        if (response.note === "not-current-tab") {
          showToast("Go back to the tab with selection", "error");
          store.setState("status", "idle");
        } else {
          showToast("An error occured", "error");
          store.setState("status", "error");
        }
      }
    },
    () => {
      showToast("An error occured", "error");
      store.setState("status", "error");
    }
  );
});

// Sends initialize OCR request
store.subscribe("sourceLanguageIndex", () => {
  const index = store.getState("sourceLanguageIndex");
  if (index === null) {
    store.setState("OCRReady", false);
    return;
  }

  store.setState("status", "running");
  store.setState("OCRReady", false);

  const sourceLanguage = list[index].value2;

  const message = {
    type: "init-OCR",
    target: "sandbox",
    lang: sourceLanguage,
  };
  sandbox.contentWindow.postMessage(message, "*");
});

// Listens for messages from sandbox
window.addEventListener("message", (event) => {
  const { type, target } = event.data;

  if (target === "handler") {
    switch (type) {
      case "OCR-init":
        {
          const { success } = event.data;
          if (success === true) {
            showToast("OCR worker initialized.");
            store.setState("status", "idle");
            store.setState("OCRReady", true);
          }
        }
        break;

      case "OCR-run":
        const { success } = event.data;
        if (success === true) {
          store.setState("status", "idle");
          const { result } = event.data;

          if (result.confidence > 70) {
            store.setState("text", result.text);
          } else {
            showToast("Ensure the source language is correct");
          }
        }
        break;

      case "error": {
        const { error } = event.data;
        showToast(error.message, "error");
        store.setState("status", "error");
      }
      default:
        break;
    }
  }
});
