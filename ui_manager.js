import {ELS} from "./config.js";

const LB_tbody = document.querySelector("#leaderboard-table tbody");

export function populateLBTableRows(){
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
}

export function showGameOver(score){
  ELS.finalScore.textContent = score;
  ELS.overlay.classList.add('visible');
}

export function hideGameOver(){
  ELS.overlay.classList.remove('visible');
}

export function populateIncludeExcludeOptions(scriptures, includedBooks) {
  ELS.IESelect.innerHTML = ''; // Clear previous options
    Object.keys(scriptures).forEach(bookName => {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'block';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `inex-${bookName}`;
      checkbox.value = bookName;
      checkbox.textContent = bookName;
      checkbox.checked = true; // Default to include all books
      includedBooks.add(bookName); // Update set to reflect ^^^

      const label = document.createElement('label');
      label.setAttribute('for', `inex-${bookName}`);
      label.textContent = bookName;

      checkbox.addEventListener('change', () => {
        if(checkbox.checked){
          includedBooks.add(bookName);
        } else {
          includedBooks.delete(bookName);
        }
        console.log(`Included books:`, includedBooks);
      });

      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);
      ELS.IESelect.appendChild(wrapper);
    });
}

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
