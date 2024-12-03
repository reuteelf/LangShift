import { setupHeader } from "./components/setupHeader";
import { setupOptions } from "./components/setupOptions";
import "./style.css";
import "./util/handlers";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="max-w-sm w-full max-h-screen flex flex-col bg-zinc-100 border-2">
  
    <div></div>

    <div></div>

    <div class="flex-1 m-2 p-4 bg-white border border-zinc-200 shadow rounded-lg"> 
      <h1 class="text-base font-semibold mb-2">Output Pad</h1>
      <p id="output" class="text-base break words overscroll-contain">
      </p>
    </div>
    
    <div class="h-5 flex items-center justify-end">
      <p class="text-xs text-zinc-700 mr-4">&copy; 2024 LangShift</p>
    </div>

  </div>
`;

app.classList.add("w-full", "h-dvh", "flex", "justify-center");
const header = app.querySelector("div").childNodes[1];
const options = app.querySelector("div").childNodes[3];
setupHeader(header, options);

const sandbox = document.getElementById("sandbox");
sandbox.onload = () => {
  setupOptions(options);
};
