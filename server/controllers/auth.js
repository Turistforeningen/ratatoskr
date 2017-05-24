'use strict';

const querystring = require('querystring');
const fetch = require('isomorphic-fetch');
const redis = require('../lib/redis');
const { Router } = require('express');

const secrets = require('../lib/secrets');


const router = new Router();

const OAUTH_DOMAIN = 'https://www.dnt.no';
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

  redirectUri = (
    `${req.protocol}://${req.hostname}${req.baseUrl}` +
    `/verifiser?next=${req.query.next}`
  );
  const OAuthURL = (
    `${OAUTH_DOMAIN}/o/authorize/?client_id=${secrets.OAUTH_CLIENT_ID}` +
    `&response_type=code&redirect_uri=${redirectUri}`
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
  const url = `${OAUTH_DOMAIN}/o/token/`;
  const credentials = new Buffer(
    `${secrets.OAUTH_CLIENT_ID}:${secrets.OAUTH_CLIENT_SECRET}`
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
    .then((json) => (
      fetch(`${OAUTH_DOMAIN}/api/oauth/medlemsdata/`, {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
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
    .then((result) => {
      if (req.query.next) {
        res.redirect(req.query.next);
      } else {
        res.redirect('/');
      }
    })
    .catch((err) => {
      req.session.message = {
        title: 'Feil ved innlogging',
        message: (
          'Det skjedde en feil ved innlogging. Prøv igjen, ' +
          'og ta kontakt dersom feilen vedvarer.'
        ),
      };

      // TODO: Set some params to make sure login route is not redirecting to OAuth
      res.redirect('/logg-inn');
    });

  verify.catch((err) => {
    console.error(err);  // eslint-disable-line no-console
  });
});


module.exports = router;
