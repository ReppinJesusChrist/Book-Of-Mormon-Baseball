export function populateGuessOptions(scriptures) {
  if(!scriptures){
    console.warn("function called before scriptures were loaded");
  }

  const bookSelect = document.getElementById('bookSelect');
  bookSelect.innerHTML = ''; // Clear previous options
  const chapterSelect = document.getElementById('chapterSelect');

  // Fill book options
  const books = Object.keys(scriptures);
  books.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    bookSelect.appendChild(option);
    bookSelect.value = ''; // Default to no selection
  });
}

export function updateStrikeBoxes(strikes){
    for(let i = 1; i <=3; ++i){
    const box = document.getElementById(`strike-box-${i}`);
    box.textContent = i <= strikes ? 'X' : '';
  }
}

export function updateScoreboard(score, round, strikes){
    document.getElementById("score").textContent = `${score}`;
    document.getElementById("round").textContent = `${round}`;
    document.getElementById("strikes").textContent = `${strikes}`;
    updateStrikeBoxes(strikes);
}

export function showFinalScore(){
    document.getElementById('final-score').textContent = score;
}

