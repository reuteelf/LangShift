import { createRoundedButton } from "../util/createRoundedButton";
import screenshotRegionIcon from "/images/screenshot_region.svg";
import resetFocusIcon from "/images/reset_focus.svg";
import {
  getCurrentTab,
  isActiveTab,
  setActiveTab,
  setDimensions,
} from "../util/handlers";
import { getTranslationRunning } from "./setupActionButtons";

export function setupStartClearButtons(container) {
  const startButton = createRoundedButton(
    screenshotRegionIcon,
    "Start selection"
  );
  startButton.id = "startButton";
  const clearButton = createRoundedButton(resetFocusIcon, "Clear selection");
  clearButton.id = "clearButton";
  clearButton.disabled = true;
  container.classList.add(
    "p-1",
    "flex",
    "flex-row",
    "gap-2",
    "bg-zinc-100",
    "border",
    "border-zinc-200",
    "rounded-full",
    "shadow-inner"
  );
  container.appendChild(startButton);
  container.appendChild(clearButton);

  startButton.addEventListener("click", async () => {
    const tab = await getCurrentTab();
    if (!tab) return;
    const tabId = tab.id;
    const details = {
      target: { tabId },
      func: () => {
        enable();
      },
    };
    chrome.scripting.executeScript(details);
  });

  clearButton.addEventListener("click", async () => {
    const tab = await getCurrentTab();
    if (!tab) return;
    if (!isActiveTab()) return;
    if (getTranslationRunning()) return;
    const message = { type: "unset-active-tab" };
    chrome.runtime.sendMessage(message).then((response) => {
      if (response.status === "done") {
        const tabId = tab.id;
        const details = {
          target: { tabId },
          func: () => {
            return clear();
          },
        };
        chrome.scripting.executeScript(details);
        setDimensions(null);
        setActiveTab(null);
        toggleStartClearButtons(false);
      }
    });
  });
}

export function toggleStartClearButtons(flag) {
  const startButton = document.getElementById("startButton");
  const clearButton = document.getElementById("clearButton");

  startButton.disabled = flag;
  clearButton.disabled = !flag;
}
