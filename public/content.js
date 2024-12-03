// content.js

// Variables
let isSelecting = false;
let selectionBox = null;
let startX = 0,
  startY = 0;
let isListenerActive = false;
let block = null;

function addEventListeners() {
  document.addEventListener("mousedown", start);
  document.addEventListener("mousemove", update);
  document.addEventListener("mouseup", stop);
  isListenerActive = true;
}

function removeEventListeners() {
  document.removeEventListener("mousedown", start);
  document.removeEventListener("mousemove", update);
  document.removeEventListener("mouseup", stop);
  isListenerActive = false;
}

// Enables selection on page
function enable() {
  if (selectionBox || isListenerActive) return;
  document.body.style.cursor = "crosshair";
  block = document.createElement("div");
  block.classList.add("block");
  document.body.appendChild(block);
  addEventListeners();
}

// Clears selection on page
function clear() {
  if (selectionBox) {
    selectionBox.remove();
    selectionBox = null;
  }
  if (block) {
    block.remove();
    block = null;
  }
}

// Start selection
function start(event) {
  isSelecting = true;
  startX = event.clientX;
  startY = event.clientY;

  selectionBox = document.createElement("div");
  selectionBox.classList.add("selection-overlay");
  document.body.appendChild(selectionBox);

  update(event);
}

// Update selection
function update(event) {
  if (!isSelecting) return;

  const maxWidth = document.body.clientWidth;
  const maxHeight = window.innerHeight;

  const currentX = Math.min(Math.max(event.clientX, 0), maxWidth); // Within document width
  const currentY = Math.min(Math.max(event.clientY, 0), maxHeight); // Within window height

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  Object.assign(selectionBox.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  });
}

// Stop selction
function stop(event) {
  if (!isSelecting) return;

  isSelecting = false;
  document.body.style.cursor = "default";

  if (selectionBox) {
    selectionBox.style.backgroundColor = "transparent";
    selectionBox.style.outline = "10px solid #007aff40";
  }
  removeEventListeners();

  const rectangle = getDimensions();
  block.remove();
  block = null;

  const dimensions = getDimensions();
  const message = { type: "set-selection", data: { dimensions } };
  chrome.runtime.sendMessage(message).then((response) => {
    if (response.status !== "done") clear();
  });
}

// Return dimensions of selection
function getDimensions() {
  if (!selectionBox) return null;

  const scale = window.devicePixelRatio;
  return {
    left: selectionBox.offsetLeft * scale,
    top: selectionBox.offsetTop * scale,
    width: selectionBox.offsetWidth * scale,
    height: selectionBox.offsetHeight * scale,
  };
}
