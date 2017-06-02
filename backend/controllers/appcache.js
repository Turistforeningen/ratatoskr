'use strict';

const { Router } = require('express');
const fetch = require('isomorphic-fetch');

const environment = require('../lib/environment');


const router = new Router();


// Service Worker Manifest
router.get(
  ['/manifest.html', '/appcache/manifest.html'],
  (req, res, next) => {
    if (environment.production) {
      res.sendFile('/ratatoskr/build/appcache/manifest.html');
    }

    fetch('http://assets.medlem.dnt.local/appcache/manifest.html')
      .then((response) => response.text())
      .then((text) => {
        res.send(text);
      });
  }
);

router.get(
  ['/manifest.appcache', '/appcache/manifest.appcache'],
  (req, res, next) => {
    if (environment.production) {
      res.sendFile('/ratatoskr/build/appcache/manifest.appcache');
    }

    fetch('http://assets.medlem.dnt.local/appcache/manifest.appcache')
      .then((response) => response.text())
      .then((text) => {
        res.send(text);
      });
  }
);


module.exports = router;
