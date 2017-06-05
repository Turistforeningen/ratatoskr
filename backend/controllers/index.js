'use strict';

const { Router } = require('express');

const environment = require('../lib/environment');

const serviceWorkerController = require('./service-worker');
const loginController = require('./login');
const logoutController = require('./logout');
const apiController = require('./api');


const router = new Router();


if (environment.development) {
  router.get('/*', (req, res, next) => {
    console.log(`Request: ${req.protocol}://${req.hostname}${req.url}`); // eslint-disable-line
    next();
  });
}


// Return React app if user is authenticated or redirect to login
router.get('/', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }

  const userData = JSON.stringify(req.user.getAPIRepresentation());
  return res.render('app.html', {userData});
});


// Offline page for appcache Sevice Worker
router.get('/is-offline', (req, res, next) => {
  res.render('offline.html');
});


// Add controllers
router.use('/', serviceWorkerController);
router.use('/login', loginController);
router.use('/logout', logoutController);
router.use('/api', apiController);


module.exports = router;
