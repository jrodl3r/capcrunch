// CapCrunch Server
// ==================================================
'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    moment      = require('moment'),
    timestamp   = 'MMMM Do YYYY, h:mm:ss a',
    mongoose    = require('mongoose'),
    Team        = require('./models/team.js'),
    env         = process.env.NODE_ENV || 'development',
    port        = process.env.PORT || 3000;

server.listen(port);


// Database (TODO: Verify Authentication)
// --------------------------------------------------

if (env === 'development') {
  mongoose.connect('mongodb://ccadmin:voodoo69@localhost/cc', function(err) {
    if (err) { console.error(err); }
    else { console.log('Connected to mongodb'); }
  });
}


// Routes
// --------------------------------------------------

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  console.log('Connected (' + moment().format(timestamp) + ')');

  // load team data
  socket.on('get team', function (team_id) {
    Team.find({ id : team_id }, function (err, data) {
      if (err) { console.error(err); }
      else {
        socket.emit('load team', data[0]);
        console.log('Team Loaded: ' + data[0].name + ' (' + moment().format(timestamp) + ')');
      }
    });
  });

  socket.on('disconnect', function () {
    console.log('Disconnected (' + moment().format(timestamp) + ')');
  });
});
