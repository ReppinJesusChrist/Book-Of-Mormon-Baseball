import {ANIMATION_TIME_MS, ELS} from "./config.js";
import {fetchScores, loadData} from "./data_manager.js";
import * as Handlers from "./event_handlers.js";
import {populateIncludeExcludeOptions, populateGuessOptions, initLBTableRows,
  updateLBDisplayDifficulty, updateLBTableRows, updateLBDisplayBook, positionBases,
} from "./ui_manager.js";


const CLICK_HANDLERS = {
  'revealDistance': Handlers.handleRevealDistance,
  'revealReference': Handlers.handleRevealReference,
  'newRound': Handlers.handleNewRound,
  'leaderboard-button': Handlers.handleLeaderboardButton,
  'finalizeGuess': Handlers.handleFinalizeGuess,
  'settings-button': Handlers.handleSettingsButton,
  'check-all-inex': Handlers.handleCheckAllInex,
  'uncheck-all-inex': Handlers.handleUncheckAllInex,
  'go-btns-tryagain': Handlers.handleGORestartButton
}

const CHANGE_HANDLERS = {
  'settings-vselect-value': Handlers.handleVSelectChange,
  'bookSelect': Handlers.handleBookSelectChange,
  'threshold-value' : Handlers.handleThreshValueChange,
}

const MULTI_HANDLERS = [
  {selector: '.GO-button', event: 'click', handler: Handlers.handleGOButton},
  {selector: '.start-button', event: 'click', handler: Handlers.handleStartButton},
  {selector: '.main-menu-button', event: 'click', handler: Handlers.handleMainMenuButton},
  {selector: '.lb-difficulty-option', event: 'click', handler: Handlers.handleLBDiffButton},
  {selector: '.restart-button', event: 'click', handler: Handlers.handleRestartButton}
];

export function initCSSVars() {
  // Set CSS variables for animation time
  document.documentElement.style.setProperty(
    '--runner-animation-time', `${ANIMATION_TIME_MS}ms`
  );
}

export function initEventListeners(){
  for(const [id, handler] of Object.entries(CLICK_HANDLERS)){
    document.getElementById(id).addEventListener('click', handler);
  }

  for(const [id, handler] of Object.entries(CHANGE_HANDLERS)){
    document.getElementById(id).addEventListener('change', handler);
  }

  for(const {selector, event, handler} of MULTI_HANDLERS) {
    document.querySelectorAll(selector).forEach(el => 
      el.addEventListener(event, handler)
    );
  }

  ELS.toggle.addEventListener('click', (e)=>{
    e.stopPropagation(); // Study this further to understand
    ELS.dropdown.classList.toggle('open');
  });
}

export function initScores(){
  let scores = fetchScores();
  if(!scores){
    const initial = {};
    for(const bookName in BOOK_NAMES){
      initial[bookName] = {};
      for(const difficultyName in DIFFICULTY_NAMES){
      initial[bookName][difficultyName] = [];
      }
    }
    scores = JSON.stringify(initial);
    localStorage.setItem("topScores", scores);
  };
}

export async function initData(){
    await loadData();
}

export async function initEls(){
  updateLBDisplayDifficulty();
  updateLBDisplayBook();

  initLBTableRows();
  updateLBTableRows();

  populateGuessOptions();
  populateIncludeExcludeOptions();

  positionBases();
}