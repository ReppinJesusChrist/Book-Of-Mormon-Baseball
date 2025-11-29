import {STANDARD_WORKS_FILE_NAMES} from "./config.js";
import {gameState} from "./game_logic.js";

export const gameData = {
    allVerses: []
}

export async function fetchScriptures(volume){
    const response = await fetch(volume);
    return await response.json();
}

export async function loadData() {
  try{
    const response = await fetchScriptures(STANDARD_WORKS_FILE_NAMES[gameState.settings.currentVolume]);
    gameState.scriptures = await response;

    buildVerseList();
    buildChapterIndex();    
  } catch (err) {
    console.error('Error loading verses: ', err);
  }
  
}

export function getRandomVerses() {
  const maxStartIndex = gameData.allVerses.length - gameState.settings.numDisplayVerses;
  const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));

  const selectedVerses = gameData.allVerses.slice(startIndex, startIndex + gameState.settings.numDisplayVerses);

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