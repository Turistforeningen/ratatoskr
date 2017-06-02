'use strict';

const { Router } = require('express');

const authController = require('./auth');

const router = new Router();


// User authenticated - Return React app
router.get('/', (req, res, next) => {
  if (req.user) {
    res.render('app.html');
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

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
