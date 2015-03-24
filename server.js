// CapCrunch Server
// ==================================================
'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    compression = require('compression'),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    moment      = require('moment'),
    timestamp   = 'MMMM Do YYYY, h:mm:ss a',
    mongoose    = require('mongoose'),
    Team        = require('./models/team.js'),
    env         = process.env.NODE_ENV || 'development',
    port        = process.env.PORT || 3000;


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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
if (env === 'production') { app.use(compression()); }
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  // connected
  // console.log('Connected (' + moment().format(timestamp) + ')');

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

  // disconnected
  socket.on('disconnect', function () {
    console.log('Disconnected (' + moment().format(timestamp) + ')');
  });
});
