import { createRoundedButton } from "../util/createRoundedButton";
import { getDimensions, isActiveTab } from "../util/handlers";
import { setupStartClearButtons } from "./setupStartClearButtons";
import translateIcon from "/images/translate.svg";

let translationRunning = false;

export function getTranslationRunning() {
  return translationRunning;
}
export function setTranslationRunning(value) {
  translationRunning = value;
}

export function setupActionButtons(container) {
  const startClearButtonsContainer = document.createElement("span");
  container.classList.add("flex", "flex-row", "gap-2", "items-center");
  const translateButton = createRoundedButton(
    translateIcon,
    "Translate selected area"
  );
  translateButton.id = "translateButton";
  container.appendChild(startClearButtonsContainer);
  container.appendChild(translateButton);
  toggleTranslateButton(true);
  translateButton.addEventListener("click", async () => {
    if (translationRunning) return;
    if (!isActiveTab()) return;
    const imageUrl = await chrome.tabs.captureVisibleTab(null, {
      format: "png",
    });
    const message = {
      type: "run-OCR",
      data: { rectangle: getDimensions(), imageUrl },
    };
    const sandbox = document.getElementById("sandbox");
    sandbox.contentWindow.postMessage(message, "*");
    document.getElementById("output").textContent = "Processing";
    translationRunning = true;
  });
  setupStartClearButtons(startClearButtonsContainer);
}

export function toggleTranslateButton(flag) {
  const translateButton = document.getElementById("translateButton");
  translateButton.disabled = flag;
}
