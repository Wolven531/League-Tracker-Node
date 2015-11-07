'use strict';

var express = require('express');
var numeral = require('numeral');
var router = express.Router();
var User = require('../models/User');
var UserTotal = require('../models/UserTotal');

module.exports = function(app){
  router.get('/:id', function(req, res, next) {
    User.findOne({ id: req.params.id })
      .then(function(user) {
        return UserTotal.findOne({ user: user }).populate('user');
      })
      .then(function(userTotal) {
        res.render('user', {
          title: 'Profile: ' + userTotal.user.name,
          version: app.get('dragon_version'),
          userTotal: userTotal
        });
      })
      .catch(function(err) {
        err.status = 500;
        return next(err);
      });
  });

  return router;
};
