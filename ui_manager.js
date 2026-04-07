import {DIFFICULTY_NAMES, BOOK_NAMES, GAME_STATES, BASE_POSITIONS,
ACHIEVEMENTS} from "./config.js";
import {ELS} from "./ELS.js";
import {getRandomVerses, loadPlayerData, getPurchases} from "./data_manager.js";
import {gameState} from "./game_logic.js";
import {STORE_DEFS} from "./store.js";
import {arrayToPath} from "./helper_functions.js";


const LB_tbody = document.querySelector("#leaderboard-table tbody"); 

export function showScreen(state){
  gameState.displayScreen = state;
  
  ELS.MENU.screen.style.display = (state === GAME_STATES.MENU) ? 'flex' : 'none';
  ELS.GAME.screen.style.display = (state === GAME_STATES.IN_GAME) ? 'block' : 'none';
  ELS.SET.screen.style.display = (state === GAME_STATES.SETTINGS) ? 'block' : 'none';
  ELS.LB.screen.style.display = (state === GAME_STATES.LEADERBOARD) ? 'block' : 'none';
  ELS.ACHIEVEMENTS.screen.style.display = (state ===  GAME_STATES.ACHIEVEMENTS) ? 'flex' : 'none';
  ELS.STORE.screen.style.display = (state ===  GAME_STATES.STORE) ? 'block' : 'none';
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
  let scores = allScores[gameState.settings.lbVolume][gameState.settings.lbDifficulty] || [];

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

/**
 * ****************** *
 * Store Stuff        *
 * ****************** *
**/

export function stockStore(){
  const store = ELS.STORE.screen;
  const merchandise = STORE_DEFS;
  const receipts = getPurchases();


  for(const [sectionName, {headerText, colorOptions}] of Object.entries(merchandise)){
    const aisleReceipts = receipts.colorOptions;

    const aisle = document.createElement("div");
    aisle.id = sectionName;
    aisle.classList.add('store-section');
    store.appendChild(aisle);

    const header = document.createElement("h2");
    header.classList.add('store-section-header');
    header.textContent = headerText;
    aisle.appendChild(header);

    let index = 0;
    for(const {value, price} of colorOptions){
      const colorButton = document.createElement("button");

      colorButton.classList.add('buy-button', 'runner-color-button');
      colorButton.value = value;
      colorButton.dataset.cost = price;

      const isSelected = (value == gameState.settings.runnerColor);
      const isUnlocked = aisleReceipts[index];
      colorButton.innerHTML = `
          Make runners ${value} (<span class="cost-display"></span>)
          <span class="selected-indicator ${isSelected ? '':'hidden'}">--Selected--</span>
          <span class="locked-indicator ${isUnlocked ? 'hidden':''}">--LOCKED-- ${price} BB to unlock</span>
      `;
      aisle.appendChild(colorButton);
      ++index;
    }
  }
}

export function refreshStore(){
  const store = ELS.STORE.screen;
  const merchandise = STORE_DEFS;
  const receipts = getPurchases();


  for(const [sectionName, {headerText, colorOptions}] of Object.entries(merchandise)){
    const aisleReceipts = receipts.colorOptions;
    const aisle = store.querySelector(`#${sectionName}`);

    let index = 0;
    for(const {value, price} of colorOptions){
      const colorButton = aisle.querySelector(`button[value=${value}]`);

      const isSelected = (value == gameState.settings.runnerColor);
      const isUnlocked = aisleReceipts[index];

      const selectedIndicator = colorButton.querySelector('.selected-indicator');
      const lockedIndicator = colorButton.querySelector('.locked-indicator');

      if(isSelected){
        selectedIndicator.classList.remove('hidden');
      } else {
        selectedIndicator.classList.add('hidden');
      }

      if(isUnlocked){
        lockedIndicator.classList.add('hidden');
      } else {
        lockedIndicator.classList.remove('hidden');
      }

      ++index;
    }
  }
}

/**
 * ****************** *
 * Achievements Stuff *
 * ****************** *
**/
export function initAchievementsPage(){
  const achievements = ACHIEVEMENTS;
  const currPlayerAchievementObj = loadPlayerData().achievements;

  let achList = ELS.ACHIEVEMENTS.mainList;

  for(const [key, value] of Object.entries(achievements)){
    const sectionHeader = document.createElement("h2");
    sectionHeader.innerText = value.sectionHeader;
    achList.appendChild(sectionHeader);

    if(value.difficultyArrays) {
      for(const [difficulty, diffArray] of Object.entries(value.difficultyArrays)){
        const difficultyHeader = document.createElement("h3");
        difficultyHeader.classList.add('difficulty-header');
        difficultyHeader.innerText = DIFFICULTY_NAMES[difficulty];
        achList.appendChild(difficultyHeader);

        expandAchievementsArray(
          diffArray, currPlayerAchievementObj, achList,
          [key, "difficultyArrays", difficulty]
        );
      }
    } else {
      expandAchievementsArray(
        value.achievementsArray, currPlayerAchievementObj, achList, 
        [key, "achievementsArray"]
      );
    }
  }
}

function expandAchievementsArray(configArray, playerObj, targetDiv, basePath){
  configArray.forEach((achievement, index) => {
    const achEl = document.createElement("div");
    achEl.innerText = achievement.name;
    achEl.classList.add('main-list-achievement');

    const fullPath = [...basePath, index];
    achEl.dataset.path = fullPath.join("-");

    /*
     * Check current player array and mark as complete initially if
     * completed in a previous session.
     */
    if(arrayToPath(playerObj, fullPath)){
      achEl.classList.add('complete');
    }

    targetDiv.appendChild(achEl);
  });
}

export function updateAchievementsPage(){
  const mainList = ELS.ACHIEVEMENTS.mainList;

  const currPlayerAchievementObj = loadPlayerData().achievements;

  walkPlayerAchievements(currPlayerAchievementObj, (value, pathArray) => {
    const selector = `[data-path="${pathArray.join("-")}"]`;
    const achEl = mainList.querySelector(selector); 

    if(achEl && value && !achEl.classList.contains("complete")) {
      completeAchievement(arrayToPath(ACHIEVEMENTS, pathArray), achEl);
    }
  });
}

/**
 * 
 * @param {*} object 
 * @param {*} callback 
 * @param {*} path 
 * 
 * I don't understand this one very well and I think I could learn a lot
 * about JS by doing a deep dive into how it works. I asked some
 * follow-up questions to chat after asking for help making it, but I 
 * could use another good conversation.
 */
function walkPlayerAchievements(object, callback, path = []){
  if(Array.isArray(object)) {
    object.forEach((value, index) => {
      walkPlayerAchievements(value, callback, [...path, index]);
    });
  } else if (object !== null && typeof object === "object") {
    for (const [key, value] of Object.entries(object)) {
      walkPlayerAchievements(value, callback, [...path, key]);
    }
  } else {
    // If we reach this point, obj is a binary leaf node (achievement)
    callback(object, path);
  }
}

/**
 * 
 * Code for tracking and displaying achievements. This should be 
 * refactored into it's own file along with the above achievements-
 * related code soon I think.
 *  
 */ 

const DISPLAY_TIME_PER_ACHIEVEMENT = 3000;
const achievementDisplayQueue = [];
let isShowingAchievement = false;

/**
 * 
 * @param {*} listEl - The achievement element on the main achievements
 *  list to mark as complete
 * @param {*} achievement - The actual achievement from config.js
 * 
 * This function marks an achievement as complete. At this point, this
 * could easily be done inline in updateAchievementsPage(), but I intend
 * to implement a special notification system to display achievements
 * that will probably be async, so this provides future-proofing 
 */
async function completeAchievement(achievement, listEl){
  listEl.classList.add("complete");

  if(achievement === undefined){
    throw new Error(
      `No valid achievement was passed ${listEl.innerText}`
    );
  } 

  console.log("achievement unlocked: " , achievement);

  achievementDisplayQueue.push(achievement);
  processAchievementQueue();
}

async function processAchievementQueue() {
  if(isShowingAchievement) return;
  if(achievementDisplayQueue.length === 0) return;

  isShowingAchievement = true;

  const achievement = achievementDisplayQueue.shift();

  const overlay = ELS.OVERLAYS.achievementUnlocked;
  const nameEl = ELS.OVERLAYS.achievementName;
  const descEl = ELS.OVERLAYS.achievementDescription;

  // Update display info
  nameEl.textContent = achievement.name;
  descEl.textContent = achievement.description || "No description entered yet";

  // Make overlay visible
  overlay.classList.remove("hidden");
  overlay.classList.remove("fade-out");

  // I don't understand this line, but chatGPT says it's to force a reflow
  void overlay.offsetWidth;

  overlay.classList.add("show");

  await wait(DISPLAY_TIME_PER_ACHIEVEMENT);

  overlay.classList.remove("show");
  overlay.classList.add("fade-out");

  /**
   *  This time must be adjusted along with --achievement-display-time
   * in _base.css root:
   */  
  await wait(700);

  overlay.classList.add("hidden");

  isShowingAchievement = false;

  processAchievementQueue();
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * *******************************************************
 * Next Section ******************************************
 * *******************************************************
 */

export function showGameOver(){
  ELS.finalScore.textContent = gameState.score;
  ELS.overlay.classList.add('visible');
}

export function hideGameOver(){
  ELS.overlay.classList.remove('visible');
}

export function populateIncludeExcludeOptions() {
  // Clear previous options
  ELS.SET.DROPS.IESelect.innerHTML = '';
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
    ELS.SET.DROPS.IESelect.appendChild(wrapper);
  });
}

export function populateGuessOptions() {
  if(!gameState.scriptures){
    console.warn("function called before scriptures were loaded");
  }

  // Fill book options
  const books = Object.keys(gameState.scriptures);
  const numBooks = books.length;

  const bookSelectNew = ELS.GAME.DROPS.bookSelect;
  const leftColumn = bookSelectNew.querySelector(".left");
  const rightColumn = bookSelectNew.querySelector(".right");

  // Clear previous options
  leftColumn.innerHTML = '';
  rightColumn.innerHTML  = '';

  for(let i = 0; i < numBooks; ++i){
    let book = books[i];
    const bookOption = document.createElement('div');
    bookOption.classList.add('custom-option');
    bookOption.textContent = book;
    bookOption.dataset.value = book;
    if(i <= Math.floor(numBooks/2)){
      leftColumn.appendChild(bookOption);
    } else {
      rightColumn.appendChild(bookOption);
    }
    
  }
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
    updateStrikeBoxes(gameState.strikes);
}

export function updateBbucksDisplay(){
  const playerData = loadPlayerData();
  const currBbucks = playerData.bomBucks;
  ELS.HEADER.bBucksDisplay.innerHTML = "";
  ELS.HEADER.bBucksDisplay.innerHTML = currBbucks;
}

export function updateLBDisplayDifficulty(){
  ELS.LB.difficultyLabel.textContent = DIFFICULTY_NAMES[gameState.settings.lbDifficulty];
}

export function updateLBDisplayBook(){
  ELS.LB.bookLabel.textContent = BOOK_NAMES[gameState.settings.lbVolume];
}

export function showVerses() {
  const container = ELS.GAME.TXT.verseBox;
  const referenceEl = ELS.GAME.TXT.refReveal;
  const refRevealBtn = ELS.GAME.BTNS.revealReference;

  const resultEl = ELS.GAME.TXT.result;

  ELS.GAME.DROPS.bookSelect.value = '';
  resultEl.textContent = '';

  container.innerHTML = ''; // Clear previous verses
  referenceEl.textContent = ''; // Clear previous reference
  refRevealBtn.textContent = 'Reveal Reference';
  container.scrollTop = 0;

  gameState.currGuessDistance = Infinity;

  gameState.currentSelection = getRandomVerses();

  // Three seperate paragraphs (one for each verse)
  gameState.currentSelection.verses.forEach(verse => {
    const p = document.createElement('p');
    p.textContent = verse.text;
    container.appendChild(p);
  });
}

/**
 * 
 * Runner functions
 * 
 */

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