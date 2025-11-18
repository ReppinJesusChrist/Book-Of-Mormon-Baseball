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

export const TIMER_DURATIONS = {
  otest: Infinity,
  barn: Infinity,
  wider: 180,
  wide: 60,
  average: 30,
  narrow: 20,
  pinhead: 10
}; // Timer durations for different difficulties
export const THRESHOLD_ARRAYS = {
  otest: [25, 50, 100, 250],
  barn: [12, 25, 50, 100],
  wider: [7, 12, 25, 50],
  wide: [4, 7, 12, 25],
  average: [2, 4, 7, 12],
  narrow: [1, 2, 4, 7],
  pinhead: [0, 1, 2, 4]
}
export const STANDARD_WORKS_FILE_NAMES = {
  bofm: 'data/bofm.json',
  ot: 'data/ot.json',
  nt: 'data/nt.json',
  dc: 'data/dc.json',
  gc: 'data/gc.json'
};
export const GAME_STATES = {
  MENU: 'menu',
  IN_GAME: 'in_game',
  SETTINGS: 'settings',
  LEADERBOARD: 'leaderboard'
}
export const BASE_POSITIONS = {
  home:  { left: 50,  top: 90 },
  first: { left: 90, top: 50  },
  second:{ left: 50,  top: 10   },
  third: { left: 10,   top: 50  },
  back_home: { left: 50,  top: 90 } // Back to home for scoring
};
export const ELS = {
  BUTTONS: {
    hideOverlay: document.getElementById('hide-overlay'),
    newRound: document.getElementById('newRound')
  },
  LB: {
    difficultyLabel: document.getElementById('lb-display-difficulty'),
    difLadder: document.getElementById('difficultyLadder')
  },
  GO: {
    BTNS: {
      menu: document.getElementById('game-over-menu-btn'),
      restart: document.getElementById('try-again-btn')
    }
  },
  vSelect: document.getElementById('volume-select-value'),
  toggle: document.getElementById('include-exclude-toggle'),
  IESelect: document.getElementById('include-exclude-values'),
  dropdown: document.getElementById('include-exclude-dropdown'),
  bookSelect: document.getElementById('bookSelect'),
  chapterSelect: document.getElementById('chapterSelect'),
  overlay: document.getElementById('game-over-overlay'),
  finalScore: document.getElementById('final-score'),
}
export const BUTTON_ELS = {
  hideOverlay: document.getElementById('hide-overlay'),
  newRound: document.getElementById('newRound')
}