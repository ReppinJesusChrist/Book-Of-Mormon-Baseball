import {ELS, NUM_LB_SCORES, TIMER_DURATIONS, GAME_STATES,
  ANIMATION_TIME_MS, THRESHOLD_ARRAYS,
} from "./config.js";
import {showGameOver, updateScoreboard, updateLBTableRows, 
  showVerses, showScreen, setRunnerPosition, animateStrike
} from "./ui_manager.js";
import {startTimer, stopTimer} from "./timer.js";
import {sleep, nextFrame, waitForAllRunners} from "./helper_functions.js";
import { submitScore } from "./data_manager.js";

window.addStrike = addStrike;
window.advanceRunners = advanceRunners;

export const gameState = {
  inRound: false,
  
  score : 0,
  strikes : 0,
  round : 0,
  runners : [], // Tracks runner elements for animation
  bases : [], // Tracks which bases are occupied. Not currently used.

  scriptures : null,
  includedBooks : new Set(),
  currentSelection: null,
  chapterIndexMap: {},
  currGuessDistance: Infinity,

  displayScreen : 'menu',

  // Initialization is for default setting values
  settings: {
    numDisplayVerses: 3,
    difficulty : 'hard', // easiest -> average -> hardest
    lbDifficulty : 'hard',
    lbVolume : 'bofm',

    currentVolume : 'bofm',
    customStudyPlan: 'bofm_isaiah'
  }
}

export function startRound(){
  showVerses();
  ++gameState.round;
  updateScoreboard();
  startTimer(handleTimeUp, TIMER_DURATIONS[gameState.settings.difficulty]);
  ELS.GAME.BTNS.newRound.disabled = true;
  ELS.GAME.BTNS.revealDistance.disabled = true;
  ELS.GAME.BTNS.revealReference.disabled = true;

  ELS.GAME.DROPS.bookDropdown.value = "";
  ELS.GAME.DROPS.chapterDropdown.value = "";

  ELS.GAME.DROPS.bookSelectTrigger.innerHTML = "Select Book";
  ELS.GAME.DROPS.chapterSelectTrigger.innerHTML = "Chapter";
}

function resetElsBetweenRounds(){

}

export function startGame(){
  gameState.strikes = 0;
  gameState.score = 0;
  gameState.round = 0;
  gameState.inRound = true;
  updateScoreboard()
  showScreen(GAME_STATES.IN_GAME);
  startRound();
}

export async function endGame(){
  ELS.BUTTONS.newRound.disabled = true;
  ELS.finalScore.textContent = gameState.score;
  localStorage.setItem("Last Score", gameState.score);
  resetBases(gameState.bases, gameState.runners);
  stopTimer();
  updateHighScores(gameState.score);
  updateLBTableRows();
  gameState.inRound = false;
}

function updateHighScores(newScore){
  let allScores = JSON.parse(localStorage.getItem("topScores")) || [];
  let scores = allScores[gameState.settings.currentVolume][gameState.settings.difficulty] || [];

  const newScoreObject = makeScoreObject(newScore);

  submitScore(newScoreObject);

  // Add new score to array
  scores.push(newScoreObject);

  // Sort new score to correct place
  scores.sort((a,b) => b.score - a.score);

  // Trim to size
  scores = scores.slice(0, NUM_LB_SCORES);

  allScores[gameState.settings.currentVolume][gameState.settings.difficulty] = scores;
  localStorage.setItem("topScores", JSON.stringify(allScores));
}

function resetBases(bases, runners){
  console.log("Bases Reset");
  bases = [false, false, false, false];
  if(runners) runners.length = 0;
  document.querySelectorAll('#diamond .runner').forEach(r=>r.remove());
}

export function getNextBase(currentBase){
  const order = ["home", "first", "second", "third", "back_home"];
  const index = order.indexOf(currentBase);
  let nextIndex = (index + 1);
  return order[nextIndex];
}

export function spawnRunner(){
  const runner = document.createElement('div');
  runner.classList.add('runner');
  ELS.GAME.diamond.appendChild(runner);

  setRunnerPosition(runner, "home");

  gameState.runners.push({el: runner, base: "home"});
  return runner;
}

export async function advanceRunners(numBases){
  if(numBases > 0){
    spawnRunner();
    await nextFrame();
    await nextFrame();
  } else {
    return;
  } // No runners to advance

  // Move runners forward one base the correct number of times
  for(let i = 0; i < numBases; ++i){
    gameState.runners.forEach(runner => {
      let newBase = getNextBase(runner.base); 
      setRunnerPosition(runner.el, newBase);
      runner.base = newBase;
    });

    await waitForAllRunners(gameState.runners, ANIMATION_TIME_MS);

    gameState.runners = gameState.runners.filter(runner => {
      if(runner.base === "back_home"){
        ++gameState.score;
        runner.el.remove();
        return false; // Remove from runners array
      }
      return true; // Keep in runners array
    });
  }
  
  updateScoreboard();
}

export function addStrike(){
  ++gameState.strikes;
  updateScoreboard();
  animateStrike();
  
  if(gameState.strikes >= 3){
    ELS.GO.TXT.finalScore.textContent = gameState.score;
    sleep(1000).then(() => {
      endGame();
      showGameOver();
    });
  }
}

function makeScoreObject(score){
  const scoreObj = {
    score: score,
    datetime: new Date().toISOString()
  }
  return scoreObj;
}

function handleTimeUp() {
  addStrike();
  stopTimer();
  ELS.GAME.BTNS.newRound.disabled = false;
}

export function submitGuess() {
    const bookGuess = ELS.GAME.DROPS.bookDropdown.value;
    const chapterGuess = ELS.GAME.DROPS.chapterDropdown.value;

    const resultEl = ELS.GAME.TXT.result;
    ELS.GAME.BTNS.newRound.disabled = false;
      ELS.GAME.BTNS.revealReference.disabled = false;

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

    const [homeRunThreshold, tripleThreshold, doubleThreshold, singleThreshold] = THRESHOLD_ARRAYS[gameState.settings.difficulty];

    advanceRunners(distance <= homeRunThreshold ? 4 :
                   distance <= tripleThreshold ? 3 :
                   distance <= doubleThreshold ? 2 :
                   distance <= singleThreshold ? 1 : 0);

    if (distance <= homeRunThreshold){
      if(distance === 0) resultEl.textContent = 'HOME RUN! Exactly Correct; Fantastic Job!!!';
      else resultEl.textContent = `HOME RUN!!! (Only off by ${distance} chapters).`;
    } else if(distance <= tripleThreshold){
      resultEl.textContent = `TRIPLE!! (Off by ${distance} chapters).`;
    } else if(distance <= doubleThreshold){
      resultEl.textContent = `Double! (Off by ${distance} chapters). `;
    } else if(distance <= singleThreshold){
      resultEl.textContent = `Single (Off by ${distance} chapters). `;
    } else {
      resultEl.textContent = `STRIKE! (Off by ${distance} chapters). `;
      addStrike();
    }

    ELS.GAME.BTNS.submit.disabled = true;
}