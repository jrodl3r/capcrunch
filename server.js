// CapCrunch Server
// ==================================================
'use strict';

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    favicon     = require('serve-favicon'),
    path        = require('path'),
    env         = process.env.NODE_ENV || 'development',
    port        = process.env.PORT || 3000;

server.listen(port);


// Database
// --------------------------------------------------

if (env !== 'development') {
  console.log('not in Kansas anymore..');
}


// Routes
// --------------------------------------------------

// default
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// testing
// if (env === 'test' || env === 'development') {
  // runner
  // app.get('/test', function (req, res) {
  //   res.sendFile(path.join(__dirname, '/_SpecRunner.html'));
  // });
  // fixtures TODO
  // app.get('/tmpl/inc/:filename', function (req, res) {
  //   res.sendFile(path.join(__dirname, '/tmpl/inc/', req.params.filename));
  // });
  // test assets
  // app.use('/.grunt', express.static(path.join(__dirname, '/.grunt')));
  // app.use('/spec', express.static(path.join(__dirname, '/spec')));
// }

// assets
app.use('/', express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  console.log('Connected (' + (new Date()).toLocaleString() + ')');

  socket.emit('init');

  socket.on('disconnect', function () {
    console.log('Disconnected (' + new Date() + ')');
  });
});
