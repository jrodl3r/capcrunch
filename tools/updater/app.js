// CapCrunch Data Updater Tool
// ======================================================
//
// COMMANDS :
// ------------------------------------------------------
//          » TYPE=get node app.js     | (Get HMTL)
//          » TYPE=save node app.js    | (Save JSON)
//          » TYPE=info node app.js    | (Player Info)
//          » TYPE=images node app.js  | (Player Images)
//          » TYPE=merge node app.js   | (Merge JSON)
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
    jersey      = /#(\d+)/,
    righty      = /Shoots: R/,
    lefty       = /Shoots: L/,
    interval,
    stream,
    image,
    url,
    key,
    $;

// Download Payroll Data (HTML)
function getPayrolls() {

  if (!cur_team) { console.log('Getting Team Payrolls...'); }

  if (cur_team < teams.length) {
    request('http://stats.nhlnumbers.com/teams/' + teams[cur_team] + '?expand=true&year=2015', function(req_err, res, html) {
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
    console.log('Finished Get!');
  }
}

// Save Payroll/Salary Data (JSON)
function savePayrolls() {

  if (!cur_team) { console.log('Starting Save...'); }

  if (cur_team < teams.length) {
    $ = cheerio.load(fs.readFileSync('data/pages/' + teams[cur_team] + '.html'));
    team_obj    = {};
    team_obj[teams[cur_team]] = { 'cap': {}, 'players': {}};
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
        // caphit
        cur_player.contract = [$(this).children('.caphit').text()];
        // salary (current year)
        cur_player.contract.push($(this).children('.current-year').text().trim());
        // salary (future years)
        $(this).children('.future-year').each(function() {
          cur_player.contract.push($(this).text().trim());
        });
      }
    });
    // write json data
    fs.writeFile('data/teams/' + teams[cur_team] + '.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
      if (!fs_err) {
        console.log(teams[cur_team] + ' > ' + teams[cur_team] + '.json');
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
function updatePlayerInfo() {

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
        }
        // jersey number
        if (jersey.exec(html)) {
          player.jersey = jersey.exec(html)[1];
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
    fs.writeFile('data/teams/' + teams[cur_team] + '-info.json', JSON.stringify(team_obj, null, '\t'), function(fs_err) {
      if (!fs_err) {
        console.log(teams[cur_team] + ' > ' + teams[cur_team] + '-info.json');
        cur_team++;
        cur_player = 0;
        scan_player = false;
        setTimeout(updatePlayerInfo, 1000);
      } else { return console.error(fs_err); }
    });
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
function mergeData() {

  if (!cur_team) { console.log('Starting Merge... (Hold on to your butts)'); }

  if (cur_team < teams.length) {
    fs.readFile('data/teams/' + teams[cur_team] + '-img.json', function(err, data) {
      if (!err) {
        team_obj = JSON.parse(data);
        league_obj[teams[cur_team]] = team_obj[teams[cur_team]];
        cur_team++;
        mergeData();
      } else { console.error(err); }
    });
  } else if (cur_team === teams.length) {
    // fs.writeFile('data/data.json', JSON.stringify(league_obj, null, ' '), function(fs_err) {
    fs.writeFile('data/data.json', JSON.stringify(league_obj), function(fs_err) {
      if (!fs_err) {
        console.log('DONE!');
      } else { return console.error(fs_err); }
    });
  }
}

// Process Types
if (TYPE === 'get') {
  getPayrolls();
} else if (TYPE === 'save') {
  interval = setInterval(savePayrolls, 1000);
} else if (TYPE === 'info') {
  updatePlayerInfo();
} else if (TYPE === 'images') {
  getPlayerImages();
} else if (TYPE === 'merge') {
  mergeData();
} else {
  console.log(TYPE);
}
