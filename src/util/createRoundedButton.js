import "../style.css";

export function createRoundedButton(src, title = "") {
  const button = document.createElement("button");
  button.innerHTML = `
    <img src="${src}" class="h-6 w-6 group-disabled:opacity-50">
  `;
  button.title = title;
  button.classList.add(
    "w-9",
    "h-9",
    "flex",
    "items-center",
    "justify-center",
    "bg-white",
    "rounded-full",
    "border",
    "border-zinc-200",
    "shadow-sm",
    "cursor-pointer",
    "select-none",
    "hover:bg-zinc-100",
    "focus:ring-4",
    "focus:ring-blue-100",
    "group",
    "disabled:bg-white",
    "disabled:cursor-not-allowed"
  );
  return button;
}
