'use strict';

const { Router } = require('express');

const environment = require('../lib/environment');
const loadFromWebpackDevServer = require(
  '../utils/load-from-webpack-dev-server'
);


const router = new Router();


// sw.js
router.get('/sw.js', (req, res, next) => {
  if (environment.production) {
    res.sendFile('/ratatoskr/build/sw.js');
  } else {
    loadFromWebpackDevServer('sw.js')
      .then((src) => {
        res.set('Content-Type', 'application/javascript; charset=UTF-8');
        res.send(src);
      });
  }
});


// Application manifest
router.use('/manifest.json', (req, res, next) => {
  res.json({
    name: 'Mitt medlemskap - Den Norske Turistforening',
    short_name: 'DNT Medlem',
    lang: "nb-NO",
    theme_color: '#b43f2e',
    background_color: '#f1f1f1',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
  });
});


// Service Worker Manifest
router.get('/appcache/manifest.html', (req, res, next) => {
  if (environment.production) {
    res.sendFile('/ratatoskr/build/appcache/manifest.html');
  } else {
    loadFromWebpackDevServer('appcache/manifest.html')
      .then((src) => {
        res.send(src);
      });
  }
});


router.get('/appcache/manifest.appcache', (req, res, next) => {
  if (environment.production) {
    res.sendFile('/ratatoskr/build/appcache/manifest.appcache');
  } else {
    loadFromWebpackDevServer('appcache/manifest.appcache')
      .then((src) => {
        res.send(src);
      });
  }
});


module.exports = router;
