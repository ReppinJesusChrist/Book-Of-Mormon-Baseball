export const DB_DEBUG = false;
export const VERSION = 1; // Will be used in the future for updates. Not used right now.

export const ANIMATION_TIME_MS = 600; // Time in ms for runner animation
export const NUM_LB_SCORES = 10;

export const SCREENS = {
  // Implement later as part of refactoring
}

export const BOOK_NAMES = {
  bofm: 'Book of Mormon',
  nt: 'New Testament',
  ot: 'Old Testament',
  dc: 'Doctrine and Covenants',
  gc: 'General Conference'
}

export const DIFFICULTY_NAMES ={
  custom: 'Custom',
  easiest: 'Hit Noah\'s ark',
  easier: 'Hit the side of the stable',
  easy: 'Love thy neighbor',
  average: 'Follow the star',
  hard: 'Enter at the gate',
  harder: 'Hold to the iron rod',
  hardest: 'Find the piece of silver',
  bePerfect: 'Be ye therefore perfect'
}

// Timer durations for different difficulties
export const TIMER_DURATIONS = {
  easiest: 180,
  easier: 90,
  easy: 60,
  average: 30,
  hard: 20,
  harder: 15,
  hardest: 10,
  bePerfect: 7
};

/* 
 * Distance thresholds for different difficulties.
 * [Home Run, Triple, Double, Single]
 * A '-1' means it is impossible to get that type of hit.
 */ 
export const THRESHOLD_ARRAYS = {
  easiest: [25, 50, 100, 250],
  easier: [12, 25, 50, 100],
  easy: [7, 12, 25, 50],
  average: [3, 7, 12, 25],
  hard: [1, 3, 7, 12],
  harder: [0, 1, 3, 7],
  hardest: [-1, 0, 1, 3],
  bePerfect: [-1, -1, 0, 1]
}

/*
 * How many verses to display for each difficulty
 */
export const VERSE_NUMS = {
  easiest:   5,
  easier:    4,
  easy:      3,
  average:   3,
  hard:      3,
  harder:    2,
  hardest:   2,
  bePerfect: 1
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
  LEADERBOARD: 'leaderboard',
  ACHIEVEMENTS: 'achievements',
  STORE: 'store'
}
export const BASE_POSITIONS = {
  home:  { left: 50,  top: 85 },
  first: { left: 85, top: 50  },
  second:{ left: 50,  top: 15   },
  third: { left: 15,   top: 50  },
  back_home: { left: 50,  top: 85 } // Back to home for scoring
};

// Rows represent score thresholds, cols represent difficulty levels:
// EST = Easiest, ESR = Easier, ESY = Easy, DEF = Default
// HRD = Hard, HDR = Harder, HST = Hardest, BYTP = Be ye therefore perfect
export const SCORING_MATRIX = [
  // --------------  CST    EST,    ESR,    ESY,    DEF,   HRD,    HDR,   HST,   BYTP                 
  /*0 Points*/      [0,     0,      0,      0,      0,     0,      0,     0,     0],
  /*1-2 Points*/    [0,     1.00,   1.50,   2,      3,     5,      8,     13,    21],
  /*3-6 Points*/    [0,     1.10,   2.00,   3,      5,     8,      13,    20,    42],
  /*7-11 Points*/   [0,     1.20,   2.50,   4,      7,     11,     18,    27,    84],
  /*12-17 Points*/  [0,     1.30,   3.00,   5,      9,     14,     23,    34,    168],
  /*18-26 Points*/  [0,     1.40,   3.50,   6,      11,    17,     28,    41,    336],
  /*27-49 Points*/  [0,     1.50,   4.00,   7,      13,    20,     33,    48,    672],
  /*50+ Points*/    [0,     1.70,   5.00,   9,      15,    27,     38,    55,    1344],
];

export const SCORE_TO_SI_MATRIX = [
  { minScore: 0, SI_Value: 0 },
  { minScore: 1, SI_Value: 1 },
  { minScore: 3, SI_Value: 2 },
  { minScore: 7, SI_Value: 3 },
  { minScore: 12, SI_Value: 4 },
  { minScore: 18, SI_Value: 5 },
  { minScore: 27, SI_Value: 6 },
  { minScore: 50, SI_Value: 7 },
];

export const DIFF_TO_DI_MATRIX = [
  {easiest: 0},
  {easier: 1},
  {easy: 2},
  {average: 3},
  {hard: 4},
  {harder: 5},
  {hardest: 6},
  {bePerfect: 7}
];

export const ACHIEVEMENTS = {

}

