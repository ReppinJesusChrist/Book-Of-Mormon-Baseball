export const ELS = {
  HEADER: {
    bBucksDisplay: document.getElementById('bomBucksValue'),
  },
  BUTTONS: {
    hideOverlay: document.getElementById('hide-overlay'),
    newRound: document.getElementById('newRound')
  },
  MENU: {
    screen: document.getElementById('menu-screen'),
  },
  GAME: {
    screen: document.getElementById('game-screen'),

    TXT: {
      verseBox: document.getElementById('verses'),
      result: document.getElementById('game-result-reveal-span'),
      refReveal: document.getElementById('game-ref-reveal-span'),
    },
    SB: {   // Scoreboard
      score: document.getElementById("score"),
      round: document.getElementById("round"),
    },
    strikeEffect: document.getElementById('strike-effect-display'),
    strikeEffectText: document.querySelector('#strike-effect-display .strike-text'),
    BTNS: {
      revealDistance: document.getElementById('revealDistance'),
      revealReference: document.getElementById('revealReference'),
      newRound: document.getElementById('newRound'),
      submit: document.getElementById('finalizeGuess'),
    },
    DROPS: {
      bookDropdown: document.getElementById('book-dropdown'),
      bookSelectTrigger: document.getElementById('book-select-trigger'),
      bookSelect: document.getElementById('book-select'),
      chapterDropdown: document.getElementById('game-chapter-dropdown'),
      chapterSelectTrigger: document.getElementById('game-chapter-select-trigger'),
      chapterSelect: document.getElementById('game-chapter-select'),
    },
    diamond: document.getElementById('diamond'),
  },
  LB: {
    screen: document.getElementById('leaderboard-screen'),
    difficultyLabel: document.getElementById('lb-display-difficulty'),
    bookLabel: document.getElementById('lb-display-book'),
    difLadder: document.getElementById('difficultyLadder'),
    BTNS: {
      bookSelect: document.querySelectorAll('.lb-book-option'),
    },
  },
  GO: {
    screen: document.getElementById('game-over-overlay'),

    BTNS: {
      menu: document.getElementById('game-over-menu-btn'),
      restart: document.getElementById('go-btns-tryagain'),
    },
    TXT: {
      finalScore: document.getElementById('final-score'),
      bomBucks: document.getElementById('go-currency-earned-display'),
    }
  },
  SET: {
    screen: document.getElementById('settings-screen'),

    DROPS: {
      difEl: document.getElementById('threshold-value'),
      inEx: document.getElementById("include-exclude-values"),
      chapSelect: document.getElementById('chapterSelect'),
      inExToggle: document.getElementById('include-exclude-toggle'),
      inExDropdown: document.getElementById('include-exclude-dropdown'),
      IESelect: document.getElementById('include-exclude-values'),
    }
  },
  ACHIEVEMENTS: {
    screen: document.getElementById('achievements-screen'),
  },
  STORE: {
    screen: document.getElementById('store-screen'),
  },
  vSelect: document.getElementById('settings-vselect-value'),
  
  overlay: document.getElementById('game-over-overlay'),
  finalScore: document.getElementById('final-score'),
}
