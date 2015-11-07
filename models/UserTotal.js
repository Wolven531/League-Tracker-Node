'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userTotalSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kills: { type: Number, default: 0 },
  deaths: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 }
});

userTotalSchema.virtual('games').get(function() {
  return this.wins + this.losses;
});

module.exports = mongoose.model('UserTotal', userTotalSchema);
