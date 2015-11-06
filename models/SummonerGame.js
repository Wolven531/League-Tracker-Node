'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var summonerGameSchema = new Schema({
  user: { type: Number, required: true },
  //user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game: { type: Number, required: true }
});

module.exports = mongoose.model('SummonerGame', summonerGameSchema);
