'use strict';

const { Router } = require('express');
const raven = require('raven');

const {middleware: requireAuth} = require('../lib/auth');
const redis = require('../lib/redis');
const sentry = require('../lib/sentry');


const router = new Router();


router.get('/', (req, res, next) => {
  const userId = req.session.user;

  if (!userId) {
    res.render('index.html');
  } else {
    redis.hgetall(req.session.user).then((data) => {
      const user = JSON.parse(data.user);
      res.render('index.html', {user});
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


// Sentry Error Handling
if (process.env.NODE_ENV === 'production') {
  router.use(raven.middleware.express.requestHandler(sentry));
  router.use(raven.middleware.express.errorHandler(sentry));
}


// Final Error Handling
router.use((err, req, res, next) => {
  /* eslint-disable no-console */
  if (err.code >= 500) {
    if (err.error) {
      console.error(err.error.message);
      console.error(err.error.stack);
    } else {
      console.error(err.message);
      console.error(err.stack);
    }
  }
  /* eslint-enable */

  if (err.code && (typeof err.toJSON === 'function')) {
    res.status(err.code).json(err.toJSON());
  } else if (err.status && err.message) {
    // Some errors, like SyntaxError from body-parser middleware
    // https://github.com/expressjs/body-parser/issues/122
    res.status(err.status).json({code: err.status, message: err.message});
  } else {
    res.status(500).json({code: 500, message: 'Unknown error'});
  }
});


module.exports = router;
