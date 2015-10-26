'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(app){
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' });
  });
  return router;
};