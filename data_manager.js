import {gameState} from "./game_logic.js";

export const gameData = {
    allVerses: []
}

export async function fetchScriptures(volume){
    const response = await fetch(volume);
    return await response.json();
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

export function buildVerseList(scriptures) {
  gameData.allVerses = [];
  for (const book in scriptures) {
    for (const chapter in scriptures[book]) {
      const verses = scriptures[book][chapter];
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