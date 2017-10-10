'use strict';

const { Router } = require('express');
const morgan = require('morgan');

const environment = require('../lib/environment');

const robotsTxtController = require('./robots-txt');
const serviceWorkerController = require('./service-worker');
const apiController = require('./api');


const router = new Router();

// Access logs
router.use(morgan('combined'));


// Return React app if user is authenticated or redirect to login
router.get('/', (req, res, next) => {
  const faviconFolderName = environment.getFaviconsFolderName();

  const context = {
    ogImage: `/assets/${faviconFolderName}/android-chrome-384x384.png`,
  };
  res.render('app.html', context);
});

// Add controllers
router.use('/', robotsTxtController);
router.use('/', serviceWorkerController);
router.use('/api', apiController);


module.exports = router;
