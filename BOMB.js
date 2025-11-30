import { startTimer, stopTimer } from "./timer.js";
import { toggleAllBoxes, makeScriptureLink, sleep, nextFrame } from "./helper_functions.js";
import { gameState, endGame, getNextBase, initializeGame, addStrike,
  startRound, startGame, advanceRunners, spawnRunner
  } from "./game_logic.js";
import {gameData, getRandomVerses, buildVerseList} from "./data_manager.js";
import {populateIncludeExcludeOptions, populateGuessOptions, updateScoreboard,
  showGameOver, hideGameOver, initializeLBTableRows, updateLBDisplayDifficulty,
  updateLBTableRows, updateLBDisplayBook, showScreen, 
} from "./ui_manager.js";
import {loadData} from "./data_manager.js";
import {ELS, ANIMATION_TIME_MS, TIMER_DURATIONS, 
  THRESHOLD_ARRAYS, STANDARD_WORKS_FILE_NAMES, GAME_STATES, BASE_POSITIONS,
  DIFFICULTY_NAMES, BOOK_NAMES} from './config.js'

// let updateNeeded = true;
window.addStrike = addStrike;
window.advanceRunners = advanceRunners;

// Variable Initiation
let bases = [false, false, false, false]; // Tracks whether each base is occupied

document.addEventListener('DOMContentLoaded', function () {
  setupCSSVars();
  setupEventListeners();
  setupScores();
  init(); // Async and misc. initiation functions (refactor into neater groups later?)
});

function setupCSSVars() {
  // Set CSS variables for animation time
  document.documentElement.style.setProperty(
    '--runner-animation-time', `${ANIMATION_TIME_MS}ms`
  );
}
function setupEventListeners(){
  const CLICK_HANDLERS = {
    'revealDistance': handleRevealDistance,
    'revealReference': handleRevealReference,
    'newRound': handleNewRound,
    'leaderboard-button': handleLeaderboardButton,
    'finalizeGuess': handleFinalizeGuess,
    'settings-button': handleSettingsButton,
    'check-all-inex': handleCheckAllInex,
    'uncheck-all-inex': handleUncheckAllInex,
    'go-btns-tryagain': handleGORestartButton
  }
  for(const [id, handler] of Object.entries(CLICK_HANDLERS)){
    document.getElementById(id).addEventListener('click', handler);
  }

  const CHANGE_HANDLERS = {
    'settings-vselect-value': handleVSelectChange,
    'bookSelect': handleBookSelectChange,
    'threshold-value' : handleThreshValueChange,
  }
  for(const [id, handler] of Object.entries(CHANGE_HANDLERS)){
    document.getElementById(id).addEventListener('change', handler);
  }

  const MULTI_HANDLERS = [
    {selector: '.GO-button', event: 'click', handler: handleGOButton},
    {selector: '.start-button', event: 'click', handler: handleStartButton},
    {selector: '.main-menu-button', event: 'click', handler: handleMainMenuButton},
    {selector: '.lb-difficulty-option', event: 'click', handler: handleLBDiffButton},
    {selector: '.restart-button', event: 'click', handler: handleRestartButton}
  ];
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
function setupScores(){
  let scores = localStorage.getItem("topScores");
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
async function init(){
  initializeLBTableRows();
  updateLBDisplayDifficulty();
  updateLBDisplayBook();
  updateLBTableRows();

  positionBases();

  await loadData();
  populateGuessOptions();
  populateIncludeExcludeOptions();
}


function positionBases(){
  for (const [base, pos] of Object.entries(BASE_POSITIONS)) {
    if(base === "back_home") continue; // No element for this one
    const baseEl = document.getElementById(base);
    baseEl.style.position = "absolute";
    baseEl.style.left = `${pos.left}%`;
    baseEl.style.top = `${pos.top}%`;
    baseEl.style.transform = "translate(-50%, -50%) rotate(45deg)"; // Center and rotate
  }
}
function submitGuess() {
    document.getElementById('revealDistance').disabled = false;
    document.getElementById('revealReference').disabled = false;
    const bookGuess = ELS.bookSelect.value;
    const chapterGuess = ELS.chapterSelect.value;

    const resultEl = document.getElementById('result');
    document.getElementById("newRound").disabled = false;

    if (!gameState.currentSelection) {
      resultEl.textContent = "No verses loaded yet.";
      return;
    }


    const guessKey = `${bookGuess} ${chapterGuess}`;
    const answerKey = `${gameState.currentSelection.book} ${gameState.currentSelection.chapter}`;

    const guessIndex = gameState.chapterIndexMap[guessKey];
    const answerIndex = gameState.chapterIndexMap[answerKey];

    const distance = Math.abs(guessIndex - answerIndex);
    gameState.currGuessDistance = distance;

    const [homeRunThreshold, tripleThreshold, doubleThreshold, singleThreshold] = THRESHOLD_ARRAYS[gameState.settings.thresholdSetting];

    advanceRunners(distance <= homeRunThreshold ? 4 :
                   distance <= tripleThreshold ? 3 :
                   distance <= doubleThreshold ? 2 :
                   distance <= singleThreshold ? 1 : 0);

    if (distance <= homeRunThreshold){
      resultEl.textContent = `HOME RUN!!! (Within ${homeRunThreshold} chapters).`;
    } else if(distance <= tripleThreshold){
      resultEl.textContent = `TRIPLE! (Within ${tripleThreshold} chapters).`;
    } else if(distance <= doubleThreshold){
      resultEl.textContent = `Double! (Within ${doubleThreshold} chapters). `;
    } else if(distance <= singleThreshold){
      resultEl.textContent = `Single! (Within ${singleThreshold} chapters). `;
    } else {
      resultEl.textContent = `STRIKE! (Off by at least ${singleThreshold + 1} chapters). `;
      addStrike();
    }

    document.getElementById('finalizeGuess').disabled = true;
}

// Event Listener Functions (Will be exported or regrouped soon I think)
function handleThreshValueChange(){
  let difEl = document.getElementById('threshold-value');
  gameState.settings.thresholdSetting = difEl.value;
  gameState.settings.difficulty = difEl.value;
}
function handleRevealDistance(){
  const refEl = document.getElementById('distance');
    console.log('Distance reveal button clicked');
    // SIMPLE REVEAL: just show once
    if (!refEl.textContent && gameState.currGuessDistance != Infinity) {
      if(gameState.currGuessDistance === 0) refEl.textContent = `(Exactly Correct! Great Job!)`;
      refEl.textContent = `(Off by ${gameState.currGuessDistance} chapters)`;
    }
}
function handleRevealReference(){
  const refEl = document.getElementById('reference');
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
function handleNewRound(){
  startRound();
}
function handleLeaderboardButton(){
  showScreen(GAME_STATES.LEADERBOARD);
}
function handleFinalizeGuess(){
  submitGuess();
  stopTimer();
}
function handleSettingsButton(){
    showScreen(GAME_STATES.SETTINGS);
}
function handleCheckAllInex(){
  let targetDiv = document.getElementById("include-exclude-values");
  toggleAllBoxes(targetDiv, true);
  populateIncludeExcludeOptions();
}
function handleUncheckAllInex(){
  let targetDiv = document.getElementById("include-exclude-values");
  toggleAllBoxes(targetDiv, false);
  gameState.includedBooks.clear();
}
function handleMainMenuButton(){
  if(gameState.inRound){
    endGame();
  }
  showScreen(GAME_STATES.MENU); 
}
function handleVSelectChange(){
  gameState.settings.currentVolume = ELS.vSelect.value;
  loadData();
  populateGuessOptions();
  populateIncludeExcludeOptions();
}
function handleBookSelectChange(){
  ELS.chapterSelect.innerHTML = ''; // Clear previous options
    const chapters = Object.keys(gameState.scriptures[ELS.bookSelect.value]);
    chapters.forEach(chapter => {
      const option = document.createElement('option');
      option.value = chapter;
      option.textContent = chapter;
      ELS.chapterSelect.appendChild(option);
    });

    // Enable submit button when both selections are made
    document.getElementById('finalizeGuess').disabled = !(ELS.bookSelect.value && ELS.chapterSelect.value);
}
function hideGOOverlay(){
  hideGameOver();
}
function handleRestartButton(){
  if(gameState.inRound) {
    endGame();
  }
  startGame();
}
function handleStartButton(){
  startGame();
}
function handleGORestartButton(){
  hideGameOver();
  startGame();
}
function handleGOButton(){
  hideGameOver();
}
function handleLBDiffButton(event){
  const button = event.currentTarget;
  const diff = button.dataset.diff;
  gameState.settings.lbDifficulty = diff;
  updateLBDisplayDifficulty();
  updateLBTableRows();
}
function handleLBBookButton(event){
  const button = event.currentTarget;
  const diff = button.dataset.diff;
  gameState.settings.lbBook = diff;
  updateLBDisplayBook();
  updateLBTableRows();
}