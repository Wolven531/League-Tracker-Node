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

  router.get('/:champion_id', function(req, res, next) {
    var champ = app.get('champions_by_id')[req.params.champion_id];
    //champ.lore = champ.lore.replace(/<br>/g, '<p>&nbsp;</p>');
    res.render('champion', {
      title: champ.name,
      version: app.get('dragon_version'),
      champion: champ
    });
  });

  return router;
};
