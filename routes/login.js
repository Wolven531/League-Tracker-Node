'use strict';

var express = require('express');
var jsonfile = require('jsonfile');
var userStore = require('../data/users');
var router = express.Router();

module.exports = function(app){
  router.get('/', function(req, res, next) {
    res.render('login', {
      title: 'Register',
      users: userStore.users.map(function(curr){
        return {username: curr.username};
      })
    });
    return;
  });

  router.post('/', function(req, res, next) {
    var q_username = req.body.league_name;
    if(!q_username || q_username.length === 0){
      console.log('No league name provided.');
      var err = new Error('No league name provided.');
      err.status = 400;
      return next(err);
    }
    var potential_matches = userStore.users.filter(function(curr){
      return curr.username === q_username;
    });
    if(potential_matches.length === 0){// new user
      userStore.users.push({username: q_username, id: 0});
      jsonfile.writeFileSync(__dirname + '/../data/users.json', userStore);// update the storage
    }
    res.render('login', {
      title: 'Register'
    });
    return;
  });
  return router;
};
