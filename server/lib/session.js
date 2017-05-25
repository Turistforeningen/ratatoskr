'use strict';

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redis = require('./redis');
const settings = require('./settings');


module.exports = session({
  resave: false,
  saveUninitialized: false,
  secret: settings.APP_SECRET,
  secure: process.env.NODE_ENV === 'production',
  store: new RedisStore({client: redis}),
});
