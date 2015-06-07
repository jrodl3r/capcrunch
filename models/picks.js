'use strict';

var mongoose = require('mongoose');

var picksSchema = new mongoose.Schema({
  id: String,
  Y15: [{}],
  Y16: [{}],
  Y17: [{}],
  Y18: [{}]
});

module.exports = mongoose.model('Picks', picksSchema);
