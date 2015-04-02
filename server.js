// CapCrunch Server
// ==================================================
'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    auth        = require('http-auth'),
    compression = require('compression'),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    moment      = require('moment'),
    timestamp   = 'MMMM Do YYYY, h:mm:ss a',
    mongoose    = require('mongoose'),
    Team        = require('./models/team.js'),
    Roster      = require('./models/roster.js'),
    env         = process.env.NODE_ENV || 'development',
    port        = process.env.PORT || 3000,
    admin       = auth.basic({
      realm: 'Restricted',
      file: path.join(__dirname, 'data/users.htpasswd')
    });


// Connect
// --------------------------------------------------

server.listen(port);

if (env === 'development') {
  mongoose.connect('mongodb://localhost/cc', function(err) {
    if (err) { console.error(err); }
    else { console.log('Connected to mongodb (' + moment().format(timestamp) + ')'); }
  });
} else if (env === 'production') {
  mongoose.connect('mongodb://' + process.env.MONGOLAB_URI + '/cc', function(err) {
    if (err) { console.error(err); }
    else { console.log('Connected to mongodb (' + moment().format(timestamp) + ')'); }
  });
} else if (env === 'testing') { /* TODO */ }


// Routes
// --------------------------------------------------

if (env === 'production') {
  app.use(auth.connect(admin));
  app.use(compression());
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/:roster', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
// app.post('/:roster', parser, function (req, res) {}); [TODO?]
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  // connected
  // console.log('Connected (' + moment().format(timestamp) + ')');

  // load team
  socket.on('get team', function (team_id) {
    Team.find({ id : team_id }, function (err, data) {
      if (err || !data[0]) {
        socket.emit('load team', 'error');
        console.error(err || 'Load Team Failed: ' + team_id + ' (' + moment().format(timestamp) + ')');
      } else {
        socket.emit('load team', data[0]);
        console.log('Team Loaded: ' + data[0].name + ' (' + moment().format(timestamp) + ')');
      }
    });
  });

  // load roster
  socket.on('get roster', function (roster_id) {
    Roster.find({ id : roster_id }, function (err, data) {
      if (err || !data[0]) {
        socket.emit('load roster', 'error');
        console.error(err || 'Load Roster Failed: ' + roster_id + ' (' + moment().format(timestamp) + ')');
      } else {
        socket.emit('load roster', data[0]);
        console.log('Roster Loaded: ' + data[0].name + ' [' + data[0].id + '] (' + moment().format(timestamp) + ')');
      }
    });
  });

  // save roster
  socket.on('save roster', function (roster_data) {

    // TODO Generate ID: strip name + add timestamp hash [?]
    roster_data.id = roster_data.name.replace(/\s/g, '') + '12345';

    var new_roster = new Roster(roster_data);
    new_roster.save( function (err) {
      if (err) { console.error(err); }
      else {
        socket.emit('roster saved', roster_data.id);
        console.log('Roster Saved: ' + roster_data.name + ' [' + roster_data.id + '] (' + moment().format(timestamp) + ')');
      }
    });
  });

  // disconnected
  socket.on('disconnect', function () {
    console.log('Disconnected (' + moment().format(timestamp) + ')');
  });
});
