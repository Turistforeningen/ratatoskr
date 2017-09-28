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
  const faviconFolderName = environment.getFaviconsFolderName();

  res.type('application/manifest+json').json({
    name: 'DNT Medlem',
    short_name: 'DNT Medlem',
    description: 'Informasjon om ditt medlemsskap hos Den Norske Turistforening',
    lang: 'nb-NO',
    theme_color: '#b43f2e',
    background_color: '#f1f1f1',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    related_applications: [
      {
        platform: 'web',
        url: 'https://medlem.dnt.no/',
      },
    ],
    icons: [
      {
        src: `/assets/${faviconFolderName}/android-chrome-36x36.png`,
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-48x48.png`,
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-72x72.png`,
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-96x96.png`,
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-144x144.png`,
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-256x256.png`,
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-384x384.png`,
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: `/assets/${faviconFolderName}/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  });
});


// Deep links
router.use('/apple-app-site-association', (req, res, next) => {
  res.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: 'no.turistforeningen.ratatoskr',
          paths: [
            '*',
          ],
        },
      ],
    },
  });
});


// Appcache
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
