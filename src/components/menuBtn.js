// menuBtn.js

const options = document.querySelector("#options");
const menuBtn = document.querySelector("#menuBtn");
menuBtn.addEventListener("click", () => {
  setOptions();
});

setOptions();

function setOptions() {
  options.getAttribute("data-is-open") === "true"
    ? options.setAttribute("data-is-open", "false")
    : options.setAttribute("data-is-open", "true");

  menuBtn.innerHTML =
    options.getAttribute("data-is-open") === "true"
      ? `<i class="bi bi-x text-xl leading-none"></i>`
      : `<i class="bi bi-list text-xl leading-none"></i>`;

  options.classList.toggle(
    "flex",
    options.getAttribute("data-is-open") === "true"
  );

  options.classList.toggle(
    "hidden",
    options.getAttribute("data-is-open") === "false"
  );
}
