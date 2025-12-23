export const DB_DEBUG = false;
export const VERSION = 1; // Will be used in the future for updates. Not used right now.

export const ANIMATION_TIME_MS = 600; // Time in ms for runner animation
export const NUM_LB_SCORES = 10;

/**
 * Use for possible future update to difficulty selection
export const TIMER_OPTIONS = {
  unlimited: Infinity,
  relaxed: 60,
  default: 30,
  hard: 15
};
export const THRESHOLD_OPTIONS = {
  otest:    [25, 50, 100, 250],
  wider:    [7, 12, 25, 50],
  average:  [2, 4, 7, 12],
  pinhead:  [0, 1, 2, 4]
}
*/
export const BOOK_NAMES = {
  bofm: 'Book of Mormon',
  nt: 'New Testament',
  ot: 'Old Testament',
  dc: 'Doctrine and Covenants',
  gc: 'General Conference'
}

export const DIFFICULTY_NAMES ={
  easiest: 'Hit Noah\'s ark',
  easier: 'Hit the side of the stable',
  easy: 'Love thy neighbor',
  average: 'Follow the star',
  hard: 'Enter at the gate',
  harder: 'Hold to the iron rod',
  hardest: 'Find the piece of silver',
  custom: 'Custom'
}

export const TIMER_DURATIONS = {
  easiest: Infinity,
  easier: Infinity,
  easy: 180,
  average: 60,
  hard: 30,
  harder: 20,
  hardest: 10
}; // Timer durations for different difficulties

export const THRESHOLD_ARRAYS = {
  easiest: [25, 50, 100, 250],
  easier: [12, 25, 50, 100],
  easy: [7, 12, 25, 50],
  average: [4, 7, 12, 25],
  hard: [2, 4, 7, 12],
  harder: [1, 2, 4, 7],
  hardest: [0, 1, 2, 4]
}
export const STANDARD_WORKS_FILE_NAMES = {
  bofm: 'data/bofm.json',
  ot: 'data/ot.json',
  nt: 'data/nt.json',
  dc: 'data/dc.json',
  gc: 'data/gc.json'
};

export const CUSTOM_STUDY_FILE_NAMES = {
  bofm_isaiah: 'data/bofm_isaiah.json',
}

export const GAME_STATES = {
  MENU: 'menu',
  IN_GAME: 'in_game',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard'
}
export const BASE_POSITIONS = {
  home:  { left: 50,  top: 85 },
  first: { left: 85, top: 50  },
  second:{ left: 50,  top: 15   },
  third: { left: 15,   top: 50  },
  back_home: { left: 50,  top: 85 } // Back to home for scoring
};
export const ELS = {
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
      result: document.getElementById('result'),
      distReveal: document.getElementById('distance'),
      refReveal: document.getElementById('reference'),
    },
    SB: {   // Scoreboard
      score: document.getElementById("score"),
      round: document.getElementById("round"),
      strikes: document.getElementById("strikes"),
    },
    strikeEffect: document.getElementById('strike-effect-display'),
    strikeEffectText: document.querySelector('#strike-effect-display .strike-text'),
    distanceReveal: document.getElementById('distance'),
    referenceReveal: document.getElementById('reference'),
    BTNS: {
      revealDistance: document.getElementById('revealDistance'),
      revealReference: document.getElementById('revealReference'),
      newRound: document.getElementById('newRound'),
      submit: document.getElementById('finalizeGuess'),
    },
    DROPS: {
      bookDropdown: document.getElementById('book-dropdown'),
      bookSelect: document.getElementById('book-select'),
      chapterSelect: document.getElementById('chapterSelect'),
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
  vSelect: document.getElementById('settings-vselect-value'),
  
  chapterSelect: document.getElementById('chapterSelect'),
  overlay: document.getElementById('game-over-overlay'),
  finalScore: document.getElementById('final-score'),
}

