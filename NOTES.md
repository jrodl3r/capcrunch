
---------------------------------------------------------------
#### NOTES »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------


## Local DB Backup
---------------------------------------------------------------
$ mongoexport -d cc -c teams -o backup.json (-v --pretty)


## Local DB Rebuild + Import
---------------------------------------------------------------
$ mongo --shell
$ use cc
$ db.teams.drop()
$ db.createCollection('teams')
$ exit
$ mongoimport --db cc --collection teams --type json --file db.json --jsonArray


## Prod DB Backup
---------------------------------------------------------------
$ mongoexport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a -o backup.json


## Prod DB Import
---------------------------------------------------------------
$ mongoimport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a --file teams.json



---------------------------------------------------------------
#### RELEASE »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
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



---------------------------------------------------------------
#### FEEDBACK (User Testing) »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»
---------------------------------------------------------------
- Add multiple years for the roster (ex: this is 2015 but if I wanted to build the 2015-16 team, then the partial salaries need to reflect a full year, not the partial year)
- Add spots on the roster for the players in the press box (scratches) – to get accurate cap and cap space, so including roster players that are not part of the 12 forwards, six defenseman, and two goalies.
- Add spots on the roster for the players who have salary retained
- The page should refresh when the team is changed (A refresh button would be nice.)
- There should be a way to undo a trade



------------------------- [ END ] -----------------------------
