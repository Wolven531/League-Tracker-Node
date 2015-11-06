'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  /*
    // fellowPlayers is an array of the following objects:
    {  
      "championId":201,
      "teamId":100,
      "summonerId":49170312
    }
  */
  fellowPlayers: [],//mixed
  gameType: { type: String, required: true },// "MATCHED_GAME",
  stats: { type: mongoose.Schema.Types.ObjectId, ref: 'StatInfo', required: true },
  gameId: { type: Number, required: true },// 1987417793,
  ipEarned: { type: Number, required: true },// 272,
  spell1: { type: Number, required: true },// 4,
  teamId: { type: Number, required: true },// 100,
  spell2: { type: Number, required: true },// 7,
  gameMode: { type: String, required: true },// "CLASSIC",
  mapId: { type: Number, required: true },// 11,
  level: { type: Number, required: true },// 30,
  invalid: { type: Boolean, required: true },// false,
  subType: { type: String, required: true },// "NORMAL",
  createDate: { type: Number, required: true },// 1445566782386,
  championId: { type: Number, required: true },// 51
});

module.exports = mongoose.model('Game', gameSchema);
