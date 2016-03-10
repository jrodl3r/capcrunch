// Player Info Scrapper

var request    = require('request'),
    fs         = require('fs-extra'),
    sys        = require('./sys.js'),
    teams      = ['ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CLB', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NAS', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'WAS', 'WPG'],
    groups     = ['forwards', 'defensemen', 'goaltenders'],
    righty     = /Shoots: R/,
    lefty      = /Shoots: L/,
    jersey     = /(\#)(\d+)/,
    db         = [],
    init       = true,
    cur_team   = 0,
    cur_group  = 0,
    cur_player = 0,
    local_path = '',
    local_cb;

// Find & Update Missing Player Info
var update = function(path, callback) {
  if (init) {
    local_path = path;
    local_cb = callback;
    fs.readFile(path + '/nn/data.json', function(err, data) {
      if (err) { sys.err('Error Reading NHLNumbers JSON Data'); console.error(err); }
      else {
        db = JSON.parse(data);
        init = false;
        sys.msg('Updating TSN Player Info');
        update(path, callback);
      }
    });
  } else if (cur_team < teams.length) {
    if (cur_group < groups.length) {
      if (cur_player < db[cur_team].players[groups[cur_group]].length) {
        var player = db[cur_team].players[groups[cur_group]][cur_player];
        // attempt to copy missing shot/jersey
        if (!player.shot || !player.jersey) {
          get(path, player, callback);
        } else {
          cur_player++;
          update(path, callback);
        }
      } else {
        cur_player = 0;
        cur_group++;
        update(path, callback);
      }
    } else {
      cur_group = 0;
      cur_team++;
      update(path, callback);
    }
  } else {
    fs.ensureDir(path + '/tsn', function(err) {
      if (err) { sys.err('Error Creating JSON Directory'); console.error(err); }
      else {
        fs.writeFile(path + '/tsn/data.json', JSON.stringify(db, null, '\t'), function(err) {
          if (err) { sys.err('Error Writing TSN Data'); console.error(err); }
          else {
            sys.done('TSN Player Info Updated');
            local_cb(path);
          }
        });
      }
    });
  }
}

// Find TSN Player Info
var get = function (path, player, callback) {
  var url = 'http://www.tsn.ca/mobile/bbcard.aspx?hub=NHL&name=' + player.firstname + '+' + player.lastname;
  request(url, function(err, res, html) {
    if (!err && res.statusCode === 200) {
      // shot
      if (!player.shot) {
        if (lefty.test(html)) {
          db[cur_team].players[groups[cur_group]][cur_player].shot = 'L';
          sys.added('shot', player.lastname, player.team);
        } else if (righty.test(html)) {
          db[cur_team].players[groups[cur_group]][cur_player].shot = 'R';
          sys.added('shot', player.lastname, player.team);
        }
        if (!db[cur_team].players[groups[cur_group]][cur_player].shot) {
          db[cur_team].players[groups[cur_group]][cur_player].shot = '';
          sys.missing('shot', player.lastname, player.team);
        }
      }
      // jersey
      if (!player.jersey) {
        if (jersey.test(html) && jersey.exec(html)[2] !== '0') {
          db[cur_team].players[groups[cur_group]][cur_player].jersey = jersey.exec(html)[2];
          sys.added('jersey', player.lastname, player.team);
        }
        if (!db[cur_team].players[groups[cur_group]][cur_player].jersey) {
          db[cur_team].players[groups[cur_group]][cur_player].jersey = '';
          sys.missing('jersey', player.lastname, player.team);
        }
      }
    } else {
      sys.err('Error Getting TSN Data (' + player.lastname + ' - ' + player.team + ')');
      console.error(err);
    }
    cur_player++;
    setTimeout(function(callback) { update(local_path, callback); }, 250);
  });
};

module.exports.update = update;
