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
    - [X] Make a menu to select difficulty
    - [X]   Display high-scores (top 10 [X]; with times[X]) and most recent score in a table
  - [X] Flash text on screen (not an alert) when a strike is hit ("Strike 1!" etc.)
  - [X] Wire buttons for store and achievements pages
  - [X] Make chapter dropdowns auto-select chapter one when book is selected

- [ ] **Session Queue**


- [ ] **Weekly Goal (3/30/26 - 4/5/26)**
  - [ ] Achievements
    - [ ] Create basic system
      - [X] Store requirements in config.js for basic set of achievements
        - [X] Score X on [difficulty]
        - [X] Earn X BomBucks in one round
        - [X] Earn X BomBucks total
      - [ ] Check for accomplishment at appropriate times
        - [X] XonD
        - [ ] BomBucks (I think both are checked in the same place)
      - [X] Display them on the Achievements page
      - [X] Mark them as completed on Ach. page when completed
    - [ ] Create an overlay for when an achievement is completed
  - [ ] Store
    - [ ] Add options to the store to buy different colors of runners
    - [ ] Allow switching colors in the store for now (different screen later?)
  - [ ] Bug/formatting fixes
    - [ ] Finish migrating settings dropdowns completely to custom ddowns and remove old ones
    - [ ] Fix custom ddowns to show selected option instead of default text
    - [ ] Make settings screen presentable enought to push
  - [ ] PUSH TO GITHUB SITE!!! 

- [ ] **Major Projects**
  - [ ] Mobile Formatting
  - [ ] Database tracking
  - [ ] Custom study plans debugging/polish
  - [ ] Statistics/Analytics
  - [ ] Achievements
  - [ ] Better artwork
  - [ ] Better gameplay loop (currency/vanities, progress over time, unlockable runners/themes)
  - [ ] Implement update system (start with playerData?)

- [ ] **Styling**
  - [ ] Book of Mormon themed coloring (Maybe wait for Aunt Julie's feedback first)

- [ ] **UI Improvements**
  - [ ] **General**
    - [ ] Adjust all elements to fit on a single, non-scrolling screen
    - [ ] Custom Dropdowns
      - [ ] Sync width between content and buttons
  - [ ] **Settings Screen**
    - [ ] Add multiple tabs for space management
    - [ ] Match styling of multi-check dropdown with other dropdowns
    - [ ] Fix difficulty dropdown
      - [ ] Make display info MUCH shorter
      - [ ] Show the detailed info in other ways (hover, or info button. Maybe both?)
  - [ ] **Leaderboard Screen**
    - [ ] Add display button formatting
  - [ ] **Game Screen**
    - [ ] Set fixed size verse display with auto-scrolling as needed
    - [ ] Adjustable verse text-size slider
    - [ ] Diamond and Leaderboard side-by-side (at bottom of screen), not vertical
    - [ ] Auto-reveal distance, reference requires button press. (remove distance button)
    - [ ] auto scroll to top when verses load
    - [ ] Add bottom fade to indicate scrollability

  - [ ] **Main Menu**
    - [X] Center vertically (even after out-and-back)
    - [ ] Buttons all same size


- [ ] **Refactoring**
  - [ ] **HTML**
    - [ ] Use the system I was using in ELS to name elements instead of sorting them afterwards in JS (E.G. 'go-btns-menu')???
  - [ ] **JS**
    - [ ] Run through the whole file and prayerfully record refactoring ideas and insights
    - [X] Move ELS into its own file (JSON instead of .js maybe?)
    - [X] Adjust all references to ELS to use the new file instead of the old reference from config.js
  - [ ] **CSS**
  - [ ] **Combo**
    - [ ] Convert all native selects to custom .dropdowns
    - [ ] Auto-populate setting-volume-dropdown-options on startup based on a const list to make adding new/custom options easier in the future
    - [ ] Update page button class names to include "-page" to increase consistency and allow for page specific styling in the future


- [ ] **Bugs and Features** 
  - [ ] **Bugs**
    - [X] Styling of Home Page changes after leaving and returning
    - [ ] Custom Dropdowns
      - [ ] Make Custom book dropdown display name of selected book when choice is made (right now it always says "Book:")
    - [ ] Custom Study Plans
      - [ ] Fix ranges/distances to include entire BOM, not just chapters included in plan.
    - [X] Disable dropdowns until next round after timeout or first guess
    - [X] Double strike when you guess immediately after the timer runs out
    - [X] Make chapter dropdowns auto select chapter one when book is selected
    - [ ] Fix settings volume select dropdown (finish migrating to custom dropdown)
  - [ ] **Features**
    - [ ] Add nav-bar to header
    - [ ] Offer default difficulty options to make selection easy
    - [ ] Implement Custom Difficulty
      - [ ] Put current independent time and range selection options on a different screen
      - [ ] Wire it in to score tracking
    - [ ] Book opening animation for leaving main-menu
    - [ ] Self-drawn runners (build your own team)
    - [ ] Matrix for difficulty selection?
      - [ ] Add tool-tip for range details (hover to view)
    - [ ] Separate Statistics from Leaderboard
      - [ ] Graph (scatterplot) of scores over time to show progress
      - [ ] Track strikes to aid with study
    - [ ] Option to display more rows in Leaderboard
    - [ ] Add PoGP to D&C
    - [ ] Add database support for multiplayer high-score tracking
    - [ ] Add custom study patterns
      - [ ] Option for user imports according to a pattern?
    - [ ] Show difficulty on Game Over screen
    - [ ] Combine Guess & Reveal Reference buttons (switch between displaying and hiding each as needed)
- [ ] **Misc**
  - [ ] Walk through all auto-recommendations in dev-tools and research them. Fix if reasonable.
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

**Misc Info**
Ideal Dependency Flow (no circular imports)
config.js
      ↓
game_logic.js
      ↓
ui_manager.js
      ↓
handlers.js
      ↓
BOMB.js   (root, glue)