// Player Headshot Image Grabber

var request    = require('request'),
    http       = require('http'),
    fs         = require('fs-extra'),
    shell      = require('shelljs'),
    sys        = require('./sys.js'),
    teams      = ['ANA', 'ARI', 'BOS', 'BUF', 'CGY', 'CAR', 'CHI', 'COL', 'CLB', 'DAL', 'DET', 'EDM', 'FLA', 'LAK', 'MIN', 'MTL', 'NAS', 'NJD', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'SJS', 'STL', 'TBL', 'TOR', 'VAN', 'WAS', 'WPG'],
    groups     = ['forwards', 'defensemen', 'goaltenders'],
    db         = [],
    init       = true,
    cur_team   = 0,
    cur_group  = 0,
    cur_player = 0,
    local_path = '',
    local_cb;

// Find & Save Missing Player Images
var update = function(path, callback) {
  if (init) {
    local_path = path;
    local_cb = callback;
    fs.readFile(path + '/tsn/data.json', function(err, data) {
      if (err) { sys.err('Error Reading TSN JSON Data'); console.error(err); }
      else {
        db = JSON.parse(data);
        init = false;
        sys.msg('Updating Player Images');
        update(path, callback);
      }
    });
  } else if (cur_team < teams.length) {
    if (cur_group < groups.length) {
      if (cur_player < db[cur_team].players[groups[cur_group]].length) {
        var player = db[cur_team].players[groups[cur_group]][cur_player],
            fname = player.firstname.replace(/\./g,''),
            lname = player.lastname.replace(/'/g, ''),
            img = 'img/_players/' + player.team + '-' + lname + '-' + fname + '.png';
        // scan player image
        if (!player.image) {
          // check pre-existing images
          fs.exists(img, function(exists) {
            if (!exists) { get(path, player, callback); }
            else {
              player.image = player.team + '-' + lname + '-' + fname + '.png';
              db[cur_team].players[groups[cur_group]][cur_player] = player;
              cur_player++;
              update(path, callback);
            }
          });
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
    fs.writeFile(path + '/_new.json', JSON.stringify(db, null, '\t'), function(err) {
      if (err) { sys.err('Error Creating Database'); console.error(err); }
      else {
        sys.done('Player Images Updated');
        local_cb(local_path);
      }
    });
  }
}

var get = function(path, player, callback) {
  var fname = player.firstname.replace(/\./g, ''),
      lname = player.lastname.replace(/'/g, ''),
      label = player.firstname + ' ' + player.lastname + ' - ' + player.team,
      cmd = 'nhlpimg "' + player.firstname + ' ' + player.lastname + '"',
      img = 'img/_players/' + player.team + '-' + lname + '-' + fname + '.png',
      img_url = '', caution_flag = false;
  shell.exec(cmd, { silent: true }, function(code, res, err) {
    if (err) { sys.err('Error Getting Image Data (' + label + ')'); }
    else {
      img_url = res.trim();
      if (/(http|https)/.test(img_url)) {
        if (/^(\*\s)/.test(img_url)) {
          img_url = img_url.replace(/\*\s/g, '');
          caution_flag = true;
        }
        request(img_url, { encoding: 'binary' }, function(err, res, body) {
          if (!err && res.statusCode == 200) {
            fs.writeFile(img, body, 'binary', function(err) {
              if (!err) {
                if (caution_flag) { sys.caution('image', player.lastname, player.team); }
                else { sys.added('image', player.lastname, player.team); }
                db[cur_team].players[groups[cur_group]][cur_player].image = player.team + '-' + player.lastname + '-' + fname + '.png';
              } else {
                sys.missing('image', player.firstname + ' ' + player.lastname, player.team);
              }
              cur_player++;
              setTimeout(function(callback) { update(local_path, callback); }, 1000);
            });
          } else {
            sys.err('Image Download Error (' + label + ')');
            cur_player++;
            setTimeout(function(callback) { update(local_path, callback); }, 1000);
          }
        });
      } else {
        sys.missing('image', fname + ' ' + player.lastname, player.team);
        cur_player++;
        setTimeout(function(callback) { update(local_path, callback); }, 1000);
      }
    }
  });
};

module.exports.update = update;
