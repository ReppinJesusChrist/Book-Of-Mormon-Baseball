import {ELS, GAME_STATES, } from './config.js'
import { gameState, endGame, startRound, 
  startGame, advanceRunners, submitGuess,
  } from "./game_logic.js";
import { stopTimer } from "./timer.js";
import { toggleAllBoxes, makeScriptureLink} from "./helper_functions.js";
import {} from "./data_manager.js";
import {populateIncludeExcludeOptions, populateGuessOptions, updateScoreboard,
  hideGameOver, updateLBDisplayDifficulty,
  updateLBTableRows, updateLBDisplayBook, showScreen,
} from "./ui_manager.js";
import {loadData} from "./data_manager.js";

// Event Listener Functions (Will be exported or regrouped soon I think)
export function handleThreshValueChange(){
  let difEl = ELS.SET.DROPS.difEl;
  gameState.settings.thresholdSetting = difEl.value;
  gameState.settings.difficulty = difEl.value;
}

export function handleRevealDistance(){
  const refEl = ELS.GAME.distanceReveal;

  ELS.GAME.BTNS.revealReference.disabled = false;
  // SIMPLE REVEAL: just show once
  if (!refEl.textContent && gameState.currGuessDistance != Infinity) {
    if(gameState.currGuessDistance === 0) refEl.textContent = `(Exactly Correct! Great Job!)`;
    refEl.textContent = `(Off by ${gameState.currGuessDistance} chapters)`;
  }
}

export function handleRevealReference(){
  const refEl = ELS.GAME.referenceReveal;
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
  if(gameState.inRound) {
    endGame();
  }
  showScreen(GAME_STATES.LEADERBOARD);
}

export function handleFinalizeGuess(){
  submitGuess();
  stopTimer();
}

export function handleSettingsButton(){
  if(gameState.inRound) {
    endGame();
  }
  showScreen(GAME_STATES.SETTINGS);
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
  if(gameState.inRound){
    endGame();
  }
  showScreen(GAME_STATES.MENU); 
}

export async function handleVSelectChange(){
  gameState.settings.currentVolume = ELS.vSelect.value;
  await loadData();
  populateGuessOptions();
  populateIncludeExcludeOptions();
}

export function handleBookSelectChange(){
  ELS.chapterSelect.innerHTML = ''; // Clear previous options
    const chapters = Object.keys(gameState.scriptures[ELS.bookSelect.value]);
    chapters.forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter;
      option.textContent = chapter;
      ELS.chapterSelect.appendChild(option);
    });

    // Enable submit button when both selections are made
    ELS.GAME.BTNS.submit.disabled = !(ELS.bookSelect.value && ELS.chapterSelect.value);
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