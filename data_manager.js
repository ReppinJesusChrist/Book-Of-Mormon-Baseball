import {STANDARD_WORKS_FILE_NAMES, CUSTOM_STUDY_FILE_NAMES, DB_DEBUG, VERSE_NUMS} from "./config.js";
import {gameState} from "./game_logic.js";


  const SUPABASE_URL = "https://twyipibakfjidapvakwx.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_bvxMyzc47F8KIR9a9XkMsQ_CMuYVJNJ";

  const supabaseClient = DB_DEBUG ? supabase.createClient(
    SUPABASE_URL, SUPABASE_ANON_KEY
  ) : null;

const STORAGE_KEYS = {
  playerData: "playerData",
}

export const gameData = {
  allVerses: [],
  topScores: {}
}

const defaultPlayerData = {
  bomBucks: 0
}

let playerData = loadPlayerData();

export function loadPlayerData(){
  const saved = localStorage.getItem(STORAGE_KEYS.playerData);
  return saved ? JSON.parse(saved) : { ...defaultPlayerData};
}

export function savePlayerData(){
  localStorage.setItem(STORAGE_KEYS.playerData, JSON.stringify(playerData));
}

export function addBomBucks(numBucks) {
  let currBucks = parseInt(playerData.bomBucks);
  currBucks += numBucks;

  playerData.bomBucks = currBucks;

  savePlayerData();
}

export function setBomBucks(amount){
  playerData.bomBucks = amount;
  savePlayerData();
}

export function getBomBucks(){
  return playerData.bomBucks;
}



export async function fetchScriptures(volume){
  const response = await fetch(volume);
  return await response.json();
}

export async function loadData() {
  try{
    const volume = gameState.settings.currentVolume;
    let response;
    if(volume === "custom"){
      response = await fetchScriptures(
        // Custom files must be subsets of single volumes right now or UI breaks
        CUSTOM_STUDY_FILE_NAMES[gameState.settings.customStudyPlan]
      );
    } else {
      response = await fetchScriptures(
        STANDARD_WORKS_FILE_NAMES[gameState.settings.currentVolume]
      );
    }

    gameState.scriptures = await response;
    buildVerseList();
    buildChapterIndex();    
  } catch (err) {
    console.error('Error loading verses: ', err);
  }
  
}

export function getRandomVerses() {
  const numDisplayVerses = VERSE_NUMS[gameState.settings.difficulty]
  const maxStartIndex = gameData.allVerses.length - numDisplayVerses;
  const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));

  const selectedVerses = gameData.allVerses.slice(startIndex, startIndex + numDisplayVerses);

  const firstVerse = selectedVerses[0];
  const lastVerse = selectedVerses[selectedVerses.length - 1];
  if (firstVerse.book !== lastVerse.book || 
    firstVerse.chapter !== lastVerse.chapter ||
    !gameState.includedBooks.has(firstVerse.book)) {
    return getRandomVerses(); // Try again recursively if spanning multiple chapters or books
  }

  const reference = `${firstVerse.book} ${firstVerse.chapter}:${firstVerse.verse}-${lastVerse.verse}`;

  return {
    book: firstVerse.book,
    chapter: firstVerse.chapter,
    verses: selectedVerses,
    reference: reference
  }
}

export function  buildChapterIndex() {
  let index = 0;
  gameState.chapterIndexMap = {};
  for (const book in gameState.scriptures) {
    for (const chapter in gameState.scriptures[book]) {
      const key = `${book} ${chapter}`;
      gameState.chapterIndexMap[key] = index++;
    }
  }
}

export function buildVerseList() {
  gameData.allVerses = [];
  for (const book in gameState.scriptures) {
    for (const chapter in gameState.scriptures[book]) {
      const verses = gameState.scriptures[book][chapter];
      verses.forEach(verse => {
        gameData.allVerses.push({
          book,
          chapter,
          verse: verse.verse,
          text: verse.text
        });
      });
    }
  }
}

export async function submitScore(score){
  if(!DB_DEBUG) return;
  const { data, error } = await supabaseClient
    .from('Simple Scores')
    .insert([
      {
        score_obj: score
      }
    ]);

    if(error) {
      console.error("Error submitting score:", error);
    } else {
      console.log("Score submitted to DB successfully!!! Go check it out: ", data);
    }
}

export function fetchScores(){
  let scores;
  if(DB_DEBUG){
    scores = null;
  } else{
    scores = localStorage.getItem("topScores");
  }
  return scores;
}