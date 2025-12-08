import {ELS, DIFFICULTY_NAMES, BOOK_NAMES, GAME_STATES, BASE_POSITIONS
  
} from "./config.js";
import {getRandomVerses} from "./data_manager.js";
import {gameState} from "./game_logic.js";


const LB_tbody = document.querySelector("#leaderboard-table tbody"); 

export function showScreen(state){
  gameState.displayScreen = state;
  ELS.MENU.screen.style.display = (state === GAME_STATES.MENU) ? 'block' : 'none';
  ELS.GAME.screen.style.display = (state === GAME_STATES.IN_GAME) ? 'block' : 'none';
  ELS.SET.screen.style.display = (state === GAME_STATES.SETTINGS) ? 'block' : 'none';
  ELS.LB.screen.style.display = (state === GAME_STATES.LEADERBOARD) ? 'block' : 'none';
}

export function initLBTableRows(){
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

export function populateIncludeExcludeOptions_old() {
  // Clear previous options
  ELS.IESelect.innerHTML = '';
  gameState.includedBooks.clear();
  
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

export function populateIncludeExcludeOptions() {
  // Clear previous options
  ELS.IESelect.innerHTML = '';
  gameState.includedBooks.clear();
  
  Object.keys(gameState.scriptures).forEach(bookName => {
    const wrapper = document.createElement('label');
    wrapper.classList.add("custom-option");

    const checkbox = document.createElement('input');
    const labelSpan = document.createElement('span');
    checkbox.type = 'checkbox';
    checkbox.id = `inex-${bookName}`;
    checkbox.value = bookName;
    checkbox.checked = true; // Default to include all books

    labelSpan.classList.add("custom-label");
    labelSpan.textContent = bookName;

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
    wrapper.appendChild(labelSpan);
    ELS.IESelect.appendChild(wrapper);
  });
}

export function populateGuessOptions() {
  if(!gameState.scriptures){
    console.warn("function called before scriptures were loaded");
  }

  const bookSelect = ELS.SET.DROPS.bookSelect;
  bookSelect.innerHTML = ''; // Clear previous options
  const chapterSelect = ELS.SET.DROPS.chapSelect;

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
    ELS.GAME.SB.score.textContent = `${gameState.score}`;
    ELS.GAME.SB.round.textContent = `${gameState.round}`;
    ELS.GAME.SB.strikes.textContent = `${gameState.strikes}`;
    updateStrikeBoxes(gameState.strikes);
}

export function updateLBDisplayDifficulty(){
  ELS.LB.difficultyLabel.textContent = DIFFICULTY_NAMES[gameState.settings.lbDifficulty];
}

export function updateLBDisplayBook(){
  ELS.LB.bookLabel.textContent = BOOK_NAMES[gameState.settings.lbBook];
}

export function showVerses() {
  const container = ELS.GAME.TXT.verseBox;
  const referenceEl = ELS.GAME.TXT.refReveal;
  const refRevealBtn = ELS.GAME.BTNS.revealReference;
  const distRevealBtn = ELS.GAME.BTNS.revealDistance;

  const resultEl = ELS.GAME.TXT.result;
  const distanceEl = ELS.GAME.TXT.distReveal;

  ELS.bookSelect.value = '';
  ELS.chapterSelect.innerHTML = '';
  resultEl.textContent = '';
  distanceEl.textContent = '';

  container.innerHTML = ''; // Clear previous verses
  referenceEl.textContent = ''; // Clear previous reference
  refRevealBtn.textContent = 'Reveal Reference';

  gameState.currGuessDistance = Infinity;

  gameState.currentSelection = getRandomVerses();

  // Three seperate paragraphs (one for each verse)
  gameState.currentSelection.verses.forEach(verse => {
    const p = document.createElement('p');
    p.textContent = verse.text;
    container.appendChild(p);
  });
}

export function setRunnerPosition(runner, base){
  const coords = BASE_POSITIONS[base];
  runner.style.left = coords.left + -2.5 + "%";
  runner.style.top = coords.top + -2.5 + "%";
  //runner.style.transform = `translate(${coords.left}%, ${coords.top}%)`; 
}

export function animateStrike(){
  const sd = ELS.GAME.strikeEffectText;
  sd.textContent = `STRIKE ${gameState.strikes}`;
  sd.classList.remove('animate-strike');
  void sd.offsetWidth;
  sd.classList.add('animate-strike');
}

export function positionBases(){
  for (const [base, pos] of Object.entries(BASE_POSITIONS)) {
    if(base === "back_home") continue; // No element for this one
    const baseEl = document.getElementById(base);
    baseEl.style.position = "absolute";
    baseEl.style.left = `${pos.left}%`;
    baseEl.style.top = `${pos.top}%`;
    baseEl.style.transform = "translate(-50%, -50%) rotate(45deg)"; // Center and rotate
  }
}