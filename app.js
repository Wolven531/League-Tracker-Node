'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var moment = require('moment');
var Promise = require('promise');
var request = Promise.denodeify(require('request'));
var passwords = require('./passwords');
var User = require('./models/User');
var PageView = require('./models/PageView');
var SummonerGame = require('./models/SummonerGame');
var Game = require('./models/Game');
var StatInfo = require('./models/StatInfo');
mongoose.connect(passwords.mongo.host, passwords.mongo.db, passwords.mongo.port);

var app = express();
app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname, 'views'));// view engine setup
app.set('view engine', 'jade');// view engine setup
app.set('api_key', passwords.riot_api_key);
app.set('api_static_host', 'https://global.api.pvp.net/api/lol/static-data/na/');
app.set('api_host', 'https://global.api.pvp.net/api/lol/na/');
app.set('api_version', 'v1.2');
app.set('api_summoner_version', 'v1.4');
app.set('api_recent_game_version', 'v1.3');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);
var updateUsers = true;// hits actual API (counts against rate limit)

loadVersion()
  .then(userUpdate)
  .then(loadChampions)
  .then(loadItems)
  .then(loadTags)
  .then(createGameUpdateCycle)
  .then(setup);

function loadVersion() {
  var versionUrl = app.get('api_static_host') + app.get('api_version') + '/realm?api_key=' + app.get('api_key');
  console.log('Loading Version...');
  return request(versionUrl)
    .then(function(resp) {
      if(resp.statusCode !== 200) {
        console.log('Failed to load version.');
        return;
      }
      var data = JSON.parse(resp.body);
      app.set('dragon_version', data.v);
      console.log('Loaded version (' + app.get('dragon_version') + ').');
      return;
    });
}

function loadChampions() {
  var champUrl = app.get('api_static_host') + app.get('api_version') + '/champion?champData=all&api_key=' + app.get('api_key');
  console.log('Loading Champions...');
  return request(champUrl)
    .then(function (resp) {
      if(resp.statusCode !== 200) {
        console.log('Failed to load champions.');
        return;
      }
      var data = JSON.parse(resp.body);
      var champs = data.data;// comes in mapped by champ name
      var champMap = {};
      var champKeys = Object.keys(champs);
      var orderedChamps = [];
      champKeys.sort();
      for(var a = 0; a < champKeys.length; a++) {
        var champ = champs[champKeys[a]];
        orderedChamps.push(champ);
        champMap[champ.id] = champ;
      }
      app.set('champions_by_id', champMap);
      app.set('ordered_champions', orderedChamps)
      console.log('Champions loaded (' + app.get('ordered_champions').length + ').');
      return;
  });
}

function loadItems() {
  var itemUrl = app.get('api_static_host') + app.get('api_version') + '/item?itemListData=all&api_key=' + app.get('api_key');
  console.log('Loading Items...');
  return request(itemUrl)
    .then(function (resp) {
      if(resp.statusCode !== 200) {
        console.log('Failed to load items.');
        return;
      }
      var data = JSON.parse(resp.body);
      var itemMap = data.data;// comes in mapped by item ID
      app.set('items_by_id', itemMap);
      var itemKeys = Object.keys(itemMap);
      var orderedItems = [];
      itemKeys.sort();
      for(var a = 0; a < itemKeys.length; a++) {
        orderedItems.push(itemMap[itemKeys[a]]);
      }
      app.set('ordered_items', orderedItems);
      console.log('Items loaded (' + app.get('ordered_items').length + ').');
      return;
    });
}

function loadTags() {
  var tags = [];
  console.log('Adding tags...');
  app.get('ordered_items').forEach(function(currentItem, ind, arr) {
    var itemTags = currentItem.tags || [];
    itemTags.forEach(function(tag){
      if(tags.indexOf(tag) === -1){
        tags.push(tag);
      }
    });
  });
  app.set('item_tags', tags.sort());
  console.log('Added tags (' + tags.length + ').');
  return;
}

function userUpdate() {
  console.log('Loading users...');
  if(!updateUsers) {
    return User.find()
      .then(function(users) {
      var nonAllocated = users.filter(function(curr) {
          return curr.id === 0;
        });
        console.log('Loaded users (' + users.length + ' total, ' + nonAllocated.length + ' non-allocated.)');
      });
  }
  return User.find()
    .then(function(users) {
      var summonerLookupBatchSize = 40;
      var nonAllocated = users.filter(function(curr) {
        return curr.id === 0;
      });
      console.log('Loaded users (' + users.length + ' total, ' + nonAllocated.length + ' non-allocated.)');
      var requests = [];
      var usersStr = '';
      for(var a = 0; a < nonAllocated.length; a++) {
        usersStr += (usersStr.length === 0 ? '' : ',') + nonAllocated[a].name;
        // if we hit batch size or we're on the final iteration
        if(((a + 1) % summonerLookupBatchSize === 0 && a !== 0) || a === nonAllocated.length - 1) {
          var url = app.get('api_host') + app.get('api_summoner_version') + '/summoner/by-name/' + usersStr + '?api_key=' + app.get('api_key');
          requests.push(url);
          usersStr = '';
        }
      }
      return Promise.all(requests);
    })
    .map(function(currUrl) {
      return request(currUrl)
        .then(function(resp) {
          if(resp.statusCode === 404) {
            console.log('None of the summoners were found.');
            return;
          }
          else if(resp.statusCode !== 200) {
            var err = new Error('Failed to load URL: ' + currUrl);
            err.status = 500;
            throw err;
          }
          var data = JSON.parse(resp.body);
          var usernames = Object.keys(data);// each key is a username
          usernames.forEach(function(username) {
            console.log('Updating ' + username + ' with ', data[username]);
            User.findOneAndUpdate({ name: username }, data[username]).exec();
          });
          return;
        })
        .catch(function(err) {
          console.log('Error updating users.');
          console.log(err);
          return;
        });
    })
    .then(function() {
      console.log('Removing non-updated users.');
      User.remove({ id: 0 }).exec();
    })
    .catch(function(err) {
      console.log('Error retreiving users.');
      console.log(err);
      return;
    });
}

function createGameUpdateCycle() {
  return new Promise(function(resolve, reject) {
    console.log('Updating games...');
    User.find()
      .then(function(users) {
        users.forEach(function(user, ind) {
          setTimeout(function() {
            updateUser(user);
          }, (ind * 1100));// do one request slightly after a second each to avoid hitting rate limit
        });
        resolve();
      })
      .catch(function(err) {
        console.log('Error looking up users.', err);
      });
    // var gameUpdateHandle = setInterval(function() {
    // }, 200);
    // app.set('game_update_handle', gameUpdateHandle);
  });

  function updateUser(user) {
    console.log('Updating user games ' + user.name + ', ' + moment().utc().format('MMM Do, YYYY HH:mm:ss:SSSS'));
    var recentGamesUrl = app.get('api_host') + app.get('api_recent_game_version') + '/game/by-summoner/' + user.id + '/recent?api_key=' + app.get('api_key');
    return request(recentGamesUrl)
      .then(function(resp) {
        if(resp.statusCode !== 200) {
          var err = new Error('Failed to load games for ' + user.name + ' (' + user.id + ').');
          err.status = 500;
          throw new err;
        }
        var games = JSON.parse(resp.body).games;// games is an array
        games.forEach(function(game) {
          updateGame(user, game);
        });
      })
      .catch(function(err) {
        console.log('Error looking up recent games.', err);
      });
  }

  function updateGame(user, game) {
    SummonerGame
      .find({ user: user.id, game: game.gameId })
      .then(function(summonerGames) {
        if(summonerGames.length > 0) {// make sure we haven't already stored this game for this user
          return;
        }
        var newStatInfo = new StatInfo(game.stats);
        return Promise.resolve(newStatInfo.save())// in order to user the catch()
          .then(function(statInfo) {
            var newGame = new Game(game);
            newGame.stats = statInfo;
            return newGame.save();
          })
          .then(function(game) {
            var newSummonerGame = new SummonerGame({
              user: user.id,
              game: game.gameId
            });
            return newSummonerGame.save();
          })
          .then(function(summonerGame) {
            console.log('Successfully saved game ' + summonerGame.game + ' and user ' + summonerGame.user);
          })
          .catch(function(err) {
            console.log('Error creating summoner game combo', err);
          });
      })
      .catch(function(err) {
        console.log('Error looking up summoner game combo', err);
      });
  }
}

function setup() {
  var index = require('./routes/index')(app);
  var champions = require('./routes/champions')(app);
  var items = require('./routes/items')(app);
  var login = require('./routes/login')(app);
  var pageViewInfo = require('./routes/pageviews')(app);

  app.use(analyticsCapture);
  app.use('/', index);
  app.use('/information', pageViewInfo);
  app.use('/champions', champions);
  app.use('/items', items);
  app.use('/login', login);
  app.use(notFoundCapture);// catch 404 and forward to error handler
  app.use(serverErrorCapture);// error handlers

  server.listen(app.get('port'));
  server.on('error', onError);
  server.on('listening', onListening);

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : ' ' + addr.port;
    console.log('Listening at ' + process.env.IP + ':' + bind + '.');
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    var bind = typeof app.get('port') === 'string' ? 'Pipe ' + app.get('port') : 'Port ' + app.get('port');
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function analyticsCapture(req, res, next) {
    var searchUrl = req.url;
    var referer = req.headers.referer;
    PageView
      .findOne({
        date: moment().utc().format('YYYY-MM-DD'),
        url: searchUrl,
        referer: referer
      })
      .then(function(pageViewInfo) {
        if(pageViewInfo) {// if we have this combination on today, increment it
          pageViewInfo.views++;
        } else {// otherwise add it
          pageViewInfo = new PageView({
            url: searchUrl,
            referer: referer,
            date: moment().utc().format('YYYY-MM-DD'),
            views: 1
          });
        }
        pageViewInfo.save();
      })
      .catch(function(err) {
        console.log('Error adding page view.');
        console.log(err);
      });
    next();// continue with the router regardless of prior code
  }

  function notFoundCapture(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }

  function serverErrorCapture(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
  }
}
