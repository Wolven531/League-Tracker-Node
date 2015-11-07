'use strict';

var express = require('express');
var moment = require('moment');
var PageView = require('../models/PageView');
var router = express.Router();

module.exports = function(app){
  router.get('/', function(req, res, next) {
    return PageView
      .find()
      .then(function(pageViewInfos) {
        res.render('pageviews', {
          title: 'Site Information',
          pageViewInfos: pageViewInfos.map(function(curr) {
            curr.formattedDate = moment(curr.date).format('MMM. Do, YYYY');
            curr.referer = curr.referer || 'N/A';
            return curr;
          }).sort(pageViewSort)
        });
      })
      .catch(function(err) {
        return next(err);
      });
  });

  function pageViewSort(pv1, pv2) {
    if(moment(pv1.date).isSame(moment(pv2.date))) {// if the same date on the two, further comparison needed
      var sortedByUrl = ([pv1.url, pv2.url]).sort();
      if(pv1.views > pv2.views) {// we want the higher views to be first, favor pv1
        return -1;
      } else if(pv2.views > pv1.views) {// we want the higher views to be first, unfavor pv1
        return 1;
      } else {// even page views, still need url sort
        return sortedByUrl[0] === pv1.url ? -1 : 1;
      }
    } else if(moment(pv1.date).isAfter(moment(pv2.date))) {// we want the newest first
      return -1;
    } else {// we don't care at this point
      return 1;
    }
  }

  return router;
};
