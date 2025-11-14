import {showGameOver, updateScoreboard, updateLBTableRows} from "./ui_manager.js";
import {stopTimer} from "./timer.js";
import {ELS, NUM_LB_SCORES} from "./config.js";

export async function endGame(score){
  ELS.BUTTONS.newRound.disabled = true;
  ELS.finalScore.textContent = score;
  localStorage.setItem("Last Score", score);
  resetBases();
  stopTimer();
  updateHighScores(score);
  updateLBTableRows();
  // Deprecated. Remove as soon as ^^^ is implemented
  if(score > localStorage.getItem("High Score")) localStorage.setItem("High Score", score); 
}

function updateHighScores(newScore){
  let scores = JSON.parse(localStorage.getItem("topScores")) || [];

  // Add new score to array
  scores.push(newScore);

  // Sort new score to correct place
  scores.sort((a,b) => b - a);

  // Trim to size
  scores = scores.slice(0, NUM_LB_SCORES);

  localStorage.setItem("topScores", JSON.stringify(scores));
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

export function addStrike(score, round, strikes){
    ++strikes;
    updateScoreboard(score, round, strikes);
    sleep(1000).then(() => {
      showGameOver();
      endGame();
  }); 
}

export function initializeGame(){

}
export function startGame(){

}