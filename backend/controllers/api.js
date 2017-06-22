'use strict';

const { Router } = require('express');

const version = require('../version');
const sherpa = require('../lib/sherpa');
const User = require('../models/User');


const router = new Router();


router.get('/*', (req, res, next) => {
  res.header('RATATOSKR-VERSION', version.tag);
  next();
});


// Return version
router.get('/version', (req, res, next) => {
  res.json({version: version.tag});
});


// Return user data
router.get('/user/me', (req, res, next) => {
  const data = req.user
    ? req.user.getAPIRepresentation()
    : {};

  res.json({user: data});
});


// Update user data from Sherpa
router.post('/user/me/update', (req, res, next) => {
  if (req.user) {
    req.user.loadSherpaData()
      .then(() => {
        if (!req.user.id) {
          req.session.userId = null;
        }

        const data = req.user
          ? req.user.getAPIRepresentation()
          : {};

        res.json({user: data});
      })
      .catch((err) => {
        res.json({err: 'err'});
      });
  } else {
    const data = req.user
      ? req.user.getAPIRepresentation()
      : {};

    res.json({user: data});
  }
});


// Login
router.post(['/user/login', '/user/login/:id'], (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = req.params.id || null;

  sherpa.user.authenticate(email, password, userId)
    .then((data) => {
      if (data.users) {
        const { users } = data;
        res.json({users});
      } else {
        User().setTokens(data).loadSherpaData()
          .then((user) => {
            if (user.id) {
              user.save()
                .then(() => {
                  req.session.userId = user.id;
                  res.json({data: user.getAPIRepresentation()});
                });
            } else {
              res.json({error: 'missing user id'});
            }
          })
          .catch((err) => {
            res.json({err});
          });
      }
    })
    .catch((err) => {
      if (err === 'auth-check-error') {
        res.json({error: 'auth-check-error'});
      }
      res.json({error: 'invalid credentials'});
    });

// Login using code
router.post(['/user/:id/code-login'], (req, res, next) => {
  const code = req.body.code;
  const userId = req.params.id;

  const user = User();
  user.id = userId;
  user.ratatoskrCode = code;
  user.loadSherpaData()
    .then(() => {
      if (user.id) {
        res.json(user.getAPIRepresentation());
      } else {
        res.json({error: 'invalid'});
      }
    })
    .catch((err) => {
      res.json({error: 'server-error'});
    });
});

});


// Reset password
router.post('/user/reset', (req, res, next) => {
  const email = req.body.email;

  sherpa.client.post('users/reset/', {email})
    .then((json) => {
      if (json.status === 'ok') {
        res.json({success: true});
      } else {
        res.json({error: json.status});
      }
    })
    .catch((err) => {
      res.json({error: 'sherpa error'});
    });
});


// Logout
router.get('/user/logout', (req, res, next) => {
  req.session.destroy(() => {
    res.json({logout: 'ok'});
  });
});


module.exports = router;
