// content.js

class Selection {
  constructor() {
    this.box = null;
    this.block = null;
    this.isMouseDown = false;
    this.startX = 0;
    this.startY = 0;
  }

  enable() {
    this.box = document.createElement("div");
    this.block = document.createElement("div");
    this.box.classList.add("selection-overlay");
    this.block.classList.add("block-overlay");
    document.body.appendChild(this.block);
    document.body.style.cursor = "crosshair";
    this.add();
  }

  clear() {
    if (this.block !== null) {
      this.block.remove();
      this.block = null;
    }
    if (this.box !== null) {
      this.box.remove();
      this.box = null;
    }
    this.startX = 0;
    this.startY = 0;
    this.isMouseDown = false;
    document.body.style.cursor = "default";
    this.remove();
  }

  start(event) {
    document.body.appendChild(this.box);
    this.isMouseDown = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.update(event);
  }

  update(event) {
    if (this.isMouseDown === false) return;

    const maxWidth = document.body.clientWidth;
    const maxHeight = window.innerHeight;

    const currentX = Math.min(Math.max(event.clientX, 0), maxWidth); // Within document width
    const currentY = Math.min(Math.max(event.clientY, 0), maxHeight); // Within window height

    const left = Math.min(this.startX, currentX);
    const top = Math.min(this.startY, currentY);
    const width = Math.abs(currentX - this.startX);
    const height = Math.abs(currentY - this.startY);

    Object.assign(this.box.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
    });
  }

  stop() {
    if (this.isMouseDown === false) return;
    this.isMouseDown = false;
    document.body.style.cursor = "default";

    if (this.box !== null) {
      this.box.style.backgroundColor = "transparent";
      this.box.style.outline = "10px solid #007aff40";
    }
    this.remove();
    this.block.remove();
    this.block = null;
    const dimensions = this.getDimensions();
    const message = { type: "selection-end", target: "handler", dimensions };
    chrome.runtime.sendMessage(message).then((response) => {
      if (response.success === false) this.clear();
    });
  }

  getDimensions() {
    if (this.box === null) return null;

    const scale = window.devicePixelRatio;
    return {
      left: this.box.offsetLeft * scale,
      top: this.box.offsetTop * scale,
      width: this.box.offsetWidth * scale,
      height: this.box.offsetHeight * scale,
    };
  }

  add() {
    document.addEventListener("mousedown", this.start.bind(this));
    document.addEventListener("mousemove", this.update.bind(this));
    document.addEventListener("mouseup", this.stop.bind(this));
  }

  remove() {
    document.removeEventListener("mousedown", this.start.bind(this));
    document.removeEventListener("mousemove", this.update.bind(this));
    document.removeEventListener("mouseup", this.stop.bind(this));
  }
}

const selection = new Selection();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, target } = message;
  if (target === "content-script") {
    switch (type) {
      case "enable-selection":
        {
          try {
            selection.enable();
            sendResponse({ success: true });
          } catch (error) {
            sendResponse({ success: false });
          }
        }
        break;
      case "clear-selection":
        {
          try {
            selection.clear();
            sendResponse({ success: true });
          } catch {
            sendResponse({ success: false });
          }
        }
        break;
      default:
        sendResponse({ success: false });
        break;
    }
  }
  return true;
});

console.log("Selection script loaded");
