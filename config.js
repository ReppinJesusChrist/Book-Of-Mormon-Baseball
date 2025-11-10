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