import { initCSSVars, initEventListeners, initScores, initData,
  initEls
} from "./init.js";
// let updateNeeded = true;

document.addEventListener('DOMContentLoaded', async function () {
  initCSSVars();
  initEventListeners();
  initScores();

  await initData();
    
  initEls();
});
