export function updateStrikeBoxes(strikes){
    for(let i = 1; i <=3; ++i){
    const box = document.getElementById(`strike-box-${i}`);
    box.textContent = i <= strikes ? 'X' : '';
  }
}

export function updateScoreboard(score, round, strikes){
    document.getElementById("score").textContent = `${score}`;
    document.getElementById("round").textContent = `${round}`;
    document.getElementById("strikes").textContent = `Strikes: ${strikes}`;
    updateStrikeBoxes(strikes);
}

export function showFinalScore(){
    document.getElementById('final-score').textContent = score;
}