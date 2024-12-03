import { createDropdown } from "../util/createDropdown";
import { canTranslate } from "../util/translate";

let inputLanguage = 0;
let outputLanguage = 0;

export function setupDropdowns(container) {
  let div = document.createElement("div");
  let span = document.createElement("span");
  let dropdown = createDropdown(list, "inputLanguage", setInputLanguage);
  div.classList.add("flex", "flex-row", "items-center", "mb-2");
  span.classList.add("w-32", "text-sm", "font-semibold");
  dropdown.classList.add("flex-1");
  span.textContent = "Input Language";
  div.appendChild(span);
  div.appendChild(dropdown);
  container.appendChild(div);

  div = document.createElement("div");
  span = document.createElement("span");
  dropdown = createDropdown(list, "outputLanguage", setOutputLanguage);
  div.classList.add("flex", "flex-row", "items-center");
  span.classList.add("w-32", "text-sm", "font-semibold");
  dropdown.classList.add("flex-1");
  span.textContent = "Output Language";
  div.appendChild(span);
  div.appendChild(dropdown);
  container.appendChild(div);

  function setInputLanguage(value) {
    inputLanguage = value;
    const sandbox = document.getElementById("sandbox");
    const message = {
      type: "set-language",
      data: { lang: list[inputLanguage].value2 },
    };
    sandbox.contentWindow.postMessage(message, "*");
  }
  function setOutputLanguage(value) {
    outputLanguage = value;
    canTranslate(getLanguagePair());
  }
}

let list = [
  { label: "English", value1: "en", value2: "eng" },
  { label: "Japanese", value1: "ja", value2: "jpn" },
  { label: "Korean", value1: "ko", value2: "kor" },
  { label: "Mandarin", value1: "zh", value2: "chi_sim" },
  { label: "Taiwanese Mandarin", value1: "zh-Hant", value2: "chi_tra" },
  { label: "Portugese", value1: "pt", value2: "por" },
  { label: "Russian", value1: "ru", value2: "rus" },
  { label: "Spanish", value1: "es", value2: "spa" },
  { label: "Turkish", value1: "tr", value2: "tur" },
  { label: "Hindi", value1: "hi", value2: "hin" },
  { label: "Vietnamese", value1: "vi", value2: "vie" },
  { label: "Bengali", value1: "bn", value2: "ben" },
];

export function getLanguagePair() {
  return {
    sourceLanguage: list[inputLanguage].value1,
    targetLanguage: list[outputLanguage].value1,
  };
}
