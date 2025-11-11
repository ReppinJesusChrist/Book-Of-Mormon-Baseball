import {updateScoreboard, showFinalScore} from "./ui_manager.js";
import {stopTimer} from "./timer.js";

export function addStrike(score, round, strikes){
    ++strikes;
    updateScoreboard(score, round, strikes);
    if(strikes >= 3){
        showFinalScore();
        endGame();
    }
}

async function endGame(){
  document.getElementById('newRound').disabled = true;
  document.getElementById('final-score').textContent = score;
  localStorage.setItem("Last Score", score);
  resetBases();

  if(score > localStorage.getItem("High Score")) localStorage.setItem("High Score", score);
  sleep(1000).then(() => {
    //showScreen(GAME_STATES.GAME_OVER);
    stopTimer();
  }); 
}

export function initializeGame(){

}
export function startGame(){

}