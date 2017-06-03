'use strict';

const { Router } = require('express');
const fetch = require('isomorphic-fetch');

const environment = require('../lib/environment');


const router = new Router();


// Service Worker Manifest
router.get('/manifest.html', (req, res, next) => {
  if (environment.production) {
    res.sendFile('/ratatoskr/build/appcache/manifest.html');
  }

  // Get manifest from webpack output in dev mode
  fetch('http://assets.medlem.dnt.local/appcache/manifest.html')
    .then((response) => response.text())
    .then((text) => {
      res.send(text);
    });
});


router.get('/manifest.appcache', (req, res, next) => {
  if (environment.production) {
    res.sendFile('/ratatoskr/build/appcache/manifest.appcache');
  }

  // Get manifest from webpack output in dev mode
  fetch('http://assets.medlem.dnt.local/appcache/manifest.appcache')
    .then((response) => response.text())
    .then((text) => {
      res.send(text);
    });
});


module.exports = router;
