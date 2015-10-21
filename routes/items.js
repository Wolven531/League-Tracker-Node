'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(app){
  router.get('/', function(req, res, next) {
    res.render('items', {
      title: 'Items',
      version: app.get('dragon_version'),
      items: app.get('ordered_items')
    });
    return;
  });
  return router;
};
