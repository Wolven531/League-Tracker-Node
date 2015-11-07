'use strict';

var mongoose = require('mongoose');
var numeral = require('numeral');
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
userTotalSchema.virtual('kda').get(function() {
  return (this.kills + this.assists) / (this.deaths || 1);// default a 1 for math reasons
});
userTotalSchema.virtual('avg_kills').get(function() {
  return this.kills / this.games;
});
userTotalSchema.virtual('avg_deaths').get(function() {
  return this.deaths / this.games;
});
userTotalSchema.virtual('avg_assists').get(function() {
  return this.assists / this.games;
});
userTotalSchema.virtual('avg_gold').get(function() {
  return this.gold / this.games;
});

userTotalSchema.virtual('games_formatted').get(function() {
  return numeral(this.games).format('0,0');
});
userTotalSchema.virtual('kda_formatted').get(function() {
  return numeral(this.kda).format('0,0.0000');
});
userTotalSchema.virtual('kills_formatted').get(function() {
  return numeral(this.kills).format('0,0');
});
userTotalSchema.virtual('deaths_formatted').get(function() {
  return numeral(this.deaths).format('0,0');
});
userTotalSchema.virtual('assists_formatted').get(function() {
  return numeral(this.assists).format('0,0');
});
userTotalSchema.virtual('gold_formatted').get(function() {
  return numeral(this.gold).format('0,0');
});
userTotalSchema.virtual('wins_formatted').get(function() {
  return numeral(this.wins).format('0,0');
});
userTotalSchema.virtual('losses_formatted').get(function() {
  return numeral(this.losses).format('0,0');
});
userTotalSchema.virtual('avg_kills_formatted').get(function() {
  return numeral(this.avg_kills).format('0,0.00');
});
userTotalSchema.virtual('avg_deaths_formatted').get(function() {
  return numeral(this.avg_deaths).format('0,0.00');
});
userTotalSchema.virtual('avg_assists_formatted').get(function() {
  return numeral(this.avg_assists).format('0,0.00');
});
userTotalSchema.virtual('avg_gold_formatted').get(function() {
  return numeral(this.avg_gold).format('0,0.00');
});

module.exports = mongoose.model('UserTotal', userTotalSchema);
