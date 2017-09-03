'use strict';

const { Router } = require('express');

const version = require('../version');
const sherpa = require('../lib/sherpa');
const User = require('../models/User');


const router = new Router();


// Add version header
router.use((req, res, next) => {
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


// Login using admin token
router.post('/user/login/admin-token', (req, res, next) => {
  const { token, userId } = req.body;

  const user = User();
  user.id = userId;
  user.adminToken = token;
  user.loadSherpaData()
    .then(() => {
      if (user.id) {
        res.json({data: user.getAPIRepresentation()});
      } else {
        res.json({error: 'invalid'});
      }
    })
    .catch((err) => {
      res.json({error: 'server-error'});
    });
});


// Login helper
const login = (req, res, next, email, password, userId, smsAuth = false) => {
  sherpa.user.authenticate(email, password, userId, smsAuth)
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
                  req.session.smsCodeToken = null;
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
      req.session.smsCodeToken = null;
      res.json({error: 'invalid credentials'});
    });
};


// Login
router.post(['/user/login', '/user/login/:id'], (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = req.params.id || null;

  login(req, res, next, email, password, userId);
});


// Generate sms code
router.post(['/user/sms-code/generate'], (req, res, next) => {
  const phoneNumber = (req.body.phoneNumber || '').trim();

  if (!phoneNumber) {
    res.json({error: 'invalid phone number'});
  } else {
    const body = {phoneNumber};
    sherpa.client.post('users/auth/generate-sms-code/', body)
      .then((data) => {
        res.json({data});
      })
      .catch((err) => {
        const errorMessage = err.payload && err.payload.error
          ? err.payload.error
          : 'unknown error';
        const status = err.status || 503;
        res
          .status(status)
          .json({error: errorMessage});
      });
  }
});


// Verify sms code
router.post(['/user/sms-code/verify'], (req, res, next) => {
  const phoneNumber = (req.body.phoneNumber || '').trim();
  const code = (req.body.code || '').trim();

  if (!phoneNumber) {
    res.json({error: 'invalid phone number'});
  }

  const body = {phoneNumber, code};
  sherpa.client.post('users/auth/verify-sms-code/', body)
    .then((data) => {
      if (data.users && data.users.length === 1) {
        login(req, res, next, phoneNumber, data.token, null, true);
      } else {
        const users = data.users;
        const token = data.token;
        if (!users || !token) {
          res
            .status(503)
            .json({error: 'unknown error'});
        }
        req.session.smsCodeToken = token;
        res.json({users});
      }
    })
    .catch((err) => {
      const errorMessage = err.payload && err.payload.error
        ? err.payload.error
        : 'unknown error';
      const status = err.status || 503;
      res
        .status(status)
        .json({error: errorMessage});
    });
});


// Select user if sms-code verification resulted in multiple users
router.post(['/user/sms-code/select-user'], (req, res, next) => {
  const userId = req.body.userId || null;
  const phoneNumber = (req.body.phoneNumber || '').trim();
  const token = req.session.smsCodeToken;
  let error = null;
  if (!userId) {
    error = 'missing user id';
  }
  if (!phoneNumber) {
    error = 'phone number not set';
  }
  if (!token) {
    error = 'token not set';
  }

  if (error) {
    res
      .status(403)
      .json({error});
  } else {
    login(req, res, next, phoneNumber, token, userId, true);
  }
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
