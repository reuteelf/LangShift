import { createRoundedButton } from "../util/createRoundedButton";
import menuIcon from "/images/menu.svg";
import closeIcon from "/images/close.svg";
import Icon from "/icon.png";

export function setupHeader(header, options) {
  let isOptVisible = true;

  header.innerHTML = `
      <img src="${Icon}" class="h-8 w-8 p-1 rounded bg-black mr-2"> 
      <h1 class="text-base font-semibold mr-auto">LangShift</h1>
    `;
  header.classList.add(
    "w-full",
    "min-h-11",
    "h-11",
    "flex",
    "flex-row",
    "items-center",
    "px-4",
    "bg-white",
    "border-b-2",
    "select-none"
  );

  const button = createRoundedButton(
    isOptVisible ? closeIcon : menuIcon,
    isOptVisible ? "Close options" : "Open options"
  );
  options.classList.add(isOptVisible ? "flex" : "hidden");
  button.addEventListener("click", () => {
    isOptVisible = !isOptVisible;
    button.title = isOptVisible ? "Close options" : "Open options";
    const img = button.querySelector("img");
    img.src = isOptVisible ? closeIcon : menuIcon;
    options.classList.toggle("flex", isOptVisible);
    options.classList.toggle("hidden", !isOptVisible);
  });
  header.appendChild(button);
}
