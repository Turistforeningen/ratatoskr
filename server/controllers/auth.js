'use strict';

const querystring = require('querystring');
const fetch = require('isomorphic-fetch');
const redis = require('../lib/redis');
const { Router } = require('express');

const settings = require('../lib/settings');


const router = new Router();
let redirectUri;


// Redirect to OAuth provider or display errors
router.get('/', (req, res, next) => {
  if (req.query.error) {
    return res.render('index.html', {
      error: {
        title: 'Feil ved innlogging',
        message: `
          En uventet feil oppstod ved innlogging. Du kan forsøke igjen,
          og ta kontakt med oss hvis problemet vedvarer.
        `,
        code: req.query.error_description,
      },
    });
  }

  redirectUri = `${req.protocol}://${req.hostname}${req.baseUrl}/verifiser`;
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
router.get('/verifiser', (req, res, next) => {
  // If there is an error, redirect to login
  if (req.query.error) {
    return res.redirect(`/logg-inn?${querystring.stringify(req.query)}`);
  }

  const code = req.query.code;
  const url = `${settings.OAUTH_DOMAIN}/o/token/`;
  const credentials = new Buffer(
    `${settings.OAUTH_CLIENT_ID}:${settings.OAUTH_CLIENT_SECRET}`
  ).toString('base64');

  let tokens;
  let user;

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
        throw new Error('Feil ved innlogging.');
      }
      return result;
    })
    .then((result) => result.json())
    .then((json) => {
      tokens = Object.assign({}, json);
      return json;
    })
    // Fetch membership data
    .then((json) => (
      fetch(`${settings.OAUTH_DOMAIN}/api/oauth/medlemsdata/`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
    ))
    .then((result) => result.json())
    .then((json) => {
      user = Object.assign({}, json);
      req.session.user = user.sherpa_id;
      return redis.hmset(`${user.sherpa_id}`, 'user', JSON.stringify(user));
    })
    .then((result) => (
      redis.hmset(`${user.sherpa_id}`, 'tokens', JSON.stringify(tokens))
    ))
    // Fetch membership household
    .then((json) => (
      fetch(`${settings.OAUTH_DOMAIN}/api/oauth/medlemsdata/husstanden/`, {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
    ))
    .then((result) => result.json())
    .then((household) => (
      redis.hmset(`${user.sherpa_id}`, 'household', JSON.stringify(household))
    ))

    // Redirect user
    .then((result) => {
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
      res.redirect('/?error=1');
    });

  verify.catch((err) => {
    console.error(err);  // eslint-disable-line no-console
  });
});


module.exports = router;
