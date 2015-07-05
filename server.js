'use strict'; require('newrelic');

var http      = require('http'),
    path      = require('path'),
    express   = require('express'),
    app       = express(),
    server    = require('http').createServer(app),
    io        = require('socket.io').listen(server),
    gzip      = require('compression'),
    mongoose  = require('mongoose'),
    Team      = require('./models/team.js'),
    Picks     = require('./models/picks.js'),
    Roster    = require('./models/roster.js'),
    textgen   = require('./tools/textgen/text.js'),
    moment    = require('moment-timezone'),
    timestamp = 'MMMM Do YYYY, h:mm:ss a',
    timezone  = 'America/New_York',
    env       = process.env.NODE_ENV || 'development',
    port      = process.env.PORT || 3000;


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
}//else if (env === 'testing'){}


app.use(gzip());
app.use('/', express.static(path.join(__dirname, '/public'), { maxAge: 10000000 }));
app.get('/', function(req, res) {
  console.log('User Connected (' + moment.tz(timezone).format(timestamp) + ')');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/:roster', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


io.on('connection', function(socket) {

  // load team
  socket.on('get team', function(id) {
    Team.find({ id : id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load team', 'error');
        console.error(err || 'Load Team Failed: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        socket.emit('load team', data[0]);
        console.log('Team Loaded: ' + data[0].name + ' (' + moment.tz(timezone).format(timestamp) + ')');
      }
    });
  });

  // load trade team
  socket.on('get trade team', function(id) {
    Picks.find({ id : id }, function(p_err, p_data) {
      if (p_err || !p_data[0]) {
        socket.emit('load trade team', 'error');
        console.error(p_err || 'Load Picks Failed: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        var picks = p_data[0];
        Team.find({ id : id }, function(err, data) {
          if (err || !data[0]) {
            socket.emit('load trade team', 'error');
            console.error(err || 'Load Trade Team Failed: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
          } else {
            var team = {
              id          : id,
              picks       : picks,
              forwards    : data[0].players.forwards,
              defensemen  : data[0].players.defensemen,
              goaltenders : data[0].players.goaltenders,
              inactive    : data[0].players.inactive
            };
            socket.emit('load trade team', team);
            console.log('Trade Team Loaded: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
          }});
      }});
  });

  // load draft picks
  socket.on('get picks', function(id) {
    Picks.find({ id : id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load picks', 'error');
        console.error(err || 'Load Picks Failed: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        socket.emit('load picks', data[0]);
      }});
  });

  // load roster
  socket.on('get roster', function(id) {
    Roster.find({ id : id }, function(err, data) {
      if (err || !data[0]) {
        socket.emit('load roster', 'error');
        console.error(err || 'Load Roster Failed: ' + id + ' (' + moment.tz(timezone).format(timestamp) + ')');
      } else {
        socket.emit('load roster', data[0]);
        console.log('Roster Loaded: ' + data[0].name + ' [' + data[0].id + '] (' + moment.tz(timezone).format(timestamp) + ')');
      }});
  });

  // save roster
  socket.on('save roster', function(data, type) {
    if (data && data.name) {
      data.name_id = data.name.replace(/\s/g, '').toLowerCase();
      Roster.count({ name_id : data.name_id }, function(count_err, count) {
        if (count_err) {
          socket.emit('roster saved', 'error');
          console.error(count_err);
        } else {
          data.id = count ? data.name_id + count : data.name_id;
          data.name = count ? data.name.replace(/\s/g, '') + count : data.name;
          data.text = textgen.build(data, type);
          var new_roster = new Roster(data);
          new_roster.save(function(err) {
            if (err) {
              socket.emit('roster saved', 'error');
              console.error(err);
            } else {
              socket.emit('roster saved', 'success', data);
              console.log('Roster Saved: ' + data.name + ' [' + data.id + '] (' + moment.tz(timezone).format(timestamp) + ')');
            }});
        }});
    } else {
      socket.emit('roster saved', 'error');
      console.error('Roster Name/ID Error');
    }});
});

server.listen(port);
