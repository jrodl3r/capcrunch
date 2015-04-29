#### RELEASE

- 'Round #1 » private sharing/testing (gchat, dm, nhl#s, JSmeetup)'
  - whitey@wgr550.com, ckanal, kris baker (SabresProspects.com)
- 'Round #2 » public release (HF, HN, #reactjs)
  - http://goo.gl/06SsOZ
  - http://goo.gl/VYF5sg
  - https://twitter.com/TGfireandice/status/578747221308370944
  - http://fireandice.northjersey.com
  - http://war-on-ice.com
  - http://diebytheblade.com
  - http://mirtle.blogspot.ca/2015/03/matthew-wuest-1979-2015.html
  - http://www.inlouwetrust.com/2015/3/23/8272707/who-else-other-than-the-nhl-can-try-to-make-a-new-capgeek
  - http://thehockeywriters.com/the-dream-team-an-nhl-11-case-study
  - https://twitter.com/bruce_arthur/status/578716668484005888
  - https://twitter.com/chrismpeters/status/578977478875553792


#### FEEDBACK (User Testing)

- Add multiple years for the roster (ex: this is 2015 but if I wanted to build the 2015-16 team, then the partial salaries need to reflect a full year, not the partial year)
- Add spots on the roster for the players in the press box (scratches) – to get accurate cap and cap space, so including roster players that are not part of the 12 forwards, six defenseman, and two goalies.
- Add spots on the roster for the players who have salary retained
- The page should refresh when the team is changed (A refresh button would be nice.)
- There should be a way to undo a trade


#### LATER (Technical)

- 'node jade view engine'
- 'unit testing (Jest / Jasmine)'
- 'session state clear + restore (cookies)'
- 'distill cap stats instances to single component'
- »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
- 'gulp asset management + optimization (fonts, images)'
- 'player image CDN (uptime/redundancy/speed)'
- 'SEO friendly ReactJS SSR markup'


#### LATER (Features)

- 'minor team roster/lineup'
- 'special teams (PP1/PP2/PK1/PK2) layout + logic'
- 'message-board sharing widget (dynamic image generator)'
- 'sticky cap stats panel + payroll table headers (try cloning)'
- 'player-list + payroll player details onHover'
- 'wire-up create-player add salary row button'
- 'scroll player group into view on item drag-start (if not fully visible)'
- »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
- 'free agents panel + logic'
- 'payroll: show/apply user transactions settings'
- 'pre-cache team + player images on select/hover'
- 'editable player tile info (salary) + add to LTIR button'
»»» Refactor Trade Logic »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
  - 'trade player cap violation/overage check + warning'
  - 'share: if (multiple active-team trades) re-confirm team-select (warn: active-team trades only)'
  - 'share: if (all-star mode) re-confirm team-select (warn: active-team)'
  - 'clear roster on team change?'
  - 'warn about disabled trade functionality?'
  - 'warn about allstar mode?'
  - 'trade player assets / draft picks layout + logic'
  - 'scrape team draft pick data
»»» Footer »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
  - 'credits'
  - 'feedback + support'
  - 'copyright + disclaimer'
  - 'next feature voting'


#### NOW »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»» [v0.9.2] «

- 'remove bench references from remove player process'
- 'cleanup shared-roster alt-line loading transitions'
- 'fix accidental IR/PB target drop bug'
- 'share roster close button'
- 'share roster text-only output'
- 'cleanup cap stats transitions'
- 'add error string to messages object'
- 'add full screen team-select splash intro'
- »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
- 'trade summary button/view layout + logic'
- 'update notifications layout + logic (slide-out + fade-in)'
- 'cleanup validation/error message display/timing consistency'
- 'wire-up Twitter + Facebook share buttons'
- 'upgrade app data + upgrade Mongolab'


#### READY

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



#### NOTES

###### Local DB Backup
$ mongoexport -d cc -c teams -o backup.json (-v --pretty)

###### Local DB Rebuild + Import
$ mongo --shell
$ use cc
$ db.teams.drop()
$ db.createCollection('teams')
$ exit
$ mongoimport --db cc --collection teams --type json --file TEAM_ID.json --jsonArray

###### Prod DB Backup
$ mongoexport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a -o backup.json

###### Prod DB Import
$ mongoimport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a --file teams.json
