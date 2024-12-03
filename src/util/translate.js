import {
  setTranslationRunning,
  toggleTranslateButton,
} from "../components/setupActionButtons";

let translator = null;
let languagePair = null;

export async function translate(text) {
  const translation = await translator.translate(text);
  setTranslationRunning(false);
  document.getElementById("output").textContent = translation;
}

export async function canTranslate(languagePair) {
  const output = document.getElementById("output");
  languagePair = languagePair;
  const canTranslate = await translation.canTranslate(languagePair);
  if (canTranslate !== "no") {
    if (canTranslate === "readily") {
      translator = await translation.createTranslator(languagePair);
      toggleTranslateButton(false);
      output.textContent = "Ready to translate";
    } else {
      translator = await translation.createTranslator(languagePair);
      translator.addEventListener("downloadprogress", (e) => {
        document.textContent = `Downloading ${e.loaded}/${e.total}`;
      });
      await translator.ready;
      toggleTranslateButton(false);
      output.textContent = "Ready to translate";
    }
  } else {
    toggleTranslateButton(true);
    output.textContent =
      "Cannot translate, change the input and output langugae";
  }
}
