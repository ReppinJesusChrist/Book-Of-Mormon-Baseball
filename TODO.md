# TODO
- Completed
  - [X] Delay between strike 3 and game over screen
  - [X] Big red X boxes for strikes
  - [X] Display strike count immediately after a strike instead of waiting for next round
  - [X] Make buttons bigger and prettier
  - [X] Implement time selection on main page
  - [X] Make the countdown bar fancier
    - [X] Change color toward red as it counts down
    - [X] Flash for urgent ending
  - [X] Allow book exclusion
    - [X] Create SETTINGS screen
  - [X] Other Books 
    - [X] Create Files for NT and DC
    - [X] Selection Menu
      - [X] UI
      - [X] Make it work
    - [X] Create File for latest GenCon
    - [X] ONLY latest GenCon
  - [X] Show score on Game Over screen
  - [X] Disable timer with Main Menu button
  - [X] Insert hyperlink on reference reveal to allow going to churchofjesuschrist.org to view the chapter and see context
  - [O] Use faces of prophets as players (Is this legal? NO.)
  - [X] Fix "Strikes: text" bug
  - [X] Add Main Menu button to game over screen
  - [X] For each difficulty level
  - [X] Implement a leaderboard
  - [X]   Make a menu to select difficulty
  - [X]   Display high-scores (top 10 [X]; with times[X]) and most recent score in a table
  
- [X] Flash text on screen (not an alert) when a strike is hit ("Strike 1!" etc.)

- [ ] **Styling**
  - [ ] Book of Mormon themed coloring (Maybe wait for Aunt Julie's feedback first)

- [ ] **UI Improvements**
  - [ ] **Settings Screen**
    - [ ] Add spacing between elements
    - [ ] Add multiple tabs for space management
    - [ ] Match styling of multi-check dropdown with other dropdowns
  - [ ] **Leaderboard Screen**
    - [ ] Add display button formatting
      - [ ] Ladder?
      - [ ] Dropdowns?
  - [ ] **Game Screen**
    - [ ] Set fixed size verse display with auto-scrolling as needed
  - [ ] **Main Menu**
    - [ ] Center vertically


- [ ] **Refactoring**
  - [ ] **HTML**
    - [ ] Use the system I was using in ELS to name elements instead of sorting them afterwards in JS (E.G. 'go-btns-menu')
  - [ ] **JS**
    - [X] Add inGame variable to gameState to fix bug with double counting scores
    - [X] Consolidate all main-menu buttons and all restart buttons using inGame
    - [X] Add addAllEventListeners() function to clean up initiation code?
    - [ ] Make seperate EL_ constant objects for buttons [X] and other elements [ ] to make referencing easier (in config.js)???
    - [ ] Run through the whole file and prayerfully record refactoring ideas and insights
    - [ ] Move from BOMB
      - [ ] To ui_manager
        - [ ]
      - [ ] To game_logic
        - [ ] advanceRunners
  - [ ] **CSS**
    - [ ] Pass the code by AI to ask for general style/CSS refactoring advice 


- [ ] **Bugs and Features** 
  - [ ] **Bug fixes**
    - [ ] Timer doesn't work for one round after changing book of scripture in vSelect.
    - [X] High Score double records on strikout
    - [X] Timout doesn't end round
    - [X] New stylesheets don't work in official deployment (github.io)
    - [ ] Make buttons unclickable at appropriate times
      - [X] No reveal buttons available until guess is submitted
      - [ ] Reveal reference ONLY after reveal distance is pressed?
  - [ ] **Features**
    - [ ] Header and footer bars
    - [ ] Offer default difficulty options to make selection easy
    - [ ] Put current independent selection options on a different screen ("Custom Difficulty Level")
    - [ ] Book opening animation for leaving main-menu
    - [ ] Self-drawn runners (build your own team)
    - [ ] Matrix for difficulty selection
      - [ ] Add tool-tip for range details (hover to view)
    - [ ] Graph (scatterplot) of scores over time to show progress
    - [ ] Option to display more rows in Leaderboard
    - [ ] Add PoGP to D&C
    - [ ] Add database support for multiplayer high-score tracking
- [ ] **Misc**
  - [ ] Implement update logic to auto-handle one-time adjustments
  - [ ] Increase searchability online
    - [X] Add favicon.ico
    - [ ] Add metadata
    - [ ] Create sitemap
    - [ ] Use google search console
    - [ ] Create backlinks (increases weight in search engine sorting algorithms)
      - [ ] Share on social media
      - [ ] Share on forums
      - [ ] Share on other websites



- **Sequel/Spinoff ideas**
  - [ ] Same gameplay loop with different minigames/payoffs in the right column
    - [ ] Earn in-game currency based on closeness of answer?
  - [ ] 