'use strict';

const { Router } = require('express');

const appcacheController = require('./appcache');
const loginController = require('./login');
const logoutController = require('./logout');
const apiController = require('./api');


const router = new Router();


// User authenticated - Return React app
router.get('/', (req, res, next) => {
  if (req.user) {
    const userData = JSON.stringify(req.user.getAPIRepresentation());
    res.render('app.html', {userData});
  } else {
    next();
  }
});


// User not authenticated - Return splash page
router.get('/', (req, res, next) => {
  res.render('splash.html');
});


// Offline page for appcache Sevice Worker
router.get('/is-offline', (req, res, next) => {
  res.render('offline.html');
});


// Add controllers
router.use('/appcache', appcacheController);
router.use('/login', loginController);
router.use('/logout', logoutController);
router.use('/api', apiController);


module.exports = router;
