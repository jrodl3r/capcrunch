// CapCrunch Team Schema
// ==================================================
'use strict';

var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
      id: String,
      name: String,
      cap: {
        hit: String,
        space: String,
        forwards: String,
        defensemen: String,
        goaltenders: String,
        other: String,
        inactive: String
      },
      players: {
        forwards: [{
          lastname: String,
          firstname: String,
          contract: [],
          shot: String,
          jersey: String,
          image: String
        }],
        defensemen: [{
          lastname: String,
          firstname: String,
          contract: [],
          shot: String,
          jersey: String,
          image: String
        }],
        goaltenders: [{
          lastname: String,
          firstname: String,
          contract: [],
          shot: String,
          jersey: String,
          image: String
        }],
        other: [{
          lastname: String,
          firstname: String,
          contract: []
        }],
        inactive: [{
          lastname: String,
          firstname: String,
          contract: []
        }]
      }
    });

module.exports = mongoose.model('Team', teamSchema);
