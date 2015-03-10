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

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.use('/public', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


// Events
// --------------------------------------------------

io.sockets.on('connection', function (socket) {
  console.log('Connected (' + (new Date()).toLocaleString() + ')');

  // TODO

  socket.on('disconnect', function () {
    console.log('Disconnected (' + new Date() + ')');
  });
});
