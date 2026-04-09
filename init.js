import {ANIMATION_TIME_MS,} from "./config.js";
import {ELS} from "./ELS.js";
import {fetchScores, loadScriptureData, savePlayerData, getUserVersion, setUserVersion,
  isPlayerDataSaved, loadPlayerData, setPlayerData} from "./data_manager.js";
import * as Handlers from "./event_handlers.js";
import {populateIncludeExcludeOptions, populateGuessOptions, initLBTableRows,
  updateLBDisplayDifficulty, updateLBTableRows, updateLBDisplayBook, positionBases,
  updateBbucksDisplay, initAchievementsPage, updateAchievementsPage,
  stockStore} from "./ui_manager.js";
import {setCustomDropdownValue} from "./helper_functions.js";


const CLICK_HANDLERS = {
  'revealReference': Handlers.handleRevealReference,
  'newRound': Handlers.handleNewRound,
  'finalizeGuess': Handlers.handleFinalizeGuess,
  'check-all-inex': Handlers.handleCheckAllInex,
  'uncheck-all-inex': Handlers.handleUncheckAllInex,
  'go-btns-tryagain': Handlers.handleGORestartButton,
  'game-show-go-overlay': Handlers.handleShowGOButton,
  
}

const CHANGE_HANDLERS = {
  'settings-vselect-value': Handlers.handleVSelectChange,
  'book-dropdown': Handlers.handleBookSelectChange,
  'game-chapter-dropdown': Handlers.handleChapterSelectChange,
  'threshold-value' : Handlers.handleThreshValueChange,
}

const MULTI_HANDLERS = [
  {selector: '.GO-button', event: 'click', handler: Handlers.handleGOButton},
  {selector: '.start-button', event: 'click', handler: Handlers.handleStartButton},
  {selector: '.main-menu-button', event: 'click', handler: Handlers.handleMainMenuButton},
  {selector: '.settings-button', event: 'click', handler: Handlers.handleSettingsButton},
  {selector: '.lb-button', event: 'click', handler: Handlers.handleLeaderboardButton},
  {selector: '.lb-difficulty-option', event: 'click', handler: Handlers.handleLBDiffButton},
  {selector: '.restart-button', event: 'click', handler: Handlers.handleRestartButton},
  {selector: '.achievements-page-button', event: 'click', handler: Handlers.handleAchPageButton},
  {selector: '.store-page-button', event: 'click', handler: Handlers.handleStorePageButton},
  {selector: '.runner-color-button', event: 'click', handler: Handlers.handleStoreTeamColorButton},
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

  initAllCustomDropdowns();
}

function initAllCustomDropdowns() {
  document.querySelectorAll(".dropdown-trigger").forEach(toggler => {
    const dropdownEl = toggler.closest(".dropdown");
    attachCustomDropdown(toggler, dropdownEl);
  });

  document.addEventListener("click", (e) => {
    if(!e.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown.open").forEach(ddown => {
        ddown.classList.remove("open");
      });
    }
  });

  document.addEventListener("click", (e) => {
    const option = e.target.closest(".custom-option");
    if(!option) return;
    if(!("value" in option.dataset)) return;

    const dropdown = option.closest(".dropdown");
    setCustomDropdownValue(dropdown, option.dataset.value);
    dropdown.classList.remove("open");
  });

  document.querySelectorAll(".dropdown").forEach( ddown => {
    if(Object.getOwnPropertyDescriptor(ddown, "value")) return;

    Object.defineProperty(ddown, "value", {
      get() {
        return this.dataset.value;
      },
      set(val) {
        if(this._settingValue) return;
        setCustomDropdownValue(this, val);
      }
    });
  });
}

function attachCustomDropdown(toggleEl, dropdownEl){
  toggleEl.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".dropdown.open")
      .forEach(ddown => {
        if(ddown !== dropdownEl) ddown.classList.remove("open");
      })

    const options = dropdownEl.querySelector(".dropdown-content")
    const isOpen = dropdownEl.classList.toggle("open");

    if(isOpen && options){
      options.scrollTop = 0;
    } 
  });

  dropdownEl.addEventListener("click", (e) => {
    const option = e.target.closest(".custom-option");

    if( option && dropdownEl.classList.contains("single-select")) {
      dropdownEl.classList.remove("open");
    }
  });
}

export async function initData(){
    await loadScriptureData();
}

export async function initEls(){
  updateLBDisplayDifficulty();
  updateLBDisplayBook();
  updateBbucksDisplay();

  initLBTableRows();
  updateLBTableRows();

  savePlayerData();

  initAchievementsPage();
  updateAchievementsPage();

  stockStore();

  populateGuessOptions();
  populateIncludeExcludeOptions();

  positionBases();
}