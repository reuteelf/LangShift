// main.js

import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import store from "./util/store";
import "./components/status";
import "./components/menuBtn";
import "./components/dropdown";
import "./util/handler";
import "./util/translate";

// initialisation
store.setState("status", "idle");
store.setState("activeTab", null);
store.setState("sourceLanguageIndex", null);
store.setState("targetLanguageIndex", null);
store.setState("TranslatorReady", false);
store.setState("OCRReady", false);
store.setState("dimensions", null);
store.setState("text", null);
