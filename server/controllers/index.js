'use strict';

const { Router } = require('express');

const {middleware: requireAuth} = require('../lib/auth');
const redis = require('../lib/redis');
const version = require('../version');


const router = new Router();


router.get('/', (req, res, next) => {
  const userId = req.session ? req.session.user : null;

  if (!userId) {
    res.render('index.html', {version});
  } else {
    redis.hgetall(req.session.user)
      .then((data) => {
        const user = JSON.parse(data.user);
        res.render('index.html', {user, version});
      })
      .catch((err) => {
        res.render('index.html', {version});
      });
  }
});
  }
});


router.use('/logg-inn', require('./auth'));


router.get('/logg-ut', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});


router.use('/profil', requireAuth, (req, res, next) => {
  redis.hgetall(req.session.user).then((data) => {
    const user = JSON.parse(data.user);

    if (req.accepts('html')) {
      res.render('profile.html', {user});
    } else if (req.accepts('json')) {
      res.json(user);
    }
  });
});


module.exports = router;
