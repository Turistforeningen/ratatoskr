'use strict';

const querystring = require('querystring');
const fetch = require('isomorphic-fetch');
const { Router } = require('express');

const settings = require('../lib/settings');
const User = require('../models/User.js');


const router = new Router();
let redirectUri;


router.get('/', (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }

  const context = {};
  if (req.query.error) {
    context.error = 'loginError';
  }

  return res.render('splash.html', context);
});


// Redirect to OAuth provider
router.get('/o', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }

  redirectUri = `https://${req.hostname}${req.baseUrl}/verify`;
  const OAuthURL = (
    `${settings.OAUTH_DOMAIN}/o/authorize/` +
    `?client_id=${settings.OAUTH_CLIENT_ID}` +
    '&response_type=code' +
    `&redirect_uri=${redirectUri}`
  );

  return res.redirect(OAuthURL);
});


// Callback from OAuth provider
// eslint-disable-next-line consistent-return
router.get('/verify', (req, res, next) => {
  // If there is an error, redirect to login
  if (req.query.error) {
    return res.redirect(`/login?${querystring.stringify(req.query)}`);
  }

  const code = req.query.code;
  const url = `${settings.OAUTH_DOMAIN}/o/token/`;
  const credentials = new Buffer(
    `${settings.OAUTH_CLIENT_ID}:${settings.OAUTH_CLIENT_SECRET}`
  ).toString('base64');

  const verify = fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: (
      `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
    ),
  });

  verify
    .then((result) => {
      if (result.status !== 200) {
        throw new Error('OAuth login error');
      }
      return result;
    })
    .then((result) => result.json())
    .then((tokens) => User().setTokens(tokens).loadSherpaData())
    .then((user) => user.save())
    .then((user) => { req.session.userId = user.id; })

    // Redirect user
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      req.session.message = {
        title: 'Feil ved innlogging',
        message: (
          'Det skjedde en feil ved innlogging. Prøv igjen, ' +
          'og ta kontakt dersom feilen vedvarer.'
        ),
      };

      console.log('****** ERROR'); // eslint-disable-line
      console.log(err); // eslint-disable-line

      // TODO: Set some params to make sure login route is not redirecting to OAuth
      res.redirect('/login?error=dntconnecterror');
    });
});


module.exports = router;
