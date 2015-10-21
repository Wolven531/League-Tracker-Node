'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(app){
  router.get('/', function(req, res, next) {
      res.render('champions', {
        title: 'Champions',
        version: app.get('dragon_version'),
        champs: app.get('ordered_champions')
      });
      return;
  });
  return router;
};
