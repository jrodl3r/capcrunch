// CapCrunch Data Updater Tool
// ======================================================
// COMMANDS :
// ------------------------------------------------------
//    » TYPE=update node app.js  | (Update)
//    » TYPE=get node app.js     | (Get HMTL)
//    » TYPE=save node app.js    | (Save JSON)
//    » TYPE=info node app.js    | (Player Info)
//    » TYPE=info-i node app.js  | (Inactive Player Info)
//    » TYPE=images node app.js  | (Player Images)
//    » TYPE=merge node app.js   | (Merge JSON)
//    » TYPE=merge-c node app.js | (Merge Shot+Image)
//    » TYPE=log node app.js     | (Log Missing Info)
//    » TYPE=build node app.js   | (Build Teams DB)
//    » TYPE=c node app.js       | (Custom/Misc Update)
// ------------------------------------------------------
'use strict';

var request     = require('request'),
    cheerio     = require('cheerio'),
    fs          = require('fs'),
    TYPE        = process.env.TYPE || 'TYPE NOT SPECIFIED',
    teams       = ['ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CLB', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NAS', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'WAS', 'WPG'],
    names       = ['Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres', 'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers', 'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks', 'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Vancouver Canucks', 'Washington Capitals', 'Winnipeg Jets'],
    league_obj  = {},
    team_obj    = {},
    new_team    = {},
    old_team    = {},
    cur_team    = 0,
    players_obj = {},
    player      = {},
    cur_player  = 0,
    player_name = [],
    firstname   = '',
    lastname    = '',
    num_players = 0,
    num_forward = 0,
    num_defense = 0,
    num_goalie  = 0,
    scan_player = false,
    scan_goalie = false,
    group_count = 0,
    groups      = ['forwards', 'defensemen', 'goaltenders', 'other', 'inactive'],
    group       = '',
    righty      = /Shoots: R/,
    lefty       = /Shoots: L/,
    age         = /(Age\: )(\d+)/,
    nation      = /(nat_)([a-z]+)(\.gif)/,
    jersey      = /(Jersey Number\: )(\d+)/,
    jersey_alt  = /(\#)(\d+)/,
    player_id   = /(\/player_stats\/)(\d+)(-)/,
    position    = /(Position: )(Left|Center|Right|Defence|Goaltender)/,
    interval, stream, image, title, href, url, key, i, j, k, l, $, db = [];


// Update Team + Payroll Data & Build DB-JSON
function update() {

  var update_dir = 'data/foo';

  // setup new folder for team data
  var stats = fs.fstatSync(update_dir);
  // fs.stat(update_dir, function (fs_err, stats) {
    // if (!fs_err) {
      // if (!stats.isDirectory()) {
      //   console.log('foo!!')
      //   // fs.mkdirSync(update_dir);
      // }
    // } else { return console.error(fs_err); }
  // });

  console.log(stats.isDirectory());
  

  //getPayrolls();
  // then...
}


// Download Payroll Data (HTML)
function getPayrolls() {

  if (!cur_team) { console.log('Getting Team Payrolls...'); }

  if (cur_team < teams.length) {
    request('http://stats.nhlnumbers.com/teams/' + teams[cur_team] + '?expand=true&year=2016', function(req_err, res, html) {
      if (!req_err && res.statusCode === 200) {
        fs.writeFile('data/pages/' + teams[cur_team] + '.html', html, function(fs_err) {
          if (!fs_err) {
            console.log(teams[cur_team] + ' > ' + teams[cur_team] + '.html (' + (cur_team + 1) + ')');
            cur_team++;
            getPayrolls();
          } else { return console.error(fs_err); }
        });
      } else { console.error(req_err); }
    });
  } else {
    cur_team = 0;
    console.log('Finished Getting Team Payrolls!');
  }
}

// Save Payroll/Salary Data (JSON)
function savePayrolls() {

  if (!cur_team) { console.log('Starting Save...'); }

  if (cur_team < teams.length) {
    $ = cheerio.load(fs.readFileSync('data/pages/' + teams[cur_team] + '.html'));
    team_obj = {};
    team_obj[teams[cur_team]] = { 'cap': {}, 'players': {} };
    scan_player = false;
    group_count = 0;
    player_name = [];
    // team name / cap hit / cap space
    team_obj[teams[cur_team]].name = names[cur_team];
    team_obj[teams[cur_team]].cap.hit = $('table tr td.results').eq(0).text();
    team_obj[teams[cur_team]].cap.space = $('table tr td.results').eq(3).text();
    // player + salary details
    $('table tr').each(function(i, el) {
      // player groups
      if ($(this).children().eq(0).hasClass('positionheading')) {
        key = $(this).children().eq(0).text().toLowerCase();
        if (key === 'defencemen') { key = 'defensemen'; } // spelling correction
        team_obj[teams[cur_team]].players[key] = [];
        team_obj[teams[cur_team]].cap[key] = $(this).children().eq(0).next('.positioncaphit').text();
        group_count = 0;
        scan_player = true;
      // skip results
      } else if ($(this).children().hasClass('results')) {
        scan_player = false;
      // players
      } else if (scan_player) {
        group_count++;
        // first + last name
        player_name = $(this).children('.team-cell').children('a').text().trim().split(/,\s/);
        team_obj[teams[cur_team]].players[key].push({'lastname': player_name[0], 'firstname': player_name[1]});
        // contract
        cur_player = team_obj[teams[cur_team]].players[key][group_count - 1];
        // cap number
        cur_player.capnum = $(this).children('.capnumber').text();
        // cap hit
        cur_player.caphit = $(this).children('.caphit').text();
        // bonus
        if ($(this).children('.bonus').text().trim() !== '&nbsp;') {
          cur_player.bonus = $(this).children('.bonus').text().trim();
        }
        // contract
        // years: '.past-year', '.current-year', '.future-year'
        // types: '.salary', '.salaryregular', '.salarytwoway', '.salaryrookie', '.salaryextension', '.salaryexttba',
        //        '.salaryextwoway', '.salaryoption', '.salaryrfa', '.salaryufa', '.salaryufasix', '.salaryto'
        // other: '.salarybuyout', '.salarytba'
        // est's: '.salaryestreg', '.salaryestext', '.salaryestbonus'
        cur_player.contract = [];
        for (i = 0; i < 15; i++) {
          if ($(this).children().eq(i+4).hasClass('salary')) {
            cur_player.contract[i] = 'none';
          }
          else if ($(this).children().eq(i+4).hasClass('past-year') || $(this).children().eq(i+4).hasClass('current-year') || $(this).children().eq(i+4).hasClass('future-year')) {
            cur_player.contract[i] = $(this).children().eq(i+4).text().trim();
          }
        }
        // team
        cur_player.team = teams[cur_team];
        // id
        href = $(this).children('.team-cell').children('a').attr('href');
        if (player_id.test(href)) {
          cur_player.id = player_id.exec(href)[2];
        }
        // age
        title = $(this).children('.team-cell').children('a').attr('title');
        if (age.test(title)) {
          cur_player.age = age.exec(title)[2];
        } else {
          cur_player.age = '';
        }
        // nation
        if (nation.test(title)) {
          cur_player.nation = nation.exec(title)[2].toUpperCase();
        } else {
          cur_player.nation = '';
        }
        // position
        if (position.test(title)) {
          if (position.exec(title)[2] === 'Left') {
            cur_player.position = 'LW';
          } else if (position.exec(title)[2] === 'Center') {
            cur_player.position = 'C';
          } else if (position.exec(title)[2] === 'Right') {
            cur_player.position = 'RW';
          } else if (position.exec(title)[2] === 'Defence') {
            cur_player.position = 'D';
          } else if (position.exec(title)[2] === 'Goaltender') {
            cur_player.position = 'G';
          }
        } else {
          cur_player.position = '';
        }
        // jersey
        if (jersey.test(title) && jersey.exec(title)[2] !== '0') {
          cur_player.jersey = jersey.exec(title)[2];
        } else {
          cur_player.jersey = '';
        }
        // status (active/inactive/injured/traded/waived/retired/buyout/overage/outside)
        cur_player.status = $(this).children('.team-cell').children('a').attr('class');
      }
    });
    // write json data
    fs.writeFile('data/teams/' + teams[cur_team] + '.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
      if (!fs_err) {
        console.log(teams[cur_team] + ' > ' + teams[cur_team] + '.json (' + (cur_team + 1) + ')');
        cur_team++;
      } else { return console.error(fs_err); }
    });
  } else {
    cur_team = 0;
    clearInterval(interval);
    console.log('Finished Save!');
  }
}

// Update Player Info (JSON)
function updatePlayerInfo(group) {

  if (group) {
    if (!cur_player && !scan_player && cur_team < teams.length) {
      console.log('Updating (' + teams[cur_team] + ') Inactive Player Info...');
      fs.readFile('data/teams-merged/' + teams[cur_team] + '-merged.json', function(err, data) {
        if (!err) {
          team_obj = JSON.parse(data);
          players_obj = team_obj[teams[cur_team]].players[group];
          scan_player = true;
          setTimeout(function(){ updatePlayerInfo(group); }, 500);
        } else { console.error(err); }
      });
    }
    // get player info
    if (scan_player && cur_player < players_obj.length) {
      player = players_obj[cur_player];
      url = 'http://www.tsn.ca/mobile/bbcard.aspx?hub=NHL&name=' + player.firstname + '+' + player.lastname;
      console.log(player.lastname + ', ' + player.firstname);
      request(url, function(req_err, res, html) {
        if (!req_err && res.statusCode === 200) {
          // shot
          if (lefty.test(html)) { player.shot = 'L'; }
          else if (righty.test(html)) { player.shot = 'R'; }
          else { player.shot = ''; }
          // jersey
          if (jersey_alt.test(html) && jersey_alt.exec(html)[2] !== '0') {
            player.jersey = jersey_alt.exec(html)[2];
          } else {
            player.jersey = '';
          }
          cur_player++;
          setTimeout(function(){ updatePlayerInfo(group); }, 500);
        } else {
          console.error(req_err);
          cur_player++;
          setTimeout(function(){ updatePlayerInfo(group); }, 500);
        }
      });
    // save
    } else if (scan_player && cur_player === players_obj.length) {
      team_obj[teams[cur_team]].players[group] = players_obj;
      fs.writeFile('data/teams-info/' + teams[cur_team] + '.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log(teams[cur_team] + ' > ' + teams[cur_team] + '.json (' + (cur_team + 1) + ')');
          cur_team++;
          cur_player = 0;
          scan_player = false;
          setTimeout(function(){ updatePlayerInfo(group); }, 1000);
        } else { return console.error(fs_err); }
      });
    } else if (cur_team === teams.length) {
      console.log('Finished Getting Player Info!');
      return true;
    }

  } else {
    if (!cur_player && !scan_player && cur_team < teams.length) {
      console.log('Updating (' + teams[cur_team] + ') Player Info...');
      fs.readFile('data/teams/' + teams[cur_team] + '.json', function(err, data) {
        if (!err) {
          team_obj    = JSON.parse(data);
          players_obj = team_obj[teams[cur_team]].players;
          num_forward = players_obj.forwards.length;
          num_defense = players_obj.defensemen.length;
          num_goalie  = players_obj.goaltenders.length;
          num_players = num_forward + num_defense + num_goalie;
          scan_player = true;
          setTimeout(updatePlayerInfo, 500);
        } else { console.error(err); }
      });
    } else if (cur_team === teams.length) {
      console.log('Finished Getting Player Info!');
      return true;
    }
    // get player info (jersey number + shot)
    if (scan_player && cur_player < num_players) {
      // forwards / defensemen / goalies
      if (cur_player < num_forward) {
        player = players_obj.forwards[cur_player];
      } else if (cur_player < num_forward + num_defense) {
        player = players_obj.defensemen[cur_player - num_forward];
      } else if (cur_player < num_forward + num_defense + num_goalie) {
        player = players_obj.goaltenders[cur_player - (num_forward + num_defense)];
        scan_goalie = true;
      }
      // player info request
      url = 'http://www.tsn.ca/mobile/bbcard.aspx?hub=NHL&name=' + player.firstname + '+' + player.lastname;
      console.log(player.lastname + ', ' + player.firstname);
      request(url, function(req_err, res, html) {
        if (!req_err && res.statusCode === 200) {
          // shot
          if (lefty.test(html)) {
            player.shot = 'L';
          } else if (righty.test(html)) {
            player.shot = 'R';
          } else {
            player.shot = '';
          }
          // next player
          cur_player++;
          setTimeout(updatePlayerInfo, 500);
        } else {
          console.error(req_err);
          cur_player++;
          setTimeout(updatePlayerInfo, 500);
        }
      });
    // save updated json + start next team
    } else if (scan_player && cur_player === num_players) {
      team_obj[teams[cur_team]].players = players_obj;
      fs.writeFile('data/teams-info/' + teams[cur_team] + '.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log(teams[cur_team] + ' > ' + teams[cur_team] + '.json (' + (cur_team + 1) + ')');
          cur_team++;
          cur_player = 0;
          scan_player = false;
          setTimeout(updatePlayerInfo, 1000);
        } else { return console.error(fs_err); }
      });
    }
  }
}

// Download Player Images (JSON+PNG)
function getPlayerImages() {

  if (!cur_player && !scan_player && cur_team < teams.length) {
    console.log('Updating (' + teams[cur_team] + ') Player Images...');
    fs.readFile('data/teams/' + teams[cur_team] + '-info.json', function(err, data) {
      if (!err) {
        team_obj    = JSON.parse(data);
        players_obj = team_obj[teams[cur_team]].players;
        num_forward = players_obj.forwards.length;
        num_defense = players_obj.defensemen.length;
        num_goalie  = players_obj.goaltenders.length;
        num_players = num_forward + num_defense + num_goalie;
        scan_player = true;

        setTimeout(getPlayerImages, 1000);
      } else { console.error(err); }
    });
  } else if (cur_team === teams.length) {
    console.log('Finished Getting Player Images!');
    return true;
  }
  // get player images
  if (scan_player && cur_player < num_players) {
    // forwards / defensemen / goalies
    if (cur_player < num_forward) {
      player = players_obj.forwards[cur_player];
    } else if (cur_player < num_forward + num_defense) {
      player = players_obj.defensemen[cur_player - num_forward];
    } else if (cur_player < num_forward + num_defense + num_goalie) {
      player = players_obj.goaltenders[cur_player - (num_forward + num_defense)];
      scan_goalie = true;
    }
    // player image request
    firstname = player.firstname.replace(/\.|\'/g, '').replace(/\s/g, '-');
    lastname  = player.lastname.replace(/\.|\'/g, '').replace(/\s/g, '-');
    url       = 'http://tsnimages.tsn.ca/ImageProvider/PlayerHeadshot?seoId=' + firstname + '-' + lastname + '&width=100&height=100';
    image     = lastname + '-' + firstname + '.png';
    stream    = fs.createWriteStream('img/' + teams[cur_team] + '/' + image);
    stream.on('close', function() {
      console.log('Player Image Saved (' + image + ') [' + cur_player + '/' + num_players + ']');
      player.image = 'http://img.capcrunch.io/players/' + image;
      cur_player++;
      setTimeout(getPlayerImages, 7000);
    });
    request.get(url)
      .on('error', function(req_err) {
        console.error(req_err + ' (' + url + ')');
        cur_player++;
        setTimeout(getPlayerImages, 7000);
      })
      .pipe(stream);
    // [Manual Mode]
    // console.log('Player Image Saved (' + image + ') [' + cur_player + '/' + num_players + ']');
    // player.image = 'http://img.capcrunch.io/players/' + image;
    // cur_player++;
    // setTimeout(getPlayerImages, 250);
  // save updated json + start next team
  } else if (scan_player && cur_player === num_players) {
    team_obj[teams[cur_team]].players = players_obj;
    fs.writeFile('data/teams/' + teams[cur_team] + '-img.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
      if (!fs_err) {
        console.log(teams[cur_team] + ' > ' + teams[cur_team] + '-img.json');
        cur_team++;
        cur_player = 0;
        scan_player = false;
        setTimeout(getPlayerImages, 1000);
      } else { return console.error(fs_err); }
    });
  }
}

// Compile Data (data.json)
function mergeData(flag) {

  if (!cur_team) { console.log('Starting Merge... (Hold on to your butts)'); }

  // Images + Shot
  if (flag === 'custom') {
    if (cur_team < teams.length) {
      fs.readFile('data/teams/' + teams[cur_team] + '.json', function(new_err, new_data) {
        if (!new_err) {
          new_team = JSON.parse(new_data);
          fs.readFile('data/teams-img/' + teams[cur_team] + '-img.json', function(err, data) {
            if (!err) {
              old_team = JSON.parse(data);
              for (i = 0; i < groups.length; i++) {
                if (groups[i] !== 'other' && groups[i] !== 'inactive') {
                  for (j = 0; j < new_team[teams[cur_team]].players[groups[i]].length; j++) {
                    for (k = 0; k < old_team[teams[cur_team]].players[groups[i]].length; k++) {
                      if (new_team[teams[cur_team]].players[groups[i]][j].firstname === old_team[teams[cur_team]].players[groups[i]][k].firstname &&
                          new_team[teams[cur_team]].players[groups[i]][j].lastname === old_team[teams[cur_team]].players[groups[i]][k].lastname) {
                        // shot
                        if (old_team[teams[cur_team]].players[groups[i]][k].shot) {
                          new_team[teams[cur_team]].players[groups[i]][j].shot = old_team[teams[cur_team]].players[groups[i]][k].shot;
                        } else {
                          new_team[teams[cur_team]].players[groups[i]][j].shot = '';
                        }
                        // image
                        if (old_team[teams[cur_team]].players[groups[i]][k].image) {
                          new_team[teams[cur_team]].players[groups[i]][j].image = old_team[teams[cur_team]].players[groups[i]][k].image.substr(32);
                        } else {
                          new_team[teams[cur_team]].players[groups[i]][j].image = '';
                        }
                      break;
              }}}}}
              fs.writeFile('data/teams-info/' + teams[cur_team] + '-merged.json', JSON.stringify(new_team, null, '\t'), function(fs_err) {
                if (!fs_err) {
                  console.log(teams[cur_team] + ' > ' + teams[cur_team] + '-merged.json (' + (cur_team + 1) + ')');
                  cur_team++;
                  mergeData('custom');
                } else { return console.error(fs_err); }
              });
            } else { console.error(err); }
          });
        } else { console.error(new_err); }
      });
    } else if (cur_team === teams.length) { console.log('DONE!'); }

  // Default
  } else {
    if (cur_team < teams.length) {
      fs.readFile('data/teams/' + teams[cur_team] + '-img.json', function(err, data) {
        if (!err) {
          team_obj = JSON.parse(data);
          league_obj[teams[cur_team]] = team_obj[teams[cur_team]];
          cur_team++;
          mergeData('default');
        } else { console.error(err); }
      });
    } else if (cur_team === teams.length) {
      // fs.writeFile('data/data.json', JSON.stringify(league_obj, null, '\t'), function(fs_err)...
      fs.writeFile('data/data.json', JSON.stringify(league_obj), function(fs_err) {
        if (!fs_err) {
          console.log('DONE!');
        } else { return console.error(fs_err); }
      });
    }
  }
}

// Log Missing Data
function logData() {
  if (cur_team < teams.length) {
    fs.readFile('data/db-img.json', function(err, data) {
      if (!err) {
        console.log(teams[cur_team] + '(' + (cur_team + 1) + ')');
        db = JSON.parse(data);
        for (i = 0; i < groups.length; i++) {
          for (j = 0; j < db[cur_team].players[groups[i]].length; j++) {
            if (typeof db[cur_team].players[groups[i]][j].image === undefined) {
              console.log(db[cur_team].players[groups[i]][j].lastname);
            }
          }
          // if (groups[i] !== 'other' && groups[i] !== 'inactive') {
          //   for (j = 0; j < team_obj[teams[cur_team]].players[groups[i]].length; j++) {
          //     if (!team_obj[teams[cur_team]].players[groups[i]][j].shot && !team_obj[teams[cur_team]].players[groups[i]][j].image) {
          //       console.log('both: ' + team_obj[teams[cur_team]].players[groups[i]][j].firstname + ' ' + team_obj[teams[cur_team]].players[groups[i]][j].lastname);
          //     }
          //     else if (!team_obj[teams[cur_team]].players[groups[i]][j].shot) {
          //       console.log('shot: ' + team_obj[teams[cur_team]].players[groups[i]][j].firstname + ' ' + team_obj[teams[cur_team]].players[groups[i]][j].lastname);
          //     }
          //     else if (!team_obj[teams[cur_team]].players[groups[i]][j].image) {
          //       console.log('img: ' + team_obj[teams[cur_team]].players[groups[i]][j].firstname + ' ' + team_obj[teams[cur_team]].players[groups[i]][j].lastname);
          //     }
          //   }
          // }
        }
        cur_team++;
        logData();
      } else { console.error(err); }
    });
  } else if (cur_team === teams.length) { console.log('DONE!'); }
}

// Build Teams DB
function build() {
  if (cur_team < teams.length) {
    fs.readFile('data/teams-info/' + teams[cur_team] + '.json', function(err, data) {
      if (!err) {
        console.log(teams[cur_team] + '(' + (cur_team + 1) + ')');
        team_obj = JSON.parse(data);
        team_obj = team_obj[teams[cur_team]];
        team_obj.id = teams[cur_team];
        db[cur_team] = team_obj;
        cur_team++;
        build();
      } else { console.error(err); }
    });
  } else if (cur_team === teams.length) {
    // fs.writeFile('data/db.json', JSON.stringify(db, null, '\t'), function(fs_err) {
    fs.writeFile('data/db.json', JSON.stringify(db), function(fs_err) {
      if (!fs_err) {
        console.log('Teams DB Build Completed');
      } else { return console.error(fs_err); }
    });
  }
}

// Update Player Conrtacts
function updateContracts() {
  fs.readFile('data/db.json', function(err, data) {
    if (!err) {
      db = JSON.parse(data);
      for (i = 0; i < teams.length; i++) {
        console.log('processing ' + teams[i] + '(' + (i + 1) + ')');
        for (j = 0; j < groups.length; j++) {
          for (k = 0; k < db[i].players[groups[j]].length; k++) {
            for (l = 0; l < db[i].players[groups[j]][k].contract.length; l++) {
              if (db[i].players[groups[j]][k].contract[l] === 'none') {
                db[i].players[groups[j]][k].contract[l] = '';
              }}}}}
      fs.writeFile('data/db-new.json', JSON.stringify(db, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log('Contracts Update Finished');
        } else { return console.error(fs_err); }
      });
    } else { console.error(err); }
  });
}

// Properly Order Inactive Groups
function reorderInactive() {
  fs.readFile('data/db-counts.json', function(err, data) {
    if (!err) {
      db = JSON.parse(data);
      for (i = 0; i < teams.length; i++) {
        console.log('processing ' + teams[i] + '(' + (i + 1) + ')');
        group = db[i].players.inactive;
        group.sort(function (a, b) {
          if (a.capnum > b.capnum) { return -1; }
          if (a.capnum < b.capnum) { return 1; }
          return 0;
        });
        db[i].players.inactive = group;
      }
      // for (j = 0; j < group.length; j++) {
      //   console.log(group[j].lastname + '(' + group[j].capnum + ')');
      // }
      fs.writeFile('data/db-sorted.json', JSON.stringify(db, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log('Contracts Update Finished');
        } else { return console.error(fs_err); }
      });
    } else { console.error(err); }
  });
}

// Add Active Player Counts
function addRosterCount() {
  fs.readFile('data/db-img.json', function(err, data) {
    if (!err) {
      db = JSON.parse(data);
      for (i = 0; i < teams.length; i++) {
        console.log('processing ' + teams[i] + '(' + (i + 1) + ')');
        db[i].cap.players = (db[i].players.forwards.length + db[i].players.defensemen.length + db[i].players.goaltenders.length).toString();
      }
      fs.writeFile('data/db-counts.json', JSON.stringify(db, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log('Roster Counts Added');
        } else { return console.error(fs_err); }
      });
    } else { console.error(err); }
  });
}

// Add Missing Fields
function addMissingFields() {
  fs.readFile('data/db-new.json', function(err, data) {
    if (!err) {
      db = JSON.parse(data);
      for (i = 0; i < teams.length; i++) {
        for (j = 0; j < groups.length; j++) {
          for (k = 0; k < db[i].players[groups[j]].length; k++) {
            if (!db[i].players[groups[j]][k].hasOwnProperty('image')) {
              Object.defineProperty(db[i].players[groups[j]][k], 'image', { value : '', writable : true, enumerable : true, configurable : true });
      }}}}
      fs.writeFile('data/db-img.json', JSON.stringify(db, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log('Roster Fields Updated');
        } else { return console.error(fs_err); }
      });
    } else { console.error(err); }
  });
}

// Convert Player ID/Shot to Numbers
function convertNumbers() {
  fs.readFile('data/db-counts.json', function(err, data) {
    if (!err) {
      db = JSON.parse(data);
      for (i = 0; i < teams.length; i++) {
        console.log('processing ' + teams[i] + '(' + (i + 1) + ')');
        for (j = 0; j < groups.length; j++) {
          for (k = 0; k < db[i].players[groups[j]].length; k++) {
            if (db[i].players[groups[j]][k].jersey !== '') {
              db[i].players[groups[j]][k].jersey = parseInt(db[i].players[groups[j]][k].jersey);
            } else {
              db[i].players[groups[j]][k].jersey = 0;
            }
            if (db[i].players[groups[j]][k].age !== '') {
              db[i].players[groups[j]][k].age = parseInt(db[i].players[groups[j]][k].age);
            } else {
              db[i].players[groups[j]][k].age = 0;
            }
            db[i].players[groups[j]][k].id = parseInt(db[i].players[groups[j]][k].id);
      }}}
      //fs.writeFile('data/db.json', JSON.stringify(db), function(fs_err) {
      fs.writeFile('data/db-numbers.json', JSON.stringify(db, null, '\t'), function(fs_err) {
        if (!fs_err) {
          console.log('Contracts Update Finished');
        } else { return console.error(fs_err); }
      });
    } else { console.error(err); }
  });
}


// Tasks
if (TYPE === 'update') {
  update();
} else if (TYPE === 'get') {
  getPayrolls();
} else if (TYPE === 'save') {
  interval = setInterval(savePayrolls, 1000);
} else if (TYPE === 'info') {
  updatePlayerInfo();
} else if (TYPE === 'info-i') {
  updatePlayerInfo('inactive');
} else if (TYPE === 'images') {
  getPlayerImages();
} else if (TYPE === 'merge') {
  mergeData('default');
} else if (TYPE === 'merge-c') {
  mergeData('custom');
} else if (TYPE === 'log') {
  logData();
} else if (TYPE === 'build') {
  build();
} else if (TYPE === 'c') {
  reorderInactive();
} else {
  console.log(TYPE);
}
