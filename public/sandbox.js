// sandbox.js

console.log("Sandbox script loaded");

const { createWorker } = Tesseract;
let abortController = null;
const worker = await createWorker("eng", 1);

// Listens for messages from parent
window.addEventListener("message", (event) => {
  const { type, target } = event.data;

  if (target === "sandbox") {
    switch (type) {
      case "init-OCR":
        initOCR(event).catch((error) => {
          console.error(error.message);

          event.source.postMessage(
            {
              type: "error",
              target: "handler",
              error,
            },
            event.origin
          );
        });
        break;

      case "run-OCR":
        runOCR(event).catch((error) => {
          console.error(error.message);

          event.source.postMessage(
            {
              type: "error",
              target: "handler",
              error,
            },
            event.origin
          );
        });

        break;

      default:
        event.source.postMessage(
          {
            type: "error",
            target: "handler",
            error: new Error("Not a valid type"),
          },
          event.origin
        );
        break;
    }
  }
});

// Initializes OCR worker with source language
async function initOCR(event) {
  const { lang } = event.data;

  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  abortController = new AbortController();

  try {
    const aborted = await reInitOCRWorker(lang, abortController.signal);
    abortController = null;

    if (aborted === false) {
      event.source.postMessage(
        {
          type: "OCR-init",
          target: "handler",
          success: true,
        },
        event.origin
      );
    }
  } catch (error) {
    abortController = null;
    throw new Error(error.message);
  }
}

// Reinitializes OCR worker with source lang
async function reInitOCRWorker(lang, abortSignal) {
  try {
    abortSignal.addEventListener("abort", () => {
      console.log("OCR worker initialization aborted");
      return true;
    });

    await worker.reinitialize(lang, 1);
    return false;
  } catch (error) {
    throw new Error("OCR worker initialization failed");
  }
}

// Run OCR on image
async function runOCR(event) {
  const { imageUrl } = event.data;
  const { dimensions } = event.data;

  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  abortController = new AbortController();

  const img = new Image();

  img.onload = async () => {
    try {
      const result = await OCR(img, dimensions, abortController.signal);

      abortController = null;

      if (result !== null) {
        event.source.postMessage(
          {
            type: "OCR-run",
            target: "handler",
            success: true,
            result,
          },
          event.origin
        );
      }
    } catch (error) {
      abortController = null;
      throw new Error(error.message);
    }
  };

  img.src = imageUrl;
}

// Optical Character Recognition
async function OCR(img, dimensions, abortSignal) {
  try {
    abortSignal.addEventListener("abort", () => {
      return null;
    });

    const result = await worker.recognize(img, { rectangle: dimensions });
    const text = result.data.text;
    const confidence = result.data.confidence;
    return { text, confidence };
  } catch (error) {
    throw new Error("OCR processing failed");
  }
}
