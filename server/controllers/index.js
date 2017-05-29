'use strict';

const { Router } = require('express');

const {middleware: requireAuth} = require('../lib/auth');
const redis = require('../lib/redis');


const router = new Router();


router.get('/', (req, res, next) => {
  const userId = req.session ? req.session.user : null;

  if (!userId) {
    res.render('index.html');
  } else {
    redis.hgetall(req.session.user)
      .then((data) => {
        const user = JSON.parse(data.user);
        res.render('index.html', {user});
      })
      .catch((err) => {
        res.render('index.html');
      });
  }
});


router.get('/json', (req, res, next) => {
  const userId = req.session ? req.session.user : null;

  if (!userId) {
    res.json({error: 'no user set'});
  } else {
    redis.hgetall(req.session.user)
      .then((data) => {
        res.json({
          user: JSON.parse(data.user),
          household: JSON.parse(data.household),
          tokens: JSON.parse(data.tokens),
        });
      }).catch((err) => {
        res.json({error: 'Unable to load user data'});
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
