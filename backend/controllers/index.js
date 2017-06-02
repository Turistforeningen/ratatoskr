'use strict';

const { Router } = require('express');

const authController = require('./auth');
const apiController = require('./api');


const router = new Router();


// Service Worker Manifest
router.get('/manifest.html', (req, res, next) => {
  res.sendFile('/ratatoskr/build/appcache/manifest.html');
});
router.get('/manifest.appcache', (req, res, next) => {
  res.sendFile('/ratatoskr/build/appcache/manifest.appcache');
});


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

// Add controllers
router.use('/login', authController);
router.use('/api', apiController);

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
