console.log("Sandbox script loaded");

// Variables
const { createWorker } = Tesseract;
let worker;
let workerSet = false;

// Message Handling
window.addEventListener("message", async (event) => {
  const { type } = event.data;
  switch (type) {
    case "set-language":
      {
        const lang = event.data.data.lang;

        if (workerSet) await worker.terminate();

        worker = await createWorker(lang);

        workerSet = true;
        event.source.postMessage({ type: "language-set" }, event.origin);
      }
      break;
    case "language-set":
      break;
    case "run-OCR":
      {
        const img = await processImage(event);
        const data = await runOCR(img, event.data.data.rectangle);
        event.source.postMessage({ type: "OCR-done", data }, event.origin);
      }
      break;
    default:
      break;
  }
});

// Get image
function processImage(event) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = event.data.data.imageUrl;
  });
}

// Run OCR and send back result
async function runOCR(img, rectangle) {
  const results = await worker.recognize(img, { rectangle });
  return { text: results.data.text, confidence: results.data.confidence };
}
