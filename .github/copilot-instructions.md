# Copilot / AI Agent Instructions — Book-of-Mormon-Baseball

Short, actionable guidance for a coding AI to be productive in this repo.

- **Big picture**: This is a small client-side web game (no build step). `index.html` loads a single ES module entrypoint `BOMB.js`, which wires together: data loading (`data_manager.js`), game rules & state (`game_logic.js`), UI updates (`ui_manager.js`), utilities (`helper_functions.js`), timers (`timer.js`) and configuration/constants (`config.js`). The game data lives as JSON files inside the `data/` directory (e.g. `data/bofm.json`) and is fetched at runtime.

- **Entry points & control flow**:
  - `index.html` — static page. The `<script type="module" src="BOMB.js">` at the bottom boots the app.
  - `BOMB.js` — main coordinator: registers DOM event listeners, initializes state, calls `loadData()` and `populate*` UI helpers, and exposes a couple helper functions on `window` for manual testing (`addStrike`, `advanceRunners`). Treat this as the top-level orchestrator.
  - `data_manager.js` — loads JSON via `fetch` and builds `gameData.allVerses` and `gameState.chapterIndexMap`.
  - `game_logic.js` — exports the central mutable `gameState` object and game mechanics (startRound, startGame, endGame, addStrike, spawnRunner, advanceRunners).
  - `ui_manager.js` — DOM rendering and UI helpers (populate options, scoreboards, leaderboard table rows, verse display, runner positioning).

- **Key patterns / conventions**:
  - Central shared state: `gameState` (exported from `game_logic.js`) is the authoritative, mutable game state used across modules. Read and update it directly where necessary.
  - DOM element map: `config.js` exports `ELS`, a collection of frequently used DOM elements (e.g. `ELS.bookSelect`, `ELS.overlay`). When you change element IDs or add UI elements, update `config.js` accordingly.
  - Strings as keys: settings use string keys (e.g. `thresholdSetting`, `currentVolume`) and reference lookup objects in `config.js` (`TIMER_DURATIONS`, `THRESHOLD_ARRAYS`, `STANDARD_WORKS_FILE_NAMES`). Use those constants rather than hard-coded literals.
  - Data selection: `getRandomVerses()` in `data_manager.js` ensures selected verses come from the same book+chapter and are included in `gameState.includedBooks`. Be cautious when changing verse-selection logic (it recurses until a valid selection is found).
  - Exported functions rely on DOM availability at import-time for some values (e.g. `ELS` is computed in `config.js` using `document.getElementById(...)`). The project relies on the script being loaded after DOM elements exist; keep `BOMB.js` as the single entry module in `index.html` and avoid loading modules before DOM readiness.

- **Important integration details**:
  - All JSON files in `data/` are fetched via `fetch` at runtime. Browsers block `fetch` for local `file://` paths — you must run a local HTTP server when developing (examples below).
  - Scores and leaderboard data are persisted in `localStorage` under keys like `topScores` and `Last Score`.
  - `makeScriptureLink()` (in `helper_functions.js`) contains a hardcoded `bookMap` for forming links; if adding new books or changing URL format, update this map and GC session formatting logic.

- **Developer workflows / commands**:
  - Run locally (serve files over HTTP):

    PowerShell example (works in this repo root):
    ```powershell
    # Python (quick):
    python -m http.server 8000

    # Node http-server (if installed globally):
    npx http-server -p 8000

    # Serve (alternative):
    npx serve -p 8000
    ```

    Then open `http://localhost:8000` in the browser. Note: opening `index.html` directly with `file://` will break `fetch` calls.

  - Debugging tips:
    - Use browser DevTools console to inspect DOM and `localStorage` keys. Many helper functions attach UI state to `localStorage` (e.g. `topScores`) so inspect there.
    - `BOMB.js` attaches a couple helpers to `window` (e.g. `addStrike`, `advanceRunners`) for manual triggering from console.
    - If `ELS` properties are `null`, it means `config.js` ran before the DOM elements existed; ensure you run from `index.html` with `type="module"` at the page bottom.

- **Code-change rules and common edits**:
  - When renaming any DOM id referenced in `index.html`, update `config.js` (the `ELS` map) and any direct `getElementById` calls (found mostly in `BOMB.js` and `ui_manager.js`).
  - When adding or renaming volume JSON files, add entries to `STANDARD_WORKS_FILE_NAMES` in `config.js` so `loadData()` can find them.
  - When changing difficulty thresholds, update `THRESHOLD_ARRAYS` and `TIMER_DURATIONS` in `config.js` to ensure UI and logic remain consistent.
  - Avoid moving module code behind conditional import-time DOM queries. Prefer deferring DOM-dependent initialization to `DOMContentLoaded` (BOMB.js already does this).

- **Files to inspect when fixing bugs or adding features** (in order of relevance):
  - `BOMB.js` — app wiring, event listeners, initialization flow
  - `game_logic.js` — central state and core mechanics
  - `ui_manager.js` — rendering, leaderboards, runner positioning
  - `data_manager.js` — data loading and verse selection
  - `helper_functions.js` — utility helpers (timing, DOM helpers)
  - `config.js` — constants, timers, `ELS`
  - `data/*.json` — source content used by the game

- **What not to assume**:
  - There is no bundler or npm scripts in the repo; treat this as a static ES module website.
  - There are no automated tests present. Any behavioral changes should be verified manually in the browser.

If anything above is unclear or you'd like this shortened/expanded or to include quick code-edit examples (e.g. how to add a new book volume or add a new UI control), tell me which area to expand and I will iterate.