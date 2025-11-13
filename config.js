export const ANIMATION_TIME_MS = 600; // Time in ms for runner animation
export const TIMER_DURATIONS = {
  unlimited: Infinity,
  leisurely: 180,
  relaxed: 60,
  easy: 30,
  medium: 20,
  hard: 10
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
  GAME_OVER: 'game_over',
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