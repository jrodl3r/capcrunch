'use strict'; require('newrelic');

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server, { 'transports': ['websocket'] }),
    auth        = require('http-auth'),
    compression = require('compression'),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    moment      = require('moment-timezone'),
    timestamp   = 'MMMM Do YYYY, h:mm:ss a',
    timezone    = 'America/New_York',
    mongoose    = require('mongoose'),
    Team        = require('./models/team.js'),
    Roster      = require('./models/roster.js'),
    env         = process.env.NODE_ENV || 'development',
    port        = process.env.PORT || 3000,
    admin       = auth.basic({
      realm: 'Private Beta',
      file: path.join(__dirname, 'data/users.htpasswd')
    });


// Connect
// --------------------------------------------------

server.listen(port);

if (env === 'development') {
  mongoose.connect('mongodb://localhost/cc', function(err) {
    if (err) { console.error(err); }
    else { console.log('Connected to mongodb (' + moment.tz(timezone).format(timestamp) + ')'); }
  });
} else if (env === 'production') {
  mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/cc', function(err) {
    if (err) { console.error(err); }
    else { console.log('Connected to mongodb (' + moment.tz(timezone).format(timestamp) + ')'); }
  });
} else if (env === 'testing') { /* TODO */ }


// Routes
// --------------------------------------------------

if (env === 'production') {
  app.use(auth.connect(admin));
  app.get('/', function(req, res) {
    console.log('User Connected [' + req.user + '] (' + moment.tz(timezone).format(timestamp) + ')');
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  app.get('/:roster', function(req, res) {
    console.log('User Connected [' + req.user + '] (' + moment.tz(timezone).format(timestamp) + ')');
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
} else {
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
  app.get('/:roster', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });
}
app.use(compression());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));


// Events
// --------------------------------------------------

io.sockets.on('connection', function(socket) {

  // load team
  socket.on('get team', function(team_id) {
    Team.find({ id : team_id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load team', 'error');
        console.error(err || 'Load Team Failed: ' + team_id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        socket.emit('load team', data[0]);
        console.log('Team Loaded: ' + data[0].name + ' (' + moment.tz(timezone).format(timestamp) + ')');
      }
    });
  });

  // load roster
  socket.on('get roster', function(roster_id) {
    Roster.find({ id : roster_id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load roster', 'error');
        console.error(err || 'Load Roster Failed: ' + roster_id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        socket.emit('load roster', data[0]);
        console.log('Roster Loaded: ' + data[0].name + ' [' + data[0].id + '] (' + moment.tz(timezone).format(timestamp) + ')');
      }
    });
  });

  // load players
  socket.on('get players', function(team_id) {
    Team.find({ id : team_id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load players', 'error');
        console.error(err || 'Load Players Failed: ' + team_id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        var players = {
          team        : team_id,
          forwards    : data[0].players.forwards,
          defensemen  : data[0].players.defensemen,
          goaltenders : data[0].players.goaltenders,
          inactive    : data[0].players.inactive
        };
        socket.emit('load players', team_id, players);
      }
    });
  });

  // save roster
  socket.on('save roster', function(roster_data) {
    if (roster_data && roster_data.name) {
      roster_data.name_id = roster_data.name.replace(/\s/g, '').toLowerCase();
      Roster.count({ name_id : roster_data.name_id }, function(count_err, count) {
        if (count_err) {
          socket.emit('roster saved', 'error');
          console.error(count_err);
        } else {
          if (count) { roster_data.id = roster_data.name_id + count; }
          else { roster_data.id = roster_data.name_id; }
          var new_roster = new Roster(roster_data);
          new_roster.save(function(err) {
            if (err) {
              socket.emit('roster saved', 'error');
              console.error(err);
            } else {
              socket.emit('roster saved', 'success', roster_data.id);
              console.log('Roster Saved: ' + roster_data.name + ' [' + roster_data.id + '] (' + moment.tz(timezone).format(timestamp) + ')');
            }
          });
        }
      });
    } else {
      socket.emit('save roster', 'error');
      console.error('Roster Name/ID Error');
    }
  });

  // disconnected
  // socket.on('disconnect', function() {
  //   console.log('User Disconnected (' + moment.tz(timezone).format(timestamp) + ')');
  // });
});
