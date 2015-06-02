'use strict';

var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
      id: String,
      name: String,
      cap: {
        hit: String,
        space: String,
        forwards: String,
        defensemen: String,
        goaltenders: String,
        other: String,
        inactive: String,
        players: String
      },
      players: {
        forwards: [{
          lastname: String,
          firstname: String,
          capnum: String,
					caphit: String,
					bonus: String,
          contract: [String],
          shot: String,
          jersey: String,
          image: String,
          team: String,
          id: String,
          age: String,
          nation: String,
          position: String,
          status: String
        }],
        defensemen: [{
          lastname: String,
          firstname: String,
          capnum: String,
					caphit: String,
					bonus: String,
          contract: [String],
          shot: String,
          jersey: String,
          image: String,
          team: String,
          id: String,
          age: String,
          nation: String,
          position: String,
          status: String
        }],
        goaltenders: [{
          lastname: String,
          firstname: String,
          capnum: String,
					caphit: String,
					bonus: String,
          contract: [String],
          shot: String,
          jersey: String,
          image: String,
          team: String,
          id: String,
          age: String,
          nation: String,
          position: String,
          status: String
        }],
        other: [{
          lastname: String,
          firstname: String,
          capnum: String,
					caphit: String,
					bonus: String,
          contract: [String],
          shot: String,
          jersey: String,
          image: String,
          team: String,
          id: String,
          age: String,
          nation: String,
          position: String,
          status: String
        }],
        inactive: [{
          lastname: String,
          firstname: String,
          capnum: String,
					caphit: String,
					bonus: String,
          contract: [String],
          shot: String,
          jersey: String,
          image: String,
          team: String,
          id: String,
          age: String,
          nation: String,
          position: String,
          status: String
        }]
      }
    });

module.exports = mongoose.model('Team', teamSchema);
