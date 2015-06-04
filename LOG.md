
---------------------------------------------------------------
#### LATER (Technical) »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
- 'upgrade Mongolab'
- 'node jade view engine'
- 'unit testing (Jest / Jasmine)'
---------------------------------------------------------------
- 'on-before-unload clear + restore state (socket/cookies?)'
- 'gulp asset management + optimization (fonts, images)'
- 'checkout CodeClimate, SpeedCurve, GTMetrix'
- 'error pages (h5bp)'
---------------------------------------------------------------



---------------------------------------------------------------
#### LATER (Features) »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
- 'tools: buyout calculator'
- 'roster: minor team roster/lineup'
- 'roster: special teams (PP1/PP2/PK1/PK2) layout + logic'
- 'share: message-board sharing widget (dynamic image generator)'
- 'team-select: fix svg + static team list order (COL/CLB+NAS/NJD)'
- 'minimum browser spec check + splash (zepto)'
- 'static dropData to state [?]'
- 'team logo strip on team-select hover (quicker team change)'
- 'pre-cache team + player images on team select' [really?]
---------------------------------------------------------------



---------------------------------------------------------------
## BUGS »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
- 'FF: dragend sticking-hover issue (https://bugzilla.mozilla.org/show_bug.cgi?id=666864)'
- 'Backspace key refresh/back-page-nav...Grr!'
- 'Occasional missed remove-player tile dragend'
- 'Occasional missed list-item dragstart'
- 'Tabbing makes actions tabs disappear'
- 'tile trade drag-end hover sticking + not queuing (BN/Hodgson)'
---------------------------------------------------------------



## Grid
---------------------------------------------------------------
- 'IR players cap calculation (count, payroll)'


## Panels
---------------------------------------------------------------
- 'obfuscated list slides into view on scroll-end' [?]
- 'player details/info icon click/hover' [?]
- 'drag vertical reorder/pos'
- 'increase collapse click area'
---------------------------------------------------------------


## Roster
---------------------------------------------------------------
- 'obfuscated group slides into view (list-item-clicked)'
- 'player: swap-tiles drop action'
- 'player button/icons/menu: [ info | edit | buyout | +IR | +BN ]'
---------------------------------------------------------------


## Payroll
---------------------------------------------------------------
- 'fade-in group title years on scroll-end (if header not visible)'
- 'player details/info on click/hover'
- 'collapsable player groups' [?]
- 'year column sorting'
- 'draft picks summary'
---------------------------------------------------------------


## Options
---------------------------------------------------------------
- 'cleanup interaction + veritcal layout'
- 'payroll: show user actions'
- 'trades: trade summary layout + logic [or just actions summary?]'
- 'make reusable component'
- 'year ticker [2015-16 ⇵]
- 'status icon legend'
- 'clear roster'
---------------------------------------------------------------


## CapStats
---------------------------------------------------------------
- 'obfuscated slides into view (scroll-end + !dragging)'
- 'slides-up if covering active tiles while dragging'
---------------------------------------------------------------


## GM Overview 🏆
---------------------------------------------------------------
- 'actions summary panel layout + logic (above forwards)'
- 'team change w/ active trades: notify trading disabled'
  - 'Trades have been disabled because you have active trades w/ another team (XXX)'
  - 'Would you like to reset trade? [Yes]'
  - 'Would you like to switch back to XXX? [Yes]'
- 'roster player added/team conflict: notify mode-changed + trading disabled'
  - 'Trades have been disabled because you are in all-star mode'
- 'visual summary:'
  - 'trade breakdowns'
  - 'contract buyouts'
  - 'created/signed players'
  - 'injured/IR + benched/BN players'
---------------------------------------------------------------


## Transactions
---------------------------------------------------------------
- 'free-agents panel (data + layout + logic)'
---------------------------------------------------------------
- 'create: add salary row button'
- 'create: players goto F/D/G panel (makes sense)'
---------------------------------------------------------------
- 'trade: asset + salary summary breakdown'
- 'trade: cap violation/overage check + warning'
- 'trade: league player select salary info [ X. Xxx (0.000) ]'
---------------------------------------------------------------


##### Share
---------------------------------------------------------------
- 'confirm active team (team mismatch / mixed roster)'
- 'twitter, facebook + copy text version buttons'
- 'build text roster w/ actions summary + button logic'
---------------------------------------------------------------


## Footer
----------------------------------------------------------------------------
 What's Next? ⋮ Credits ⋮ Twitter    some rights reserved ⋮ CapCRUNCH © 2015
----------------------------------------------------------------------------


## Refactor
---------------------------------------------------------------
- 'immutable js + revamp object + array system (undo/redo/etc)'

- 'splicing the teamData players on trades is not good. Refactor.'
- 'change view logic does not need to be that complex...'
- 'convert array push + splice to direct/fixed size array ops'
- 'convert alt-lines reverse loop to forward [0,1,2..]'
---------------------------------------------------------------
- 'setup roster + player objects w/ 1-to-1 pairty'
  - 'replace { status : empty } w/ proper player objects (static/roster.js)'
  - 're-verify db-data player objects...'
- 'initialize arrays using literals [1,2,3.4,true]'
- 'stop storing objects in array... just use objects {{},{{},{},{}}} not {[{},{},{}],{[{},{},{}]}}'
- 'map max-size of all objects (ex: BN or IR can only be 8 nodes each, set them up that way instead of array manipulation!)'
- 'distill + specify functions + homogenize argument data (monomorphic code #parody)'
---------------------------------------------------------------


---------------------------------------------------------------
#### NOW »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» [v0.9.3] »
---------------------------------------------------------------
- 'share: cleanup layout + x-browser issues'
- 'gm-overview: basic functionality (view + undo actions)'
- 'disabled actions panel copy + layout'
  - 'trades only, not create player'
- 'disabled transaction button state (after action executes)'
---------------------------------------------------------------
- 'free agents: list + add UFA players'
  - 'filter by team'
  - 'sort by previous salary'
- 'data: draft-picks (data + layout + logic)'
---------------------------------------------------------------
- 'notifications: cleanup + global/fixed-pos user notify (slide/fade)'
  - 'nav: tools link (coming soon hover)'
  - 'better notification messages (acquired players, UFAs, etc)'
- 'onboard: drag-n-drop/trades-create/change-team splashes'
- 'cap stats menu (¿header/panels/capStats?)'
---------------------------------------------------------------
- 'footer logic + layout'
- 'React initial DOM loading SSR'
- 'back/forward browser action management'
- 'basic mobile support (view shared roster + payroll)'
- 'player image pre-loading (slow connection factor...)'



---------------------------------------------------------------
#### READY »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
- 'small bug fixes (see log)'
- 'salary cap to 71.5M'
- 'style RFA/UFA list item values'
- 'trades: can queue RFA players'
- 'trades: RFA player sorting'
- 'trades: UFA list items disabled / RFA enabled'
- 'FF/IE: tiles bg opacity bug'
- 'set expires headers caching'
- 'share: post-share load issues (NaN player count)'
- '+/- FA roster players increment player count, not payroll'
- '+/- BN players increment player count + payroll'
- '+/- payroll alternating rows w/ trades'
- 'cleanup team select grid + add active team marker (blue dot)'
- 'update list/roster/trade/capstats display logic w/ new contract data (player.capnum)'
- 'Amazon Cloudfront CDN for image + script assets'
- 'trades: show RFA/UFA status'
- 'payroll: update layout + data update tweaks'
- 'payroll data: simplify player contract arrays'
- 'payroll data: add cap.playerCount to team objects'
- 'payroll data: update sort order of inactive players'
- 'payroll: update display logic w/ new contract data'
- 'payroll: show full player contracts (pre-current year)'
- 'payroll: show cap number + cap hit columns'
- 'payroll: disable other contracts group'
- 'payroll data: update w/ full player contracts'
- 'team load playerData diff'
  * playerData (inplay/benched/ir/cleared/traded/acquired/created)
- 'normalize player object status/action props'
  * 'player: action (created/acquired/traded/queued/buyout)'
  * 'player: status (active/injured || inplay/ir/benched)'
  * 'tile: status (empty/inplay/ir/benched)'
- 'cleanup payroll'
- 'scrub css selectors + tune visual performance'
- 'bugfix - CHROME: dragover sticking-hover issue'
- 'bugfix - FF: panel scrollbars (windows)'
- 'slim/space-saving alt-lines (no player image/jersey)'
- 'setup new alt-line transitions + tile styles'
- 'optimize player + team png images'
- 'lighten-up background image'
- 'fade-in app on load'
- 'add image CDN (cloudinary.com)'
- 'fix scrollTo only working on Webkit'
- 'cleanup panel + view scroll reset on view change'
- 'cleanup notify + action messages timing'
- 'block acquired players on trades (one-way only)'
- 'optimize fontawesome glyph icons'
- 'refactor core + trade logic'
- 'cleanup player tiles + remove-player transitions'
- 'ease-out transition: panels, roster, actions'
- 'refactor view state logic'
- 'normalize header team select display component'
- 'add full screen team-select splash intro + loading view'
- 'cleanup + distill cap stats into component'
- 'cleanup ui.js'
- 'cleanup active drag data + grid-highlight logic'
- 'share roster close button + text-only output link'
- 'add error messages to props messages object'
- 'minimize player panel rendering + list item display logic'
- 'minimize inactive payroll rendering activity'
- 'cleanup change/update view (roster/payroll) logic'
- 'setup player item/tile drop events for IR/BN-target'
- 'fix player tile duplicate IR/B status tag issue'
- 'cleanup shared-roster alt-line loading transitions'
- 'remove bench references from remove player process'
- 'add goalie BN alt line'
- 'injured-reserve + press-box lines layout + logic'
- 'cap stats overage/negative cap space visual queue'
- 'fix React props mutation warnings/issues'
- 'distill roster-grid/player-tile render logic'
- 'move player-list name formatting logic to create-player'
- 'cleanup create-player confirm transition timing'
- 'trades-panel add player button active state'
- 'hide create-player add salary button'
- 'add data event to trades drop-area'
- 'remove create-player firstname requirement'
- 'fix create player salary calc bug + update inactive list item logic'
- 'cleanup player-list layout'
- 'fix player-list mouse-leave sticking-hover issue'
- 'upgrade Heroku + setup server monitoring'
- 'logic + layout refresh (details in LOG.md) [v0.9.0]'
- 'add google analytics script'
- 'cap stats menu + clear/reset roster logic'
- 'setup production server w/ beta testing'
- 'update acquired player team attribute'
- 'player tile action/status icons + block right-click'
- 'setup feature detection (Modernizr)'
- 'cleanup banner + tooltip x-browser consistency'
- 'cleanup scrollbar + draggable x-browser consistency'
- 'update payroll view'
- 'new ui: update transactions + share panels [v0.8.7]'
- 'cleanup player tile layout + transitions'
- 'implement new logo + roster layout [v0.8.6]'
- 'cleanup panel player-list details'
- 'illustrator new logo'
- 'photoshop new interface'
- 'panel expandable logic + team change scroll reset [v0.8.2]'
- 'team/player change panel loading transition [v0.8.1]'
- 'update share: only store active team created players + trades'
- 'disable all-star-mode roster additions on trade-player-select'
- 'trade players feature update (details in LOG.md) [v0.8.0]'
- 'adjust trade player panel + item transition timing'
- 'reset active-trade data on global team-select change'
- 'cleanup + distill player/roster components'
- 'update trade-team-select disable/add traded + acquired players'
- 'update salary sorting (...inactive players w/ 0.000)'
- 'update Payroll w/ player.actions flags (default: hide acquired players)'
- 'trade player player-list insert item logic'
- 'player object ui-flags array ["traded", "created", etc]'
- 'trade player player-list hide item logic'
- 'trade player panel layout logic + validation [v0.7.6]'
- 'trade player execution logic'
- 'cleanup React warnings + mutation bugs'
- 'trade player panel add-user-team-player logic + drag events [v0.7.5]'
- 'trade player player-list insert + remove/hide logic'
- 'cleanup/distill trade player state management'
- 'trade player panel add-league-team-player logic [v0.7.4]'
- 'initial trade player layout + logic + sockets [v0.7.3]'
- 'create player panel layout + styles [v0.7.2]'
- 'create player panel + logic [v0.7.1]'
- 'initial transactions panel/tabs + create player logic [v0.7.0]'
- 'add timezone config to node log timers + uptick mongoose rev'
- 'migrate share-roster to prod + setup mongo collection'
- 'share roster user dialog [v0.6.6]'
- 'share roster input validation [v0.6.5]'
- 'load team + roster error notifications [v0.6.4]'
- 'generate unique roster id on mongo-save [v0.6.3]'
- 'update codebase to accommodate new share roster feature [v0.6.2]'
- 'initial share-roster logic + db model [v0.6.1]'
- 'payroll player-status icon labels'
- 'cleanup payroll table, add UFA/RFA cell styles'
- 'cap stats calculator panel + logic [v0.6.0]'
- 'style bench/remove-player hover'
- 'style team-select dropdown'
- 'roster grid tile removal [v0.5.6]'
- 'add free agents panel component placeholder'
- 'swap font-awesome icons for arrows + pointers'
- 'roster grid tile movement drag-n-drop [v0.5.5]'
- 'cleanup roster grid highlighting'
- 'cleanup react player data management (stop passing data attributes)'
- 'http-auth user authentication'
- 'light-up roster grid tiles onDragStart/Over [v0.5.4]'
- 'setup team-specific player item hiding [v0.5.3]'
- 'fix missed drag / item stays selected bug'
- 'hotfix item drag bg-gradient + inner-click drag event blocking'
- 'add player list item drag handles [v0.5.2]'
- 'fix DnD event timers [v0.5.1]'
- 'Update Data Utility + Database Schema + Player Data (details in LOG.md) [v0.5.0]'
- 'update player data (ID, TEAM, POS, AGE, NATION)'
- 'backup/update dev + prod DB'
- 'initial roster grid player item data management [v0.4.4]'
- 'initial player list drag-n-drop'
- 'distill roster-menu player-list panels into sub-components [v0.4.3]'
- 'cleanup production build + setup payroll dynamic height [v0.4.2]'
- 'setup gzip compression'
- 'Minor UI Cleanup (details in LOG.md) [v0.4.1]'
- 'disable user-select'
- 'roster share textbox placeholder logic'
- 'swap jQuery out for (lighter) Zepto'
- 'replace core.js + utils.js w/ ui.js'
- 'show `Select Team ⤴︎` reminder when clicking Payroll before selecting team'
- 'distill roster-menu into sub-component panels (share, trade, create)'
- 'setup Heroku gulp postinstall + restore /public .gitignore'
- 'setup Heroku server w/ production url'
- 'convert UI to React (team-select-menu, payroll, player-panels) [v0.4.0]'
- 'socket.io pipeline/fetching [v0.3.8]'
- 'migrate JSON + setup model/schema (MongoDB, Mongoose) [v0.3.7]'
- 'data updater tool (Cheerio) [v0.3.6]'
- 'setup payroll table + player tiles [v0.3.5]'
- 'setup roster/payroll view switching logic [v0.3.4]'
- 'player list + roster panel layout [v0.3.3]'
- 'setup base layout structure (autoprefixer) [v0.3.2]'
- 'setup templating, transpiling, linting (React, Babel, ESLint) [v0.3.1]'
- 'upgrade build system (gulp, Browserify, Jade) [v0.3.0]'
- 'update grunt (watch newer, uncss, cssmin, preprocess) [v0.2.2]'
- 'hookup node middleware + testing (Socket.io, Jasmine) [v0.2.1]'
- 'setup node server (Express, Socket.io) + restructure public assets [v0.2.0]'
- 'update docs, favicon, dependencies [v0.1.1]'
- 'initial build'



------------------------- [ END ] -----------------------------
