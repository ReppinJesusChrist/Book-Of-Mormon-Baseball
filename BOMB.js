import { startTimer, stopTimer } from "./timer.js";
import { toggleAllBoxes, makeScriptureLink, sleep, nextFrame } from "./helper_functions.js";
import { gameState, endGame, getNextBase, initializeGame,
  /*startRound*/
  } from "./game_logic.js";
import {gameData, getRandomVerses, buildVerseList} from "./data_manager.js";
import {populateIncludeExcludeOptions, populateGuessOptions, updateScoreboard,
  showGameOver, hideGameOver, initializeLBTableRows, updateLBDisplayDifficulty,
  updateLBTableRows, updateLBDisplayBook} from "./ui_manager.js";
import {fetchScriptures} from "./data_manager.js";
import {ELS, ANIMATION_TIME_MS, TIMER_DURATIONS, 
  THRESHOLD_ARRAYS, STANDARD_WORKS_FILE_NAMES, GAME_STATES, BASE_POSITIONS,
  DIFFICULTY_NAMES, BOOK_NAMES} from './config.js'

// let updateNeeded = true;

// Variable Initiation
let currentSelection = null;
let chapterIndexMap = {};
let currGuessDistance = Infinity;
let bases = [false, false, false, false]; // Tracks whether each base is occupied
let runners = []; // Tracks runner elements for animation

document.addEventListener('DOMContentLoaded', function () {

  // Set CSS variables for animation time
  document.documentElement.style.setProperty('--runner-animation-time', `${ANIMATION_TIME_MS}ms`);
  
  document.getElementById('threshold-value').addEventListener('change', handleThreshValueChange);
  document.getElementById('revealDistance').addEventListener('click', handleRevealDistance);
  document.getElementById('revealReference').addEventListener('click', handleRevealReference);
  document.getElementById('newRound').addEventListener('click', handleNewRound);
  document.getElementById('leaderboard-button').addEventListener('click', handleLeaderboardButton);
  document.getElementById('finalizeGuess').addEventListener('click', handleFinalizeGuess);
  document.getElementById('settings-button').addEventListener('click',handleSettingsButton);
  document.getElementById('check-all-inex').addEventListener('click', handleCheckAllInex);
  document.getElementById('uncheck-all-inex').addEventListener('click', handleUncheckAllInex);
  
  ELS.BUTTONS.hideOverlay.addEventListener('click', handleHideOverlay);
  ELS.vSelect.addEventListener('change', handleVSelectChange); 
  ELS.bookSelect.addEventListener('change', handleBookSelectChange);
  ELS.GO.BTNS.menu.addEventListener('click', handleGOMenuButton);
  ELS.GO.BTNS.restart.addEventListener('click', handleGORestartButton);
  ELS.LB.BTNS.bookSelect.forEach(button => {
    button.addEventListener('click', handleLBBookButton);
  });

  document.querySelectorAll('.start-button').forEach(button => {
    button.addEventListener('click', function(){
      if(button.id === 'start-button'){
        let difEl = document.getElementById('threshold-value');
        gameState.settings.difficulty = difEl.value;
        console.log(`Difficulty: ${gameState.settings.thresholdSetting}; Timer: ${TIMER_DURATIONS[gameState.settings.thresholdSetting]}s`);
      }
      startGame();
    });
  });
  document.querySelectorAll('.restart-button').forEach(button => {
    button.addEventListener('click', handleRestartButton);
  });
  document.querySelectorAll('.main-menu-button').forEach(button => {
    button.addEventListener('click', handleMainMenuButton);
  });
  document.querySelectorAll('.lb-difficulty-option').forEach(button => {
    button.addEventListener("click", handleLBDiffButton);
  });

  ELS.toggle.addEventListener('click', (e)=>{
    e.stopPropagation(); // Study this further to understand
    ELS.dropdown.classList.toggle('open');
  });

  
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

  initializeLBTableRows();
  updateLBDisplayDifficulty();
  updateLBDisplayBook();
  updateLBTableRows();

  positionBases();

  // Load verses from bom.json when the page loads
  loadData();
});

async function loadData() {
  try{
    const response = await fetchScriptures(STANDARD_WORKS_FILE_NAMES[gameState.settings.currentVolume]);
    gameState.scriptures = await response;

    buildVerseList(gameState.scriptures);
    buildChapterIndex(gameState.scriptures);
    populateGuessOptions(gameState.scriptures);
    populateIncludeExcludeOptions();
    
  } catch (err) {
    console.error('Error loading verses: ', err);
  }
  
}

function showVerses() {
  const container = document.getElementById('verses');
  const referenceElement = document.getElementById('reference');
  const revealButton = document.getElementById('revealReference');
  const distanceButton = document.getElementById('revealDistance');

  const resultEl = document.getElementById('result');
  const distanceEl = document.getElementById('distance');

  ELS.bookSelect.value = '';
  ELS.chapterSelect.innerHTML = '';
  resultEl.textContent = '';
  distanceEl.textContent = '';

  container.innerHTML = ''; // Clear previous verses
  referenceElement.textContent = ''; // Clear previous reference
  revealButton.textContent = 'Reveal Reference';

  currGuessDistance = Infinity;

  currentSelection = getRandomVerses();

  // Three seperate paragraphs (one for each verse)
  currentSelection.verses.forEach(verse => {
    const p = document.createElement('p');
    p.textContent = verse.text;
    container.appendChild(p);
  });
}

function  buildChapterIndex(scriptures) {
  let index = 0;
  chapterIndexMap = {};
  for (const book in scriptures) {
    for (const chapter in scriptures[book]) {
      const key = `${book} ${chapter}`;
      chapterIndexMap[key] = index++;
    }
  }
}

async function advanceRunners(numBases){
  if(numBases > 0){
    spawnRunner();
    await nextFrame();
    await nextFrame();
  } else {
    return;
  } // No runners to advance

  // Move runners forward one base the correct number of times
  for(let i = 0; i < numBases; ++i){
    runners.forEach(runner => {
      let newBase = getNextBase(runner.base); 
      setRunnerPosition(runner.el, newBase);
      runner.base = newBase;
    });

    await waitForAllRunners(runners, ANIMATION_TIME_MS);

    runners = runners.filter(runner => {
      if(runner.base === "back_home"){
        ++gameState.score;
        runner.el.remove();
        return false; // Remove from runners array
      }
      return true; // Keep in runners array
    });
  }
  
  updateScoreboard(gameState.score, gameState.round, gameState.strikes);
}

function spawnRunner(){
  const runner = document.createElement('div');
  runner.classList.add('runner');
  document.getElementById('diamond').appendChild(runner);

  setRunnerPosition(runner, "home");

  runners.push({el: runner, base: "home"});
  return runner;
}

function waitForAllRunners(runners, duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

function setRunnerPosition(runner, base){
  const coords = BASE_POSITIONS[base];
  runner.style.left = coords.left + -2.5 + "%";
  runner.style.top = coords.top + -2.5 + "%";
  //runner.style.transform = `translate(${coords.left}%, ${coords.top}%)`; 
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

    if (!currentSelection) {
      resultEl.textContent = "No verses loaded yet.";
      return;
    }


    const guessKey = `${bookGuess} ${chapterGuess}`;
    const answerKey = `${currentSelection.book} ${currentSelection.chapter}`;

    const guessIndex = chapterIndexMap[guessKey];
    const answerIndex = chapterIndexMap[answerKey];

    const distance = Math.abs(guessIndex - answerIndex);
    currGuessDistance = distance;

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

function startRound(){
  showVerses();
  ++gameState.round;
  updateScoreboard(gameState.score, gameState.round, gameState.strikes);
  startTimer(handleTimeUp, TIMER_DURATIONS[gameState.settings.thresholdSetting]);
  document.getElementById("newRound").disabled = true;
}

function handleTimeUp() {
  addStrike();
  stopTimer();
  document.getElementById("newRound").disabled = false;
}

function showScreen(state){
  gameState.displayScreen = state;
  document.getElementById('menu-screen').style.display = (state === GAME_STATES.MENU) ? 'block' : 'none';
  document.getElementById('game-screen').style.display = (state === GAME_STATES.IN_GAME) ? 'block' : 'none';
  document.getElementById('settings-screen').style.display = (state === GAME_STATES.SETTINGS) ? 'block' : 'none';
  document.getElementById('leaderboard-screen').style.display = (state === GAME_STATES.LEADERBOARD) ? 'block' : 'none';
}

function addStrike(){
  ++gameState.strikes;
  updateScoreboard(gameState.score, gameState.round, gameState.strikes);
  if(gameState.strikes >= 3){
    document.getElementById('final-score').textContent = gameState.score;
    sleep(1000).then(() => {
      endGame();
      showGameOver();
    });
  }
}

function startGame(){
  gameState.strikes = 0;
  gameState.score = 0;
  gameState.round = 0;
  updateScoreboard(gameState.score, gameState.round, gameState.strikes);
  showScreen(GAME_STATES.IN_GAME);
  startRound();
}

window.addStrike = addStrike;
window.advanceRunners = advanceRunners;

// Event Listener Functions (Will be exported or regrouped soon I think)
function handleThreshValueChange(){
  gameState.settings.thresholdSetting = document.getElementById('threshold-value').value;
}
function handleRevealDistance(){
  const refEl = document.getElementById('distance');
    console.log('Distance reveal button clicked');
    // SIMPLE REVEAL: just show once
    if (!refEl.textContent && currGuessDistance != Infinity) {
      if(currGuessDistance === 0) refEl.textContent = `(Exactly Correct! Great Job!)`;
      refEl.textContent = `(Off by ${currGuessDistance} chapters)`;
    }
}
function handleRevealReference(){
  const refEl = document.getElementById('reference');
  //refEl.hidden = false;
  if (!refEl.textContent && currentSelection) {
    let cs = currentSelection;
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
function handleHideOverlay(){
  hideGameOver();
}
function handleRestartButton(){
  if(gameState.inRound) {
    endGame();
  }
  startGame();
}
function handleGORestartButton(){
  hideGameOver();
  startGame();
}
function handleGOMenuButton(){
  hideGameOver();
  showScreen(GAME_STATES.MENU);
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