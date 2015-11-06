'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statInfoSchema = new Schema({
  assists: { type: Number, default: 0 },
  barracksKilled: { type: Number, default: 0 },// Number of enemy inhibitors killed.
  championsKilled: { type: Number, default: 0 },
  combatPlayerScore: { type: Number, default: 0 },
  consumablesPurchased: { type: Number, default: 0 },
  damageDealtPlayer: { type: Number, default: 0 },
  doubleKills: { type: Number, default: 0 },
  firstBlood: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
  goldEarned: { type: Number, default: 0 },
  goldSpent: { type: Number, default: 0 },
  item0: { type: Number },
  item1: { type: Number },
  item2: { type: Number },
  item3: { type: Number },
  item4: { type: Number },
  item5: { type: Number },
  item6: { type: Number },
  itemsPurchased: { type: Number, default: 0 },
  killingSprees: { type: Number, default: 0 },
  largestCriticalStrike: { type: Number, default: 0 },
  largestKillingSpree: { type: Number, default: 0 },
  largestMultiKill: { type: Number, default: 0 },
  legendaryItemsCreated: { type: Number, default: 0 },// Number of tier 3 items built.
  level: { type: Number, default: 1 },
  magicDamageDealtPlayer: { type: Number, default: 0 },
  magicDamageDealtToChampions: { type: Number, default: 0 },
  magicDamageTaken: { type: Number, default: 0 },
  minionsDenied: { type: Number, default: 0 },
  minionsKilled: { type: Number, default: 0 },
  neutralMinionsKilled: { type: Number, default: 0 },
  neutralMinionsKilledEnemyJungle: { type: Number, default: 0 },
  neutralMinionsKilledYourJungle: { type: Number, default: 0 },
  nexusKilled: { type: Boolean, default: false },// Flag specifying if the summoner got the killing blow on the nexus.
  nodeCapture: { type: Number, default: 0 },
  nodeCaptureAssist: { type: Number, default: 0 },
  nodeNeutralize: { type: Number, default: 0 },
  nodeNeutralizeAssist: { type: Number, default: 0 },
  numDeaths: { type: Number, default: 0 },
  numItemsBought: { type: Number, default: 0 },
  objectivePlayerScore: { type: Number, default: 0 },
  pentaKills: { type: Number, default: 0 },
  physicalDamageDealtPlayer: { type: Number, default: 0 },
  physicalDamageDealtToChampions: { type: Number, default: 0 },
  physicalDamageTaken: { type: Number, default: 0 },
  playerPosition: { type: Number, default: 2 },// Player position (Legal values: TOP(1), MIDDLE(2), JUNGLE(3), BOT(4))
  playerRole: { type: Number, default: 4 },// Player role (Legal values: DUO(1), SUPPORT(2), CARRY(3), SOLO(4))
  quadraKills: { type: Number, default: 0 },
  sightWardsBought: { type: Number, default: 0 },
  spell1Cast: { type: Number, default: 0 },// Number of times first champion spell was cast.
  spell2Cast: { type: Number, default: 0 },// Number of times second champion spell was cast.
  spell3Cast: { type: Number, default: 0 },// Number of times third champion spell was cast.
  spell4Cast: { type: Number, default: 0 },// Number of times fourth champion spell was cast.
  summonSpell1Cast: { type: Number, default: 0 },
  summonSpell2Cast: { type: Number, default: 0 },
  superMonsterKilled: { type: Number, default: 0 },
  team: { type: Number, required: true },
  teamObjective: { type: Number, default: 0 },
  timePlayed: { type: Number, default: 0 },
  totalDamageDealt: { type: Number, default: 0 },
  totalDamageDealtToChampions: { type: Number, default: 0 },
  totalDamageTaken: { type: Number, default: 0 },
  totalHeal: { type: Number, default: 0 },
  totalPlayerScore: { type: Number, default: 0 },
  totalScoreRank: { type: Number, default: 0 },
  totalTimeCrowdControlDealt: { type: Number, default: 0 },
  totalUnitsHealed: { type: Number, default: 0 },
  tripleKills: { type: Number, default: 0 },
  trueDamageDealtPlayer: { type: Number, default: 0 },
  trueDamageDealtToChampions: { type: Number, default: 0 },
  trueDamageTaken: { type: Number, default: 0 },
  turretsKilled: { type: Number, default: 0 },
  unrealKills: { type: Number, default: 0 },
  victoryPointTotal: { type: Number, default: 0 },
  visionWardsBought: { type: Number, default: 0 },
  wardKilled: { type: Number, default: 0 },
  wardPlaced: { type: Number, default: 0 },
  win:	{type: Boolean, required: true }
});

module.exports = mongoose.model('StatInfo', statInfoSchema);
