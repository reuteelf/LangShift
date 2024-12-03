import { setupActionButtons } from "./setupActionButtons";
import { setupDropdowns } from "./setupDropdowns";

export function setupOptions(options) {
  options.innerHTML = `
    <div></div>
    <div><div>
  `;
  options.classList.add(
    "max-w-sm",
    "m-2",
    "p-4",
    "flex",
    "flex-col",
    "gap-2",
    "bg-white",
    "border",
    "border-zinc-200",
    "rounded-lg",
    "shadow",
    "select-none"
  );

  const actonButtons = options.childNodes[1];
  const dropdowns = options.childNodes[3];
  setupActionButtons(actonButtons);
  setupDropdowns(dropdowns);
}
