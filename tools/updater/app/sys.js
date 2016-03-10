// System Logging Helper

var fs = require('fs-extra'),
    done_length = 39,
    msg_length  = 37,
    p_length    = 42,
    logs        = '';

var done = function(msg) {
  var length = done_length - msg.length, d = '';
  for (var i = 0; i < length; i++) { d += '#'; }
  msg = '[ ' + msg + ' ' + d + ' ]';
  console.log(msg);
  logs += msg + '\n';
};

var msg = function(msg) {
  var length = msg_length - msg.length, d = '';
  for (var i = 0; i < length; i++) { d += '.'; }
  msg = '[ » ' + msg + ' ' + d + ' ]';
  console.log(msg);
  logs += msg + '\n';
};

var err = function(msg) {
  var length = msg_length - msg.length, d = '';
  for (var i = 0; i < length; i++) { d += '!'; }
  msg = '[ ! ' + msg + ' ' + d + ' ]';
  console.log(msg);
  logs += msg + '\n';
};

var added = function(type, lname, team) {
  var msg, length, d = '';
  if (type === 'shot') { msg = '[ + Shot Added: ' + lname + ' (' + team + ')'; }
  else if (type === 'jersey') { msg = '[ + Jersey Added: ' + lname + ' (' + team + ')'; }
  else if (type === 'image') { msg = '[ + Image Added: ' + lname + ' (' + team + ')'; }
  length = p_length - msg.length;
  for (var i = 0; i < length; i++) { d += ' '; }
  console.log(msg + d + ' ]');
  logs += msg + d + ' ]\n';
};

var caution = function (type, lname, team) {
  var msg, length, d = '';
  if (type === 'image') { msg = '[ * Image Caution: ' + lname + ' (' + team + ')'; }
  length = p_length - msg.length;
  for (var i = 0; i < length; i++) { d += ' '; }
  console.log(msg + d + '  ]');
  logs += msg + d + ' ]\n';
};

var missing = function(type, lname, team) {
  var msg, length, d = '';
  if (type === 'shot') { msg = '[ - Shot Not Found: ' + lname + ' (' + team + ')'; }
  else if (type === 'jersey') { msg = '[ - Jersey Not Found: ' + lname + ' (' + team + ')'; }
  else if (type === 'image') { msg = '[ - Image Not Found: ' + lname + ' (' + team + ')'; }
  length = p_length - msg.length;
  for (var i = 0; i < length; i++) { d += ' '; }
  console.log(msg + d + ' ]');
  logs += msg + d + ' ]\n';
};

var report = function(type, team, group, player, attr) {
  group = group.charAt(0).toUpperCase() + group.slice(1);
  if (type === 'new') { msg = '[ » Updated ' + attr + ': ' + player + ' [' + team + '] (' + group + ')'; }
  else if (type === 'remove') { msg = '[ » Removed Player: ' + player + ' [' + team + '] (' + group + ')'; }
  else if (type === 'add') { msg = '[ » Added Player: ' + player + ' [' + team + '] (' + group + ')'; }
  logs += msg + '\n';
};

var log = function(msg) {
  console.log(msg);
  logs += msg + '\n';
};

var summary = function(path) {
  fs.ensureFile(path + '/log.txt', function(err) {
    if (err) { err('Error Creating Log File'); console.error(err); }
    else {
      fs.appendFile(path + '/log.txt', logs, function(err) {
        if (err) { err('Error Writting Log File'); console.error(err); }
        else {
          console.log('LOG: ' + path + '/log.txt');
          console.log('\nPUBLISH (DEV/LOCAL):');
          console.log('--------------------');
          console.log("$ mongo --shell\n$ use cc\n$ db.teams.drop()\n$ db.createCollection('teams')\n$ exit\n$ mongoimport --db cc --collection teams --type json --file _active.json --jsonArray");
          console.log('\nBACKUP (PROD):');
          console.log('--------------');
          console.log("$ mongoexport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a -o PROD_BACKUP.json");
          console.log('\nPUBLISH (PROD):');
          console.log('---------------');
          console.log("$ mongoimport -h ds043348.mongolab.com:43348 -d heroku_app35105999 -c teams -u heroku_app35105999 -p nmqh43ko5r8p3qkgjull6p0v1a --file _active.json\n");
        }
      });
    }
  });
};

module.exports.done = done;
module.exports.msg = msg;
module.exports.log = log;
module.exports.err = err;
module.exports.added = added;
module.exports.report = report;
module.exports.caution = caution;
module.exports.missing = missing;
module.exports.summary = summary;
