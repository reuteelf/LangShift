// dropdown.js

import { list } from "../util/data";
import store from "../util/store";

const dropdowns = document.querySelector("#dropdowns");

const [sourceDropdown, sourceButton, sourceWrapper] = createDropdown("source");
sourceButton.addEventListener("click", () => {
  toggleDropdowns(sourceWrapper);
});
const [targetDropdown, targetButton, targetWrapper] = createDropdown("target");
targetButton.addEventListener("click", () => {
  toggleDropdowns(targetWrapper);
});
const sourceLabel = createLabel("Source language", sourceDropdown);
const targetLabel = createLabel("Target language", targetDropdown);

dropdowns.appendChild(sourceLabel);
dropdowns.appendChild(targetLabel);

function createDropdown(name) {
  const container = document.createElement("div");
  container.className = "relative flex flex-col mt-2 text-base";

  const button = createButton(name);
  const wrapper = createWrapper(name, button);

  container.appendChild(button);
  container.appendChild(wrapper);
  return [container, button, wrapper];
}

function createButton(name) {
  const button = document.createElement("button");
  button.className =
    "flex flex-row items-center border rounded-lg p-2  bg-white hover:bg-gray-100 cursor-pointer select-none ";
  button.innerHTML = `
    Select ${name} language 
    <i class="bi bi-chevron-expand text-xl ml-auto"></i>
  `;
  return button;
}

function createWrapper(name, button) {
  const wrapper = document.createElement("div");
  wrapper.className =
    "absolute top-12 z-10 hidden flex-col p-2 border shadow rounded-lg h-48 w-full overflow-auto bg-white select-none";

  list.forEach((element, index) => {
    const label = createRadio(element, index, name, button, wrapper);
    wrapper.appendChild(label);
  });

  return wrapper;
}

function createRadio(element, index, name, button, wrapper) {
  const label = document.createElement("label");
  label.className =
    "flex items-center w-full p-2 rounded has-[:checked]:bg-blue-100 hover:bg-gray-100 cursor-pointer";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = name;
  radio.value = index;
  radio.className = "hidden";

  radio.addEventListener("change", () => {
    button.innerHTML = `
    ${element.label} 
    <i class="bi bi-chevron-expand text-xl ml-auto"></i>
  `;
    toggleDropdowns(wrapper);
    store.setState(`${name}LanguageIndex`, index);
  });

  label.textContent = element.label;
  label.appendChild(radio);

  return label;
}

function createLabel(text, dropdown) {
  const label = document.createElement("label");
  label.innerText = text;
  label.className = "text-sm leading-none";
  label.appendChild(dropdown);
  return label;
}

function toggleDropdowns(wrapper) {
  if (wrapper === sourceWrapper) {
    targetWrapper.classList.toggle("hidden", true);
    targetWrapper.classList.toggle("flex", false);
    if (wrapper.classList.contains("hidden")) {
      wrapper.classList.toggle("hidden", false);
      wrapper.classList.toggle("flex", true);
    } else {
      wrapper.classList.toggle("hidden", true);
      wrapper.classList.toggle("flex", false);
    }
  } else {
    sourceWrapper.classList.toggle("hidden", true);
    sourceWrapper.classList.toggle("flex", false);
    if (wrapper.classList.contains("hidden")) {
      wrapper.classList.toggle("hidden", false);
      wrapper.classList.toggle("flex", true);
    } else {
      wrapper.classList.toggle("hidden", true);
      wrapper.classList.toggle("flex", false);
    }
  }
}
export function resetDropdowns() {
  const sourceRadios = sourceWrapper.querySelectorAll('input[type="radio"]');
  sourceRadios.forEach((radio) => {
    radio.checked = false;
  });
  sourceButton.innerHTML = `Select source language <i class="bi bi-chevron-expand text-xl ml-auto"></i>`;

  const targetRadios = targetWrapper.querySelectorAll('input[type="radio"]');
  targetRadios.forEach((radio) => {
    radio.checked = false;
  });
  targetButton.innerHTML = `Select target language <i class="bi bi-chevron-expand text-xl ml-auto"></i>`;

  sourceWrapper.classList.toggle("hidden", true);
  sourceWrapper.classList.toggle("flex", false);
  targetWrapper.classList.toggle("hidden", true);
  targetWrapper.classList.toggle("flex", false);
}
