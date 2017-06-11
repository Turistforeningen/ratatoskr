'use strict';

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const redis = require('./redis');
const settings = require('./settings');
const environment = require('./environment');


module.exports = session({
  resave: false,
  saveUninitialized: false,
  secret: settings.APP_SECRET,
  secure: environment.ifProduction(true, false),
  store: new RedisStore({client: redis}),
  name: 'sessionid',
});
