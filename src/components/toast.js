// toast.js

let toast = null;
let visible = false;
let timer = null;

const iconStyles = {
  default:
    "bi flex items-center justify-center h-8 w-8 min-w-8 text-xl leading-none rounded-lg mr-4",
  info: "bi-info-circle bg-blue-200 text-blue-500",
  error: "bi-exclamation-circle bg-red-200 text-red-500",
};

function showToast(message, type = "info", duration = 5000) {
  if (!toast) createToast();

  if (visible) {
    hideToast();
    clearTimeout(timer);
    timer = null;
  }

  toast.querySelector(
    "i"
  ).className = `${iconStyles["default"]} ${iconStyles[type]}`;
  toast.querySelector("span").textContent = message;
  toast.classList.toggle("hidden", false);
  toast.classList.toggle("flex", true);
  visible = true;

  timer = setTimeout(hideToast, duration);
}

function createToast() {
  toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 left-1/2 translate-x-[-50%] hidden flex-row items-center w-full max-w-xs p-2 rounded-lg shadow border bg-white select-none z-10";
  toast.innerHTML = `
    <i></i>
    <span class="text-sm font-normal text-gray-500 leading-none">working...</span>
  `;
  document.body.appendChild(toast);
}

function hideToast() {
  toast.classList.toggle("hidden", true);
  toast.classList.toggle("flex", false);
  visible = false;
}

export default showToast;
