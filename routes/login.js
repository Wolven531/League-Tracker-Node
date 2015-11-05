'use strict';

var express = require('express');
var User = require('../models/User');
var router = express.Router();

module.exports = function(app){
  function getLogin(req, res, next) {
    User.find({}, function(err, users) {
      if(err) {
        var err = new Error('Error retreiving users.');
        err.status = 500;
        return next(err);
      }
      return res.render('login', {
        title: 'Register',
        version: app.get('dragon_version'),
        users: users
      });
    });
  }
  router.get('/', getLogin);

  router.post('/', function(req, res, next) {
    var q_username = (req.body.league_name || '').toLowerCase();
    if(q_username.length === 0) {
      console.log('No league name provided.');
      var err = new Error('No league name provided.');
      err.status = 400;
      return next(err);
    }
    return User.find({ name: q_username }, function(err, users) {
      if(err) {
        var err = new Error('Error retreiving users.');
        err.status = 500;
        return next(err);
      }
      if(users.length === 0) {
        var newUser = new User({ name: q_username, id: 0 });
        newUser.save(function(err) {
          if(err) {
            return next(err);
          }
        });
      }
      return getLogin(req, res, next);
    });
  });
  return router;
};
