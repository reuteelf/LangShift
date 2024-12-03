import expandCircleDownIcon from "/images/expand_circle_down.svg";
import expandCircleUpIcon from "/images/expand_circle_up.svg";
import { getTranslationRunning } from "../components/setupActionButtons";

export function createDropdown(options, name, callback) {
  const container = document.createElement("div");
  const button = document.createElement("button");
  const list = document.createElement("div");
  const downArrow = document.createElement("img");
  const upArrow = document.createElement("img");
  let isOpen = false;

  downArrow.src = expandCircleDownIcon;
  upArrow.src = expandCircleUpIcon;

  downArrow.classList.add("h-5", "w-5", "ml-auto");
  upArrow.classList.add("h-5", "w-5", "ml-auto");

  container.classList.add("w-full", "flex", "flex-col", "relative");

  button.classList.add(
    "h-8",
    "px-2",
    "flex",
    "items-center",
    "text-sm",
    "font-semibold",
    "bg-white",
    "rounded-lg",
    "border",
    "border-zinc-200",
    "shadow-sm",
    "cursor-pointer",
    "select-none",
    "hover:bg-zinc-100",
    "focus:ring-4",
    "focus:ring-blue-100"
  );

  list.classList.add(
    "absolute",
    "w-full",
    "max-h-40",
    "py-2",
    "overflow-y-auto",
    "z-10",
    "mt-10",
    "hidden",
    "flex-col",
    "bg-white",
    "bg-white",
    "rounded-lg",
    "border",
    "border-zinc-200",
    "shadow-sm",
    "select-none"
  );

  options.forEach((element, index) => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;

    radio.addEventListener("change", () => {
      isOpen = !isOpen;
      button.textContent = element.label;
      button.value = index;
      button.appendChild(isOpen ? upArrow : downArrow);
      list.classList.toggle("hidden", !isOpen);
      list.classList.toggle("flex", isOpen);
      callback(index);
    });

    radio.classList.add("hidden");

    if (index === 0) {
      radio.checked = true;
      button.textContent = element.label;
      button.value = index;
      button.appendChild(downArrow);
      callback(index);
    }

    const label = document.createElement("label");
    label.textContent = element.label;
    label.appendChild(radio);
    label.classList.add(
      "flex",
      "text-sm",
      "items-center",
      "min-h-8",
      "h-8",
      "px-2",
      "hover:bg-zinc-100",
      "has-[:checked]:bg-blue-100",
      "cursor-pointer"
    );

    list.appendChild(label);
  });

  button.addEventListener("click", () => {
    if (getTranslationRunning()) return;
    isOpen = !isOpen;
    list.classList.toggle("hidden", !isOpen);
    list.classList.toggle("flex", isOpen);
    button.textContent = button.textContent;
    button.appendChild(isOpen ? upArrow : downArrow);
  });

  container.appendChild(button);
  container.appendChild(list);

  return container;
}
