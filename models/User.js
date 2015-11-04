'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  profileIconId: { type: Number },
  revisionDate: { type: Number },
  summonerLevel: { type: Number }
});

module.exports = mongoose.model('User', userSchema);
