// translate.js

import { list } from "./data";
import store from "./store";
import showToast from "../components/toast";
import { resetDropdowns } from "../components/dropdown";

let translator = null;
let languagePair = null;
let abortController = null;

// Add source language to language pair
store.subscribe("sourceLanguageIndex", () => {
  const index = store.getState("sourceLanguageIndex");

  if (index === null) {
    languagePair = null;
    translator = null;
    store.setState("TranslatorReady", false);
  } else {
    languagePair = languagePair || {};
    languagePair.sourceLanguage = list[index].value1;
  }
});

// Add target language to language pair and if OCR worker ready check
// if translator can translate
store.subscribe("targetLanguageIndex", () => {
  const index = store.getState("targetLanguageIndex");

  if (index === null) {
    languagePair = null;
    translator = null;
    store.setState("TranslatorReady", false);
  } else {
    languagePair = languagePair || {};
    languagePair.targetLanguage = list[index].value1;

    const ready = store.getState("OCRReady");
    if (ready === false) return;

    store.setState("status", "running");
    try {
      initTranslator();
    } catch (error) {
      showToast(error.message, "error");
      store.setState("status", "error");
    }
  }
});

// Check if translator can translate when OCR ready
store.subscribe("OCRReady", () => {
  const ready = store.getState("OCRReady");
  if (ready === false) return;

  const index = store.getState("targetLanguageIndex");
  if (index === null) return;

  store.setState("status", "running");
  try {
    initTranslator();
  } catch (error) {
    showToast(error.message, "error");
    store.setState("status", "error");
  }
});

// Perform translation when text is available
store.subscribe("text", () => {
  const text = store.getState("text");
  if (text === null) return;

  const ready = store.getState("TranslatorReady");
  if (ready === null) return;

  store.setState("status", "running");
  store.setState("status", "running");
  try {
    console.log(text);
    runTranslation(text);
  } catch (error) {
    showToast(error.message, "error");
    store.setState("status", "error");
  }
});

// Inititalize translator worker
async function initTranslator() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  store.setState("TranslatorReady", false);
  store.setState("status", "running");
  abortController = new AbortController();

  if (translator) {
    await translator.destroy();
    translator = null;
  }

  try {
    translator = await createTranslatorInstance(abortController.signal);

    abortController = null;
    store.setState("status", "idle");

    if (translator !== null) {
      showToast("Translator worker initialized.");
      store.setState("TranslatorReady", true);
    }
  } catch (error) {
    abortController = null;
    throw new Error(error.message);
  }
}

async function createTranslatorInstance(abortSignal) {
  try {
    abortSignal.addEventListener("abort", () => {
      return null;
    });

    const canTranslate = await translation.canTranslate(languagePair);

    if (canTranslate !== "no") {
      if (canTranslate === "readily") {
        const translatorInstance = await translation.createTranslator(
          languagePair
        );
        return translatorInstance;
      } else {
        // The translator can be used after the model download.
        const translatorInstance = await translation.createTranslator(
          languagePair
        );
        showToast("Downloading");
        await translatorInstance.ready;
        return translatorInstance;
      }
    } else {
      showToast(
        "Cannot translate " +
          list[store.getState("sourceLanguageIndex")].label +
          " to " +
          list[store.getState("targetLanguageIndex")].label,
        "error"
      );
      store.setState("sourceLanguageIndex", null);
      store.setState("targetLanguageIndex", null);
      resetDropdowns();
      return null;
    }
  } catch (error) {
    throw new Error("Translator initialization failed");
  }
}

// Run the translation process
async function runTranslation(text) {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  store.setState("status", "running");
  abortController = new AbortController();

  try {
    const translation = await TRANSLATE(text, abortController.signal);
    store.setState("status", "idle");
    const output = document.querySelector("#outputPad").childNodes[3];
    if (translation !== null) output.textContent = translation;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Translate text
async function TRANSLATE(text, abortSignal) {
  try {
    abortSignal.addEventListener("abort", () => {
      return null;
    });

    const translation = await translator.translate(text);
    return translation;
  } catch (error) {
    throw new Error("Translation failed");
  }
}
