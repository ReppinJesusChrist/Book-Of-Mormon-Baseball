import { initCSSVars, initEventListeners, initData,
  initEls
} from "./init.js";
import { checkAndFixLocalStorage } from "./data_manager.js";
import {checkVersionAndUpdate} from "./version_control.js";

document.addEventListener('DOMContentLoaded', async function () {
  initCSSVars();

  checkVersionAndUpdate();
  checkAndFixLocalStorage();

  await initData();
  
  initEls();

  initEventListeners();  
});
