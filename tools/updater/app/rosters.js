// Payroll & Roster Scrapper

var request     = require('request'),
    cheerio     = require('cheerio'),
    fs          = require('fs-extra'),
    cli         = require('cli'),
    sys         = require('./sys.js'),
    names       = ['Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres', 'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers', 'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers', 'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks', 'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Vancouver Canucks', 'Washington Capitals', 'Winnipeg Jets'],
    teams       = ['ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CLB', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NAS', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'WAS', 'WPG'],
    groups      = ['forwards', 'defensemen', 'goaltenders', 'other', 'inactive'],
    cur_team    = 0,
    db          = [],
    age         = /(Age\: )(\d+)/,
    nation      = /(nat_)([a-z]+)(\.gif)/,
    jersey      = /(Jersey Number\: )(\d+)/,
    jersey_alt  = /(\#)(\d+)/,
    player_id   = /(\/player_stats\/)(\d+)(-)/,
    position    = /(Position: )(Left|Center|Right|Defence|Goaltender)/;

// Pull & Save NHLNumbers HTML Data
var update = function(path, type, callback) {
  if (type === 'recycle') {
    fs.copy('data/_latest/nn/html', path + '/nn/html', function (err) {
      if (err) { sys.err('Error Recycling NHLNumbers Data'); console.error(err); }
      else {
        sys.done('NHLNumbers Data Recycled');
        convert(path, callback);
      }
    });
  } else {
    cur_team = cur_team || 0;
    if (!cur_team) { sys.msg('Getting New NHLNumbers Data'); }
    if (cur_team < teams.length) {
      request('http://stats.nhlnumbers.com/teams/' + teams[cur_team] + '?expand=true&year=2016', function(err, res, html) {
        if (!err && res.statusCode === 200) {
          fs.ensureDir(path + '/nn/html', function(err) {
            if (err) { sys.err('Error Creating HTML Directory'); console.error(err); }
            else {
              fs.writeFile(path + '/nn/html/' + teams[cur_team] + '.html', html, function(err) {
                if (!err) {
                  var progress = (cur_team + 1) / teams.length;
                  cli.progress(progress);
                  cur_team++;
                  update(path, '', callback);
                } else { sys.err('Error Getting NHLNumbers Data'); console.error(err); }
              });
            }
          });
        } else { sys.msg('Error Getting NN Data (' + teams[cur_team + 1] + ')', 1); console.error(err); }
      });
    } else {
      // delete old data
      fs.remove('data/_latest/nn/html', function (err) {
        if (err) { sys.err('Error Removing Old NHLNumbers Backup'); console.error(err); }
        else {
          sys.done('Removed Old NHLNumbers Backup');
          // backup new data
          fs.copy(path + '/nn/html', 'data/_latest/nn/html', function (err) {
            if (err) { sys.err('Error Creating NHLNumbers Backup'); console.error(err); }
            else {
              cur_team = 0;
              sys.done('Finished Creating NHLNumbers Backup');
              convert(path, callback);
            }
          });
        }
      });
    }
  }
};

// Convert NHLNumbers HTML to JSON
var convert = function(path, callback) {
  cur_team = cur_team || 0;
  if (!cur_team) { sys.msg('Converting NHLNumbers Data'); }
  if (cur_team < teams.length) {
    $ = cheerio.load(fs.readFileSync(path + '/nn/html/' + teams[cur_team] + '.html'));
    var team = {},
        scan_player = false,
        group_count = 0,
        player_name = [], fname;
    team[teams[cur_team]] = { 'cap': {}, 'players': {} };

    // team name / cap hit / cap space
    team[teams[cur_team]].name = names[cur_team];
    team[teams[cur_team]].cap.hit = $('table tr td.results').eq(0).text();
    team[teams[cur_team]].cap.space = $('table tr td.results').eq(3).text();

    // player + salary details
    $('table tr').each(function(i, el) {

      // player groups
      if ($(this).children().eq(0).hasClass('positionheading')) {
        key = $(this).children().eq(0).text().toLowerCase();
        if (key === 'defencemen') { key = 'defensemen'; } // spelling correction
        team[teams[cur_team]].players[key] = [];
        team[teams[cur_team]].cap[key] = $(this).children().eq(0).next('.positioncaphit').text();
        group_count = 0;
        scan_player = true;

      // skip blanks
      } else if ($(this).children().hasClass('results')) {
        scan_player = false;

      // scan player
      } else if (scan_player) {
        group_count++;
        // first + last name
        player_name = $(this).children('.team-cell').children('a').text().trim().split(/,\s/);
        fname = player_name[1] ? player_name[1] : '';
        fname = fname.replace(/( \([\s\S]*\))$/, '');
        team[teams[cur_team]].players[key].push({ 'lastname': player_name[0], 'firstname': fname });
        // contract
        cur_player = team[teams[cur_team]].players[key][group_count - 1];
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
            cur_player.contract[i] = '';
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
        } else { cur_player.age = ''; }
        // nation
        if (nation.test(title)) {
          cur_player.nation = nation.exec(title)[2].toUpperCase();
        } else { cur_player.nation = ''; }
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
        } else { cur_player.position = ''; }
        // jersey
        if (jersey.test(title) && jersey.exec(title)[2] !== '0') {
          cur_player.jersey = jersey.exec(title)[2];
        } else { cur_player.jersey = ''; }
        // image
        cur_player.image = '';
        // status (active/inactive/injured/traded/waived/retired/buyout/overage/outside)
        cur_player.status = $(this).children('.team-cell').children('a').attr('class');
      }
    });

    // team player count
    team[teams[cur_team]].cap.players = (team[teams[cur_team]].players.forwards.length + team[teams[cur_team]].players.defensemen.length + team[teams[cur_team]].players.goaltenders.length).toString();

    // write json data
    fs.ensureDir(path + '/nn/json', function(err) {
      if (err) { sys.err('Error Creating JSON Directory'); console.error(err); }
      else {
        fs.writeFile(path + '/nn/json/' + teams[cur_team] + '.json', JSON.stringify(team, null, '\t'), function(err) {
          if (!err) {
            cur_team++;
            var progress = cur_team / teams.length;
            cli.progress(progress);
            convert(path, callback);
          } else { sys.err('Error Converting NN Data (' + teams[cur_team + 1] + ')'); console.error(err); }
        });
      }
    });
  } else {
    cur_team = 0;
    build(path, callback);
  }
};

// Build NHLNumbers Database
var build = function(path, callback) {
  cur_team = cur_team || 0;
  if (!cur_team) { sys.msg('Building NHLNumbers Data'); }
  if (cur_team < teams.length) {
    var progress = (cur_team + 1) / teams.length;
    cli.progress(progress);
    fs.readFile(path + '/nn/json/' + teams[cur_team] + '.json', function(err, data) {
      if (err) { sys.err('Error Building NHLNumbers Data'); console.error(err); }
      else {
        var json = JSON.parse(data);
        db[cur_team] = json[teams[cur_team]];
        db[cur_team].id = teams[cur_team];
        cur_team++;
        build(path, callback);
      }
    });
  } else { merge(path, callback); }
};

// Merge Existing Player Info
var merge = function(path, callback) {
  sys.msg('Merging Existing Player Info');
  fs.readFile('_active.json', function(err, data) {
    if (err) { sys.err('Error Reading Active Database'); console.error(err); }
    else {
      var old_db = JSON.parse(data), progress;
      for (var i = 0; i < db.length; i++) {
        progress = (i + 1) / teams.length;
        cli.progress(progress);
        for (var j = 0; j < groups.length; j++) {
          for (var k = 0; k < db[i].players[groups[j]].length; k++) {
            var player = db[i].players[groups[j]][k];
            for (var l = 0; l < old_db[i].players[groups[j]].length; l++) {
              // find player & copy over info
              var old_player = old_db[i].players[groups[j]][l];
              if (player.lastname === old_player.lastname && player.firstname === old_player.firstname) {
                if (!player.shot || player.shot === '') {
                  db[i].players[groups[j]][k].shot = old_player.shot ? old_player.shot : '';
                }
                if (!player.jersey || player.jersey === '') {
                  db[i].players[groups[j]][k].jersey = old_player.jersey ? old_player.jersey : '';
                }
                if (!player.image || player.image === '') {
                  db[i].players[groups[j]][k].image = old_player.image ? old_player.image : '';
                }
                break;
              }
            }
          }
        }
      }
      fs.writeFile(path + '/nn/data.json', JSON.stringify(db, null, '\t'), function(err) {
        if (err) { sys.err('Error Writing NHLNumbers Data'); console.error(err); }
        else { report(path, callback); }
      });
    }
  });
};

// Report Roster Updates
var report = function(path, callback) {
  fs.readFile(path + '/_backup.json', function(err, data) {
    if (err) { sys.err('Error Reading Backup Database'); console.error(err); }
    else {
      // updated/removed players
      var old_db = JSON.parse(data);
      for (var i = 0; i < old_db.length; i++) {
        for (var j = 0; j < groups.length; j++) {
          for (var k = 0; k < old_db[i].players[groups[j]].length; k++) {
            var old_player = old_db[i].players[groups[j]][k];
            for (var l = 0; l < db[i].players[groups[j]].length; l++) {
              var new_player = db[i].players[groups[j]][l];
              // scan player for changes
              if (new_player.lastname === old_player.lastname && new_player.firstname === old_player.firstname) {
                // contract
                for (var m = 0; m < new_player.contract.length; m++) {
                  if (new_player.contract[m] !== old_player.contract[m]) {
                    sys.report('new', new_player.team, groups[j], new_player.firstname + ' ' + new_player.lastname, 'Contract');
                    break;
                  }
                }
                // position
                if (new_player.position !== old_player.position) {
                  sys.report('new', new_player.team, groups[j], new_player.firstname + ' ' + new_player.lastname, 'Position');
                }
                // jersey
                if (new_player.jersey !== old_player.jersey) {
                  sys.report('new', new_player.team, groups[j], new_player.firstname + ' ' + new_player.lastname, 'Jersey');
                }
                // shot
                if (new_player.shot !== old_player.shot) {
                  sys.report('new', new_player.team, groups[j], new_player.firstname + ' ' + new_player.lastname, 'Shot');
                }
                // age
                if (new_player.age !== old_player.age) {
                  sys.report('new', new_player.team, groups[j], new_player.firstname + ' ' + new_player.lastname, 'Age');
                }
                break;
              // player removed
              } else if (l === db[i].players[groups[j]].length - 1) {
                sys.report('remove', old_player.team, groups[j], old_player.firstname + ' ' + old_player.lastname);
              }
            }
          }
        }
      }
      // added players
      for (var w = 0; w < db.length; w++) {
        for (var x = 0; x < groups.length; x++) {
          for (var y = 0; y < db[w].players[groups[x]].length; y++) {
            var player = db[w].players[groups[x]][y];
            for (var z = 0; z < old_db[w].players[groups[x]].length; z++) {
              var old_player = old_db[w].players[groups[x]][z];
              // player found (not added)
              if (player.lastname === old_player.lastname && player.firstname === old_player.firstname) { break; }
              // player added
              else if (z === old_db[w].players[groups[x]].length - 1) {
                sys.report('add', player.team, groups[x], player.firstname + ' ' + player.lastname);
              }
            }
          }
        }
        if (w === db.length - 1) { callback(path); }
      }
    }
  });
};

module.exports.update = update;
