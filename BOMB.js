import { initCSSVars, initEventListeners, initScores, initData,
  initEls
} from "./init.js";
// let updateNeeded = true;

document.addEventListener('DOMContentLoaded', async function () {
  initCSSVars();

  await initData();
  
  initEls();

  initEventListeners();
  initScores();
  
});
