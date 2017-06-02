'use strict';

const { Router } = require('express');


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
  console.log('USER AUTHENTICATED'); // eslint-disable-line
  res.render('splash.html');
});


router.get('/json', (req, res, next) => {
  res.json({user: req.user});
});


router.use('/logg-inn', require('./auth'));


router.get('/logg-ut', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
