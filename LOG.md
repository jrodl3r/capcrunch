#### RELEASE

- 'Round #1 » private sharing/testing (gchat, dm, nhl#s)'
- 'Round #2 » public release (HF, HN, #reactjs)
  - http://goo.gl/06SsOZ
  - http://goo.gl/VYF5sg
  - https://twitter.com/TGfireandice/status/578747221308370944
  - http://fireandice.northjersey.com
  - http://war-on-ice.com
  - http://mirtle.blogspot.ca/2015/03/matthew-wuest-1979-2015.html
  - http://www.inlouwetrust.com/2015/3/23/8272707/who-else-other-than-the-nhl-can-try-to-make-a-new-capgeek
  - https://twitter.com/bruce_arthur/status/578716668484005888
  - https://twitter.com/chrismpeters/status/578977478875553792


#### LATER

- 'design'
- 'analytics + monitoring'
- 'Typekit + gulp asset management (fonts, images)'
- 'minor team roster/lineup'
- 'unit testing (Jest / Jasmine)'
- 'React: SEO friendly SSR markup'
- 'React: Panel update transition animations'
- 'pre-cache player images on team select'
- 'feature detection: `if (!Modernizr.draganddrop)` (gulp-modernizr)'
- 'panel scrollbar consistency'
- 'collapsable menu panels'


#### NOW » Did You Uptick Version? » [v0.5.2]

- 'light-up roster grid (open) tiles onDrag'
- 'setup team-specific player item hiding'
- 'update roster grid data management'
- 'roster grid player item drag-n-drop'
- 'roster grid player item removal/adjustment'
- 'reset panel scroll position on team change'
- 'payroll table sticky headers (thead>tr>th)'
- 'payroll UFA/RFA cell styles'
- 'component/session state + share'
- 'cap stats calculator panel + logic'
- 'trade player panel + logic'
- 'create player panel + logic'


#### READY

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
