import {GAME_STATES} from './config.js';
import {ELS} from "./ELS.js";
import { gameState, endGame, startRound, 
  startGame, submitGuess, setRunnerColor,
  } from "./game_logic.js";
import { stopTimer } from "./timer.js";
import { toggleAllBoxes, makeScriptureLink} from "./helper_functions.js";
import {} from "./data_manager.js";
import {populateIncludeExcludeOptions, populateGuessOptions, 
  updateScoreboard, hideGameOver, updateLBDisplayDifficulty,
  updateLBTableRows, updateLBDisplayBook, showScreen,
  updateBbucksDisplay, refreshStore
} from "./ui_manager.js";
import {loadScriptureData, getBomBucks, addBomBucks} from "./data_manager.js";
import {STORE_DEFS, unlockStoreItem, isStoreItemUnlocked} from "./store.js";

// Event Listener Functions (Will be exported or regrouped soon I think)
export function handleThreshValueChange(){
  let difEl = ELS.SET.DROPS.difEl;
  gameState.settings.thresholdSetting = difEl.value;
  gameState.settings.difficulty = difEl.value;
}

export function handleRevealReference(){
  const refEl = ELS.GAME.TXT.refReveal;
  //refEl.hidden = false;
  
  if (!refEl.textContent && gameState.currentSelection) {
    let cs = gameState.currentSelection;
    const url = makeScriptureLink(gameState.settings.currentVolume, cs);
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = cs.reference;
    refEl.appendChild(link);
  }
}

export function handleNewRound(){
  startRound();
}

export function handleLeaderboardButton(){
  showNongameScreen(GAME_STATES.LEADERBOARD);
}

export function handleFinalizeGuess(){
  submitGuess();
  stopTimer();
}

export function handleSettingsButton(){
  showNongameScreen(GAME_STATES.SETTINGS);
}

export function handleCheckAllInex(){
  let inEx = ELS.SET.DROPS.inEx;
  toggleAllBoxes(inEx, true);
  populateIncludeExcludeOptions();
}

export function handleUncheckAllInex(){
  let inEx = ELS.SET.DROPS.inEx;
  toggleAllBoxes(inEx, false);
  gameState.includedBooks.clear();
}

export function handleMainMenuButton(){
  showNongameScreen(GAME_STATES.MENU); 
}

export function handleAchPageButton(){
  showNongameScreen(GAME_STATES.ACHIEVEMENTS); 
}

export function handleStorePageButton(){
  showNongameScreen(GAME_STATES.STORE); 
}

/** 
 * Takes a screen and displays it after ending the game if necessary.
 * 
 * I made this to reduce code duplication, because there are a lot of
 * buttons that need to conditionally end the game before changing the
 * currently displayed screen 
 */
function showNongameScreen(targetScreen){
  if(gameState.inRound){
    endGame();
  }
  showScreen(targetScreen);
}

export async function handleVSelectChange(){
  gameState.settings.currentVolume = ELS.vSelect.value;
  gameState.settings.lbVolume = ELS.vSelect.value;
  await loadScriptureData();
  populateGuessOptions();
  populateIncludeExcludeOptions();
}

export function handleBookSelectChange(){
  const book = ELS.GAME.DROPS.bookDropdown.value;
  if(!book) return;

  const bookTrigger = ELS.GAME.DROPS.bookSelectTrigger;

  const chapSelect = ELS.GAME.DROPS.chapterSelect;

  bookTrigger.innerHTML = book;
  ELS.GAME.DROPS.chapterSelect.innerHTML = '';

    const chapters = Object.keys(
      gameState.scriptures[book]
    );

    chapters.forEach(chapter => {
      const chapOption = document.createElement('div');
      chapOption.classList.add('custom-option');
      chapOption.textContent = chapter;
      chapOption.dataset.value = chapter;
      chapSelect.appendChild(chapOption);
    }); 

  ELS.GAME.DROPS.chapterDropdown.value = "1";   
}

export function handleChapterSelectChange(){
  const chapNumber = ELS.GAME.DROPS.chapterDropdown.value;
  if(!chapNumber) return;

  const chapDropTrigger = ELS.GAME.DROPS.chapterSelectTrigger;

  chapDropTrigger.innerHTML = chapNumber;

  // Enable submit button when both selections are made
  ELS.GAME.BTNS.submit.disabled = !(ELS.GAME.DROPS.bookDropdown.value && ELS.GAME.DROPS.chapterDropdown.value);
}

export function hideGOOverlay(){
  hideGameOver();
}

// Button handlers

export function handleRestartButton(){
  if(gameState.inRound) {
    endGame();
  }
  startGame();
}

export function handleStartButton(){
  startGame();
}

export function handleGORestartButton(){
  hideGameOver();
  startGame();
}

export function handleGOButton(){
  hideGameOver();
}

export function handleLBDiffButton(event){
  const button = event.currentTarget;
  const diff = button.dataset.diff;
  gameState.settings.lbDifficulty = diff;
  updateLBDisplayDifficulty();
  updateLBTableRows();
}

export function handleLBBookButton(event){
  const button = event.currentTarget;
  const diff = button.dataset.diff;
  gameState.settings.lbBook = diff;
  updateLBDisplayBook();
  updateLBTableRows();
}

/*                  
 *                  *
 *  Store buttons   *
 *                  *
 */

// Team color Buy/Select buttons
export function handleStoreTeamColorButton(event){
  const button = event.currentTarget;
  const color = button.value;

  const section = button.closest('.store-section');
  const allColorButtons = section.querySelectorAll(
    '.buy-button'
  );

  const cost = button.dataset.cost;

  const lockedIndicator = button.querySelector('.locked-indicator');
  const isLocked = !(lockedIndicator.classList.contains('hidden'));

  if(isLocked){
    if(getBomBucks() >= cost){

      addBomBucks(-cost);
      updateBbucksDisplay();

      unlockStoreItem(color);
      refreshStore();
    } else {
      console.log("Sorry, not enough BomBucks. Get back to studying!");
      return;
    }
  } else {
    allColorButtons.forEach((currButton) => {
        const sIndicator = currButton.querySelector('.selected-indicator');
        if(currButton !== button){
          sIndicator.classList.add('hidden');
        } else {
          sIndicator.classList.remove('hidden');
        }
      });

      setRunnerColor(color);
  }
}