'use strict';

var express = require('express');
var jsonfile = require('jsonfile');
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
        users: users
      });
    });
  }
  router.get('/', getLogin);

  router.post('/', function(req, res, next) {
    var q_username = req.body.league_name;
    if(!q_username || q_username.length === 0) {
      console.log('No league name provided.');
      var err = new Error('No league name provided.');
      err.status = 400;
      return next(err);
    }
    return User.find({ username: q_username }, function(err, users) {
      if(err) {
        var err = new Error('Error retreiving users.');
        err.status = 500;
        return next(err);
      }
      if(users.length === 0) {
        var newUser = new User({ username: q_username, id: 0 });
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
