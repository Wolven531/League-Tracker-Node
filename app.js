'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var Promise = require('promise');
var request = Promise.denodeify(require('request'));
var passwords = require('./passwords');

var app = express();
app.set('port', process.env.PORT || '3000');
app.set('views', path.join(__dirname, 'views'));// view engine setup
app.set('view engine', 'jade');// view engine setup
app.set('api_key', passwords.riot_api_key);
app.set('api_host', 'https://global.api.pvp.net/api/lol/static-data/na/');
app.set('api_version', 'v1.2');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);

loadVersion()
  .then(loadChampions)
  .then(loadItems)
  .then(setup);

function loadVersion() {
  var versionUrl = app.get('api_host') + app.get('api_version') + '/realm?api_key=' + app.get('api_key');
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
  var champUrl = app.get('api_host') + app.get('api_version') + '/champion?champData=all&api_key=' + app.get('api_key');
  console.log('Loading Champions...');
  return request(champUrl)
    .then(function (resp) {
      if(resp.statusCode !== 200) {
        console.log('Failed to load champions.');
        return;
      }
      var data = JSON.parse(resp.body);
      var champs = data.data;
      var champKeys = Object.keys(champs);
      var orderedChamps = [];
      champKeys.sort();
      for(var a = 0; a < champKeys.length; a++) {
        orderedChamps.push(champs[champKeys[a]]);
      }
      app.set('ordered_champions', orderedChamps)
      console.log('Champions loaded (' + app.get('ordered_champions').length + ').');
      return;
  });
}

function loadItems() {
  var itemUrl = app.get('api_host') + app.get('api_version') + '/item?itemListData=all&api_key=' + app.get('api_key');
  console.log('Loading Items...');
  return request(itemUrl)
    .then(function (resp) {
      if(resp.statusCode !== 200) {
        console.log('Failed to load items.');
        return;
      }
      var data = JSON.parse(resp.body);
      var itemMap = data.data;
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

function setup() {
  var champions = require('./routes/champions')(app);
  var items = require('./routes/items')(app);
  var login = require('./routes/login')(app);
  app.use('/champions', champions);
  app.use('/items', items);
  app.use('/login', login);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  //if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  //}
  server.listen(app.get('port'));
  server.on('error', onError);
  server.on('listening', onListening);
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
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind + '.');
  }
}
