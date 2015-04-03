// CapCrunch Custom Roster Schema
// ==================================================
'use strict';

var mongoose = require('mongoose');

var rosterSchema = new mongoose.Schema({
      id: String,
      name: String,
      name_id: String,
      hit: String,
      space: String,
      activeTeam: String,
      activePlayers: [],
      trades: [],
      created: [],
      lines: {
        F1L: {}, F1C: {}, F1R: {},
        F2L: {}, F2C: {}, F2R: {},
        F3L: {}, F3C: {}, F3R: {},
        F4L: {}, F4C: {}, F4R: {},
        D1L: {}, D1R: {},
        D2L: {}, D2R: {},
        D3L: {}, D3R: {},
        G1L: {}, G1R: {}
      }
    });

module.exports = mongoose.model('Roster', rosterSchema);
