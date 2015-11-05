'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Possible values from request object:
//
// req.headers['user-agent']
// req.headers['referer']
// req.url
// req.params
// req.query

var pageViewSchema = new Schema({
  date: { type: Date, require: true },
  url: { type: String, required: true },
  views: { type: Number, required: true, default: 0 },
  referer: { type: String }
});

module.exports = mongoose.model('PageView', pageViewSchema);
