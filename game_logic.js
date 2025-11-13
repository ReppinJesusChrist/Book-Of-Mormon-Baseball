import {showGameOver, updateScoreboard} from "./ui_manager.js";
import {stopTimer} from "./timer.js";
import {BUTTON_ELS, EL_NAMES} from "./config.js";

export async function endGame(){
  BUTTON_ELS.newRound.disabled = true;
  EL_NAMES.finalScore.textContent = score;
  localStorage.setItem("Last Score", score);
  resetBases();
  stopTimer();
  if(score > localStorage.getItem("High Score")) localStorage.setItem("High Score", score); 
}

function resetBases(bases, runners){
  console.log("Bases Reset");
  bases = [false, false, false, false];
  runners.length = 0;
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