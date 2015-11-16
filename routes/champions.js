'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(app){
  function capitalize(str) {
    if(str && str.length < 2) {
      return str.toUpperCase();
    }
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  }

  function normalizeImageName(id, str) {
    var champNormalizerMap = {
      31: 'Chogath',
      36: 'DrMundo',
      59: 'JarvanIV',
      121: 'Khazix',
      96: 'KogMaw',
      7: 'Leblanc',
      64: 'LeeSin',
      11: 'MasterYi',
      21: 'MissFortune',
      421: 'RekSai',
      223: 'TahmKench',
      4: 'TwistedFate',
      161: 'Velkoz',
      5: 'XinZhao'
    };
    if(champNormalizerMap[id]) {
      return champNormalizerMap[id];
    }
    return str.replace(/'|\./g, '').split(' ').map(function(curr) {return capitalize(curr)  }).join('');
  }

  router.get('/', function(req, res, next) {
    res.render('champions', {
      title: 'Champions',
      version: app.get('dragon_version'),
      champs: app.get('ordered_champions')
    });
    return;
  });

  router.get('/:champion_id', function(req, res, next) {
    var id = req.params.champion_id;
    var champ = app.get('champions_by_id')[id];
    champ.normalizedImageName = normalizeImageName(id, champ.name);

    res.render('champion', {
      title: champ.name,
      version: app.get('dragon_version'),
      champion: champ
    });
  });

  return router;
};
