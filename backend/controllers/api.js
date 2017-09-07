'use strict';

const { Router } = require('express');
const responseTime = require('response-time');

const version = require('../version');
const sherpa = require('../lib/sherpa');
const User = require('../models/User');
const librato = require('../lib/librato');


const router = new Router();


// Log request count and response time to librato
router.use(responseTime((req, res, time) => {
  // General counts and meassurements
  librato.increment(null, 'count');
  librato.measure(null, 'response-time', time);

  // Path specific measurements
  librato.increment(req, 'count');
  librato.measure(req, 'response-time', time);
}));


// Helpers
const setTokenHeaders = (res, user) => {
  if (
    user.OAuthTokens &&
    user.OAuthTokens.access_token &&
    user.OAuthTokens.refresh_token
  ) {
    res.header('RATATOSKR-AT', user.OAuthTokens.access_token);
    res.header('RATATOSKR-RT', user.OAuthTokens.refresh_token);
  }
};


// Add version header
router.use((req, res, next) => {
  res.header('RATATOSKR-VERSION', version.tag);
  next();
});


// Return version
router.get('/version', (req, res, next) => {
  res.json({version: version.tag});
});


// Get user data from Sherpa
router.get('/user/me', (req, res, next) => {
  const accessToken = req.get('RATATOSKR-AT');
  const refreshToken = req.get('RATATOSKR-RT');

  if (!accessToken || !refreshToken) {
    // Tokens are not set, return empty user object (logout)
    librato.increment(req, 'missing-tokens');
    res.json({user: {}});
  } else {
    // Attempt to load user data from sherpa using tokens

    // Initiate user
    const user = User();
    user.setTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Load sherpa data
    user.loadSherpaData()
      .then(() => {
        // Set access and refresh token as header values
        setTokenHeaders(res, user);

        // Return user data
        if (user.id) {
          librato.increment(req, 'ok');
          res.json({user: user.getAPIRepresentation()});
        } else {
          librato.increment(req, 'invalid-tokens');
          res.json({user: {}});
        }
      })
      .catch((err) => {
        librato.increment(req, 'error');
        res.json({err: 'unable to load user data'});
      });
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
        librato.increment(req, 'ok');
        res.json({user: user.getAPIRepresentation()});
      } else {
        librato.increment(req, 'invalid-token');
        res.json({error: 'invalid'});
      }
    })
    .catch((err) => {
      librato.increment(req, 'error');
      res.json({error: 'server-error'});
    });
});


// Login helper
const login = (req, res, next, email, password, userId, smsAuth = false) => {
  sherpa.user.authenticate(email, password, userId, smsAuth)
    .then((data) => {
      if (data.users) {
        const { users } = data;
        librato.increment(req, 'multi-user-response');
        res.json({users});
      } else {
        User().setTokens(data).loadSherpaData()
          .then((user) => {
            if (user.id) {
              // Set access and refresh token as header values
              setTokenHeaders(res, user);

              // Return user data
              librato.increment(req, 'ok');
              res.json({user: user.getAPIRepresentation()});
            } else {
              librato.increment(req, 'missing-userid');
              res.json({error: 'missing user id'});
            }
          })
          .catch((err) => {
            librato.increment(req, 'load-sherpa-data-error');
            res.json({err});
          });
      }
    })
    .catch((err) => {
      const error = err === 'auth-check-error'
        ? (err || 'error')
        : 'invalid credentials';

      librato.increment(req, 'error');
      res.json({error});
    });
};


// Login
router.post(['/user/login', '/user/login/:id'], (req, res, next) => {
  const { email, password } = req.body;
  const userId = req.params.id || null;

  login(req, res, next, email, password, userId);
});


// Generate sms code
router.post(['/user/sms-code/generate'], (req, res, next) => {
  const phoneNumber = (req.body.phoneNumber || '').trim();

  if (!phoneNumber) {
    librato.increment(req, 'invalid-phonenumber');
    res.json({error: 'invalid phone number'});
  } else {
    const body = {phoneNumber};
    sherpa.client.post('users/auth/generate-sms-code/', body)
      .then((data) => {
        librato.increment(req, 'ok');
        res.json({data});
      })
      .catch((err) => {
        const errorMessage = err.payload && err.payload.error
          ? (err.payload.error || 'error')
          : 'unknown error';
        const status = err.status || 503;

        librato.increment(req, 'sherpa-error');
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
    librato.increment(req, 'invalid-phonenumber');
    res.json({error: 'invalid phone number'});
  }

  const body = {phoneNumber, code};
  sherpa.client.post('users/auth/verify-sms-code/', body)
    .then((data) => {
      if (data.users && data.users.length === 1) {
        login(req, res, next, phoneNumber, data.token, null, true);
      } else {
        const { users, token } = data;
        if (!users || !token) {
          librato.increment(req, 'no-users-set');
          res
            .status(503)
            .json({error: 'unknown error'});
        }
        librato.increment(req, 'return-users');
        res.json({
          users,
          smsVerifyToken: token,
        });
      }
    })
    .catch((err) => {
      const errorMessage = err.payload && err.payload.error
        ? err.payload.error
        : 'unknown error';
      const status = err.status || 503;

      librato.increment(req, 'sherpa-error');
      res
        .status(status)
        .json({error: errorMessage});
    });
});


// Select user if sms-code verification resulted in multiple users
router.post(['/user/sms-code/select-user'], (req, res, next) => {
  const userId = req.body.userId || null;
  const phoneNumber = (req.body.phoneNumber || '').trim();
  const smsVerifyToken = (req.body.smsVerifyToken || '').trim();

  let error = null;
  if (!userId) {
    error = 'missing user id';
  }
  if (!phoneNumber) {
    error = 'phone number not set';
  }
  if (!smsVerifyToken) {
    error = 'smsVerifyToken not set';
  }

  if (error) {
    librato.increment(req, error.replace(' ', '-'));
    res
      .status(403)
      .json({error});
  } else {
    librato.increment(req, 'ok');
    login(req, res, next, phoneNumber, smsVerifyToken, userId, true);
  }
});


// Reset password
router.post('/user/reset', (req, res, next) => {
  const { email } = req.body;

  sherpa.client.post('users/reset/', {email})
    .then((json) => {
      if (json.status === 'ok') {
        librato.increment(req, 'ok');
        res.json({success: true});
      } else {
        librato.increment(req, 'reset-error');
        res.json({error: json.status});
      }
    })
    .catch((err) => {
      librato.increment(req, 'error');
      res.json({error: 'sherpa error'});
    });
});


// Reset password
router.post('/user/logout', (req, res, next) => {
  res.json({user: {}});
});


module.exports = router;
