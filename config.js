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
// EST = Easiest, ESR = Easier, ESY = Easy, AVG = Average
// HRD = Hard, HDR = Harder, HST = Hardest, BYTP = Be ye therefore perfect
export const SCORING_MATRIX = [
  // --------------  CST    EST,    ESR,    ESY,    AVG,   HRD,    HDR,   HST,   BYTP                 
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
  /*
   *  Achievements for scoring at least X points on a given difficulty in a single game
   *  Names are placeholders for now. I'm hoping to give each a fun, creative name
   */ 
  scoreXonD: {
    sectionHeader: "Single Round Scores By Difficulty",
    difficultyArrays: {
      easiest: [
        { 
          name: "Easiest-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Easiest-3-point",
          requiredPoints: 3,
        },
        {
          name: "Easiest-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Easiest-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Easiest-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Easiest-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Easiest-100-point",
          requiredPoints: 100,
        },
      ],
      easier: [
        { 
          name: "Easier-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Easier-3-point",
          requiredPoints: 3,
        },
        {
          name: "Easier-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Easier-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Easier-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Easier-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Easier-100-point",
          requiredPoints: 100,
        },
      ],
      easy: [
        { 
          name: "Easy-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Easy-3-point",
          requiredPoints: 3,
        },
        {
          name: "Easy-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Easy-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Easy-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Easy-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Easy-100-point",
          requiredPoints: 100,
        },
      ],
      average: [
        { 
          name: "Average-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Average-3-point",
          requiredPoints: 3,
        },
        {
          name: "Average-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Average-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Average-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Average-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Average-100-point",
          requiredPoints: 100,
        },
      ],
      hard: [
        { 
          name: "Hard-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Hard-3-point",
          requiredPoints: 3,
        },
        {
          name: "Hard-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Hard-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Hard-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Hard-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Hard-100-point",
          requiredPoints: 100,
        },
      ],
      harder: [
        { 
          name: "Harder-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Harder-3-point",
          requiredPoints: 3,
        },
        {
          name: "Harder-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Harder-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Harder-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Harder-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Harder-100-point",
          requiredPoints: 100,
        },
      ],
      hardest: [
        { 
          name: "Hardest-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "Hardest-3-point",
          requiredPoints: 3,
        },
        {
          name: "Hardest-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "Hardest-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "Hardest-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "Hardest-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "Hardest-100-point",
          requiredPoints: 100,
        },
      ],
      bePerfect: [
        { 
          name: "BePerfect-1-point",
          requiredPoints: 1,
        }, 
        {
          name: "BePerfect-3-point",
          requiredPoints: 3,
        },
        {
          name: "BePerfect-7-point",
          requiredPoints: 7,
        }, 
        {
          name: "BePerfect-12-point",
          requiredPoints: 12,
        }, 
        {
          name: "BePerfect-25-point",
          requiredPoints: 25,
        }, 
        {
          name: "BePerfect-50-point",
          requiredPoints: 50,
        }, 
        {
          name: "BePerfect-100-point",
          requiredPoints: 100,
        },
      ],
    }
  },

  /*
   *  Achievements for earning at least X BomBucks in a single game on any difficulty
   *  Names are placeholders for now. I'm hoping to give each a fun, creative name
   */ 
  bbucksOneRound: {
    sectionHeader: "Single Round BomBucks Earned",
    achievementArray: [
        { 
          name: "OneRoundBbucks-1",
          requiredBucks: 1,
        }, 
        { 
          name: "OneRoundBbucks-7",
          requiredBucks: 7,
        },
        { 
          name: "OneRoundBbucks-50",
          requiredBucks: 50,
        },
        { 
          name: "OneRoundBbucks-250",
          requiredBucks: 250,
        },
        { 
          name: "OneRoundBbucks-500",
          requiredBucks: 500,
        },
        { 
          name: "OneRoundBbucks-K",
          requiredBucks: 1000,
        },
        { 
          name: "OneRoundBbucks-10K",
          requiredBucks: 10000,
        },
    ],
  },
  

  /*
   *  Achievements for scoring at least X points on a given difficulty in a single game
   *  Names are placeholders for now. I'm hoping to give each a fun, creative name
   */ 
  totalBbucks: {
    sectionHeader: "Total BomBucks Saved",
    achievementArray: [
    { 
      name: "TotalBbucks-10",
      requiredBucks: 1,
    }, 
    { 
      name: "TotalBbucks-100",
      requiredBucks: 7,
    },
    { 
      name: "TotalBbucks-250",
      requiredBucks: 50,
    },
    { 
      name: "TotalBbucks-K",
      requiredBucks: 250,
    },
    { 
      name: "TotalBbucks-5K",
      requiredBucks: 500,
    },
    { 
      name: "TotalBbucks-20K",
      requiredBucks: 1000,
    },
    { 
      name: "TotalBbucks-One-Million!",
      requiredBucks: 10000,
    },
  ]
  },
  
}

