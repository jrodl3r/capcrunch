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
        FI1: {}, FI2: {}, FI3: {},
        FP1: {}, FP2: {}, FP3: {},
        D1L: {}, D1R: {},
        D2L: {}, D2R: {},
        D3L: {}, D3R: {},
        DI1: {}, DI2: {},
        DP1: {}, DP2: {},
        G1L: {}, G1R: {},
        GI1: {}, GI2: {}
      }
    });

module.exports = mongoose.model('Roster', rosterSchema);
