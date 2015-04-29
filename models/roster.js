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
        FB1: {}, FB2: {}, FB3: {},
        FR1: {}, FR2: {}, FR3: {},
        D1L: {}, D1R: {},
        D2L: {}, D2R: {},
        D3L: {}, D3R: {},
        DB1: {}, DB2: {},
        DR1: {}, DR2: {},
        G1L: {}, G1R: {},
        GB1: {}, GB2: {},
        GR1: {}, GR2: {}
      }
    });

module.exports = mongoose.model('Roster', rosterSchema);
