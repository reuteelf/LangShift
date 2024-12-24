// status.js

import store from "../util/store";

const status = document.querySelector("#status");

store.subscribe("status", () => {
  const s = store.getState("status");
  if (s === "idle") {
    status.innerText = "idle";
    status.className =
      "bg-gray-200 text-xs font-medium text-gray-800 text-center p-1 leading-none rounded-full px-2 h-max";
  } else if (s === "running") {
    status.innerText = "running";
    status.className =
      "bg-blue-200 text-xs font-medium text-blue-800 text-center p-1 leading-none rounded-full px-2 h-max";
  } else if (s === "error") {
    status.innerText = "error";
    status.className =
      "bg-red-200 text-xs font-medium text-red-800 text-center p-1 leading-none rounded-full px-2 h-max";
  }
});
