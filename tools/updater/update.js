// ======================================================
// CapCrunch.io Roster & Payroll Data Updater
// ======================================================
// $ TYPE=new node update.js         | Pulls New Roster/Payroll Data
// $ TYPE=recycle node update.js     | Recycles Current Data
// ------------------------------------------------------
'use strict';

var request  = require('request'),
    prompt   = require('prompt'),
    cheerio  = require('cheerio'),
    fs       = require('fs-extra'),
    sys      = require('./app/sys.js'),
    rosters  = require('./app/rosters.js'),
    info     = require('./app/info.js'),
    images   = require('./app/images.js'),
    TYPE     = process.env.TYPE || 'TYPE NOT SPECIFIED';

// Update Database
function update_db(type) {
  var date = new Date(),
      month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
      day = date.getDate() < 9 ? '0' + date.getDate() : date.getDate(),
      hour = date.getHours() < 9 ? '0' + date.getHours() : date.getHours(),
      minute = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes(),
      second = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds(),
      timestamp = date.getFullYear() + '-' + month + '-' + day + '_' + hour + '-' + minute + '-' + second,
      root = 'data/' + timestamp;

  fs.copy('_active.json', root + '/_backup.json', function (err) {
    if (err) { sys.err('Error Creating Database Backup'); console.error(err); }
    else {
      sys.done('Database Backup Complete');
      // Get & Merge Payroll & Roster Data
      rosters.update(root, type, function(path) {
        // Update TSN Player Info
        info.update(path, function(path) {
          // Update Player Images
          images.update(path, function(path) {
            build_db(path, function(status) {
              if (status === 'success') { sys.log('[ »»»»»»»»»»» BUILD COMPLETE! «««««««««««« ]'); }
              else if (status === 'error') { sys.err('Database Build Failed'); }
              sys.summary(path);
            });
          });
        });
      });
    }
  });
}

// Update Active Database
function build_db(path, callback) {
  prompt.start();
  prompt.get(['replace'], function(err, res) {
    if (err) {
      sys.err('User Input Error');
      console.error(err);
      callback('error');
    }
    else if (res.replace === 'y' || res.replace === 'yes') {
      fs.remove('_active.json', function(err) {
        if (err) {
          sys.err('Error Removing Old Database');
          console.error(err);
          callback('error');
        } else {
          fs.copy(path + '/_new.json', '_active.json', function(err) {
            if (err) {
              sys.err('Error Copying New Database');
              console.error(err);
              callback('error');
            } else {
              fs.remove('_backup.json', function(err) {
                if (err) {
                  sys.err('Error Removing Old Backup');
                  console.error(err);
                  callback('error');
                } else {
                  fs.copy(path + '/_backup.json', '_backup.json', function(err) {
                    if (err) {
                      sys.err('Error Copying New Database');
                      console.error(err);
                      callback('error');
                    } else { callback('success'); }
  });}});}});}});}
    else {
      sys.err('Database Not Replaced');
      callback('success');
    }
  });
}

// Tasks
if (TYPE === 'recycle') { update_db('recycle'); }
else if (TYPE === 'new') { update_db('new'); }
else { console.log(TYPE); }

