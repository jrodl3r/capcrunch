// CapCrunch Server
// ==================================================

var express     = require('express'),
    app         = express(),
    server      = require('http').createServer(app),
    io          = require('socket.io').listen(server),
    favicon     = require('serve-favicon'),
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
  res.sendFile(__dirname + '/public/index.html');
});

// testing
if (env === 'test' || env === 'development') {
  // runner
  app.get('/test', function (req, res) {
    res.sendFile(__dirname + '/_SpecRunner.html');
  });
  // fixtures
  app.get('/tmpl/inc/:filename', function (req, res) {
    res.sendFile(__dirname + '/tmpl/inc/' + req.params.filename);
  });
  // test assets
  app.use('/.grunt', express.static(__dirname + '/.grunt'));
  app.use('/spec', express.static(__dirname + '/spec'));
}

// assets
app.use('/', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  console.log('Connected (' + (new Date()).toLocaleString() + ')');

  socket.emit('init', 'Socket.io');

  socket.on('disconnect', function () {
    console.log('Disconnected (' + new Date() + ')');
  });
});
