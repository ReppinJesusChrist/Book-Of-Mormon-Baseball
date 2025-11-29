import {showGameOver, updateScoreboard, updateLBTableRows, showVerses} from "./ui_manager.js";
import {startTimer, stopTimer} from "./timer.js";
import {ELS, NUM_LB_SCORES, TIMER_DURATIONS} from "./config.js";

export const gameState = {
  inRound: false,

  score : 0,
  strikes : 0,
  round : 0,

  scriptures : null,
  includedBooks : new Set(),
  currentSelection: null,
  chapterIndexMap: {},
  currGuessDistance: Infinity,


  displayScreen : 'menu',

  // Default Setting Values
  settings: {
    numDisplayVerses: 3,
    difficulty : 'average', // easiest -> average -> hardest
    lbDifficulty : 'average',
    lbBook : 'bofm',
    currentVolume : 'bofm',
    thresholdSetting : 'average'
  }
}

export function startRound(){
  showVerses();
  ++gameState.round;
  updateScoreboard();
  startTimer(handleTimeUp, TIMER_DURATIONS[gameState.settings.thresholdSetting]);
  document.getElementById("newRound").disabled = true;
}

export async function endGame(){
  ELS.BUTTONS.newRound.disabled = true;
  ELS.finalScore.textContent = gameState.score;
  localStorage.setItem("Last Score", gameState.score);
  resetBases();
  stopTimer();
  updateHighScores(gameState.score);
  updateLBTableRows();
  gameState.inRound = false;
}

function updateHighScores(newScore){
  let allScores = JSON.parse(localStorage.getItem("topScores")) || [];
  let scores = allScores[gameState.settings.lbBook][gameState.settings.difficulty] || [];

  const newScoreObject = makeScoreObject(newScore);

  // Add new score to array
  scores.push(newScoreObject);

  // Sort new score to correct place
  scores.sort((a,b) => b.score - a.score);

  // Trim to size
  scores = scores.slice(0, NUM_LB_SCORES);

  allScores[gameState.settings.lbBook][gameState.settings.difficulty] = scores;
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

export function addStrike(){
  ++gameState.strikes;
  updateScoreboard()
  if(gameState.strikes >= 3){
    document.getElementById('final-score').textContent = gameState.score;
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
  document.getElementById("newRound").disabled = false;
}

export function initializeGame(){

}
export function startGame(){

}