import {NUM_LB_SCORES, TIMER_DURATIONS, GAME_STATES,
  ANIMATION_TIME_MS, THRESHOLD_ARRAYS, SCORING_MATRIX, 
  SCORE_TO_SI_MATRIX, DIFFICULTY_NAMES, ACHIEVEMENTS,
} from "./config.js";
import {ELS} from "./ELS.js";
import {showGameOver, updateScoreboard, updateLBTableRows, 
  showVerses, showScreen, setRunnerPosition, animateStrike,
  updateBbucksDisplay, updateAchievementsPage} from "./ui_manager.js";
import {startTimer, stopTimer} from "./timer.js";
import {sleep, nextFrame, waitForAllRunners} from "./helper_functions.js";
import { submitScore, addBomBucks, getBomBucks, getPlayerAchievementsArray,
  setPlayerAchievementsArray, 
 } from "./data_manager.js";

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

    runnerColor: 'red',

    currentVolume : 'bofm',
    customStudyPlan: 'bofm_isaiah'
  },
}

export function startRound(){
  showVerses();
  ++gameState.round;
  updateScoreboard();
  startTimer(handleTimeUp, TIMER_DURATIONS[gameState.settings.difficulty]);

  ELS.GAME.BTNS.newRound.disabled = true;
  ELS.GAME.BTNS.revealReference.disabled = false;

  /**
   * Toggle which button is visible. I'm hoping to generalize this for 
   * button pairs and groups in the near future.
  */
  ELS.GAME.BTNS.submit.classList.remove('hidden');
  ELS.GAME.BTNS.revealReference.classList.add('hidden');

  ELS.GAME.DROPS.bookDropdown.classList.remove("disabled");
  ELS.GAME.DROPS.chapterDropdown.classList.remove("disabled");

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

  ELS.GAME.BTNS.newRound.classList.remove('hidden');
  ELS.GAME.BTNS.showGo.classList.add('hidden');

  updateScoreboard()
  showScreen(GAME_STATES.IN_GAME);
  startRound();
}

export async function endGame(){
  ELS.GAME.BTNS.newRound.classList.add('hidden');
  ELS.GAME.BTNS.showGo.classList.remove('hidden');

  const finalScore = gameState.score;
  const difficulty = gameState.settings.difficulty;

  ELS.finalScore.textContent = finalScore;
  localStorage.setItem("Last Score", finalScore);
  resetBases(gameState.bases, gameState.runners);
  stopTimer();

  const BbucksEarned = calculateBbucksEarned();
  ELS.GO.TXT.bomBucks.innerText = BbucksEarned;
  addBomBucks(BbucksEarned);
  updateBbucksDisplay();

  checkScoreAchievements(difficulty, finalScore);
  checkBomBuckAchievements(BbucksEarned);
  updateAchievementsPage();

  updateHighScores(finalScore);
  updateLBTableRows();
  gameState.inRound = false;
}

function calculateBbucksEarned(){
  let finalScore = gameState.score;
  let DI = convertDifficultyToIndicator(gameState.settings.difficulty); //Difficulty Indicator
  let SI = convertScoreToIndicator(finalScore); //Score Indicator
  const BBMult = SCORING_MATRIX[SI][DI];
  const BBEarned = BBMult * finalScore;

  return BBEarned;
}

function convertScoreToIndicator(score){
  let indicator = 0;
  let thresholds = SCORE_TO_SI_MATRIX;
  for(const t of thresholds) {
    if(score >= t.minScore){
      indicator = t.SI_Value;
    }else{
      break;
    }
  }
  return indicator;
}

function convertDifficultyToIndicator(difficulty){
  const keys = Object.keys(DIFFICULTY_NAMES);
  return keys.indexOf(difficulty);
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
  console.log(gameState.settings.runnerColor);
  runner.style.setProperty(
    '--runner-color',
    `var(--runner-${gameState.settings.runnerColor})`
  );

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

  ELS.GAME.DROPS.bookDropdown.classList.add("disabled");
  ELS.GAME.DROPS.chapterDropdown.classList.add("disabled");
  ELS.GAME.DROPS.bookDropdown.classList.remove("open");
  ELS.GAME.DROPS.chapterDropdown.classList.remove("open");

  ELS.GAME.BTNS.newRound.disabled = false;

  /**
     * Toggle which button is visible. I'm hoping to generalize this for 
     * button pairs and groups in the near future because this code is
     * already reused twice for this specific pair and there will be more.
     */
    ELS.GAME.BTNS.submit.classList.add('hidden');
    ELS.GAME.BTNS.revealReference.classList.remove('hidden');
}

export function submitGuess() {
    const bookGuess = ELS.GAME.DROPS.bookDropdown.value;
    const chapterGuess = ELS.GAME.DROPS.chapterDropdown.value;

    const resultEl = ELS.GAME.TXT.result;
    ELS.GAME.BTNS.newRound.disabled = false;

    /**
     * Toggle which button is visible. I'm hoping to generalize this for 
     * button pairs and groups in the near future.
     */
    ELS.GAME.BTNS.submit.classList.add('hidden');
    ELS.GAME.BTNS.revealReference.classList.remove('hidden');

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
    ELS.GAME.DROPS.bookDropdown.classList.add("disabled");
    ELS.GAME.DROPS.chapterDropdown.classList.add("disabled");
}

/*
 *  Functions for checking whether each type of achievement has
 *  been completed. 
 */

function checkScoreAchievements(difficulty, score){
  const configArray = ACHIEVEMENTS.scoreXonD.difficultyArrays[difficulty];
  let playerArray = getPlayerAchievementsArray();
  let diffArray = playerArray.scoreXonD.difficultyArrays[difficulty];

  configArray.forEach((achievement, index) => {
    if(!diffArray[index] && score >= achievement.requiredPoints) {
      diffArray[index] = true;
    }
  });

  setPlayerAchievementsArray(playerArray);
}

function checkBomBuckAchievements(BbucksEarned){
  const oneRoundArray = ACHIEVEMENTS.bbucksOneRound.achievementsArray;
  const totalArray = ACHIEVEMENTS.totalBbucks.achievementsArray;

  const totalBbucks = getBomBucks();
  let playerArray = getPlayerAchievementsArray();
  
  let playerOneRound = playerArray.bbucksOneRound.achievementsArray;
  let playerTotal = playerArray.totalBbucks.achievementsArray;

  // One round earned check
  oneRoundArray.forEach((achievement, index) => {
    if(!playerOneRound[index] && BbucksEarned >= achievement.requiredBucks) {
      playerOneRound[index] = true;
    }
  });

  // Total currently owned check
  totalArray.forEach((achievement, index) => {
    if(!playerTotal[index] && totalBbucks >= achievement.requiredBucks) {
      playerTotal[index] = true;
    }
  });

  setPlayerAchievementsArray(playerArray);
}

export function setRunnerColor(color){
  gameState.settings.runnerColor = color;
}