'use strict';

const { Router } = require('express');

const {middleware: requireAuth} = require('../lib/auth');
const redis = require('../lib/redis');
const User = require('../models/User');


const router = new Router();


router.get('/', (req, res, next) => {
  const userId = req.session ? req.session.user : null;

  if (!userId) {
    res.render('index.html');
  } else {
    const user = User();
    user.load(userId);

    res.render('index.html', {user});
  }
});


router.get('/json', (req, res, next) => {
  const userId = req.session ? req.session.user : null;

  if (!userId) {
    res.json({error: 'no user set'});
  } else {
    const user = User();
    user.load(userId).then(() => {
      res.json({user: user});
    });
  }
});


router.use('/logg-inn', require('./auth'));


router.get('/logg-ut', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
