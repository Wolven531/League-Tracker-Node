'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id: { type: Number },
  username: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
