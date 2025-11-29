import {ELS, DIFFICULTY_NAMES, BOOK_NAMES} from "./config.js";
import {getRandomVerses} from "./data_manager.js";
import {gameState} from "./game_logic.js";


const LB_tbody = document.querySelector("#leaderboard-table tbody"); 

export function initializeLBTableRows(){
  for(let i = 0; i < 10; ++i){
    const row = document.createElement("tr");
    row.innerHTML = 
    `
      <td>${i+1}</td>
      <td></td>
      <td></td>
      <td></td>
    `;
    LB_tbody.appendChild(row);
  }
  updateLBTableRows();
}

export function updateLBTableRows(){
  let allScores = JSON.parse(localStorage.getItem("topScores"));
  let scores = allScores[gameState.settings.lbBook][gameState.settings.lbDifficulty] || [];

  let rows = LB_tbody.querySelectorAll("tr");

  if(scores.length === 0){
    clearLB();
  }else{
    scores.forEach((entry, i) => {
      const d = new Date(entry.datetime);
      rows[i].children[1].textContent = entry.score;
      rows[i].children[2].textContent = d.toLocaleDateString();
      rows[i].children[3].textContent = d.toLocaleTimeString();
    });
  }
   
}

function clearLB(){
  let rows = LB_tbody.querySelectorAll("tr");
  rows.forEach(row => {
    row.children[1].textContent = row.children[2].textContent = row.children[3].textContent = '';
  });
}

export function showGameOver(){
  ELS.finalScore.textContent = gameState.score;
  ELS.overlay.classList.add('visible');
}

export function hideGameOver(){
  ELS.overlay.classList.remove('visible');
}

export function populateIncludeExcludeOptions() {
  ELS.IESelect.innerHTML = ''; // Clear previous options
    Object.keys(gameState.scriptures).forEach(bookName => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'block';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `inex-${bookName}`;
      checkbox.value = bookName;
      checkbox.textContent = bookName;
      checkbox.checked = true; // Default to include all books
      gameState.includedBooks.add(bookName); // Update set to reflect ^^^

      const label = document.createElement('label');
      label.setAttribute('for', `inex-${bookName}`);
      label.textContent = bookName;

      checkbox.addEventListener('change', () => {
        if(checkbox.checked){
          gameState.includedBooks.add(bookName);
        } else {
          gameState.includedBooks.delete(bookName);
        }
        console.log(`Included books:`, gameState.includedBooks);
      });

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      ELS.IESelect.appendChild(wrapper);
    });
}

export function populateGuessOptions() {
  if(!gameState.scriptures){
    console.warn("function called before scriptures were loaded");
  }

  const bookSelect = document.getElementById('bookSelect');
  bookSelect.innerHTML = ''; // Clear previous options
  const chapterSelect = document.getElementById('chapterSelect');

  // Fill book options
  const books = Object.keys(gameState.scriptures);
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

export function updateScoreboard(){
    document.getElementById("score").textContent = `${gameState.score}`;
    document.getElementById("round").textContent = `${gameState.round}`;
    document.getElementById("strikes").textContent = `${gameState.strikes}`;
    updateStrikeBoxes(gameState.strikes);
}

export function updateLBDisplayDifficulty(){
  ELS.LB.difficultyLabel.textContent = DIFFICULTY_NAMES[gameState.settings.lbDifficulty];
}

export function updateLBDisplayBook(){
  ELS.LB.bookLabel.textContent = BOOK_NAMES[gameState.settings.lbBook];
}

export function showVerses() {
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
  
    gameState.currGuessDistance = Infinity;
  
    gameState.currentSelection = getRandomVerses();
  
    // Three seperate paragraphs (one for each verse)
    gameState.currentSelection.verses.forEach(verse => {
      const p = document.createElement('p');
      p.textContent = verse.text;
      container.appendChild(p);
    });
}