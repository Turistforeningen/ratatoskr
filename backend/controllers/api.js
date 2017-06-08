'use strict';

const { Router } = require('express');
const fetch = require('isomorphic-fetch');

const version = require('../version');
const settings = require('../lib/settings');
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
router.get('/user/me/update', (req, res, next) => {
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
  const email = null;
  const password = null;
  const userId = req.params.id || null;

  sherpa.user.authenticate(email, password, userId)
    .then((data) => {
      if (data.users) {
        const { users } = data;
        res.json({users});
      }

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
    })
    .catch((err) => {
      res.json({error: 'invalid credentials'});
    });
});


router.get('/tokens', (req, res, next) => {
  sherpa.client.getTokens()
    .then((tokens) => {
      res.json({tokens});
    })
    .catch((err) => res.json({error: 'error'}));
});


module.exports = router;
