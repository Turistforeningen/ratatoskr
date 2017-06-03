'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { Environment, FileSystemLoader } = require('nunjucks');
const NunjuckCustomWebLoader = require('./utils/nunjucks-custom-web-loader');
const Raven = require('raven');

const environment = require('./lib/environment');
const version = require('./version');
const controllers = require('./controllers');
const session = require('./lib/session');
const settings = require('./lib/settings');
const User = require('./models/User');

// Initialize Raven
if (environment.production) {
  Raven.config(settings.SENTRY_DSN).install();
}

// Initiate express app and set Raven request handler
const app = express();
if (environment.production) {
  app.use(Raven.requestHandler());
}

app.set('x-powered-by', false);

app.use(bodyParser.json());

// Initiate session handling
app.use(session);
if (environment.production) {
  // https://github.com/expressjs/session#cookiesecure
  app.set('trust proxy', 1);
}

// Serve assests
// Assets are built through Webpack and will be loaded using webpack dev server
// when in development mode
app.use('/assets', express.static('/ratatoskr/build/assets'));
app.use('/sw.js', express.static('/ratatoskr/build/sw.js'));


// Configure nunjucks template engine
const nunjucksOptions = {
  autoescape: true,
  noCache: environment.ifProduction(false, true),
};

const nunjucksEnvironment = new Environment(
  environment.ifProduction(
    new FileSystemLoader('/ratatoskr/build/templates', nunjucksOptions),
    new NunjuckCustomWebLoader(
      'http://assets.medlem.dnt.local/templates',
      nunjucksOptions
    )
  )
);

// Set express app on the Nunjucks environment
nunjucksEnvironment.express(app);

// Set global template variables
nunjucksEnvironment
  .addGlobal('GA_CODE', settings.GA_CODE);

version.promise.then((tag) => {
  nunjucksEnvironment.addGlobal('VERSION', tag);
}).catch(() => {});


// Set user on request object
app.use((req, res, next) => {
  const userId = req.session ? req.session.userId : null;
  if (!userId) {
    res.user = null;
    nunjucksEnvironment.addGlobal('user', null);
    next();
  } else {
    const user = User();
    user.load(userId).then(() => {
      req.user = user;
      nunjucksEnvironment.addGlobal('user', user);
      next();
    });
  }
});


// Set the base router
app.use(process.env.VIRTUAL_PATH, controllers);

// Add Raven error handler
if (environment.production) {
  app.use(Raven.errorHandler());
}

// Fallthrough error handler
app.use((err, req, res, next) => {
  res.statusCode = 500;
  if (environment.production) {
    res.end(res.sentry);
  } else {
    next(err);
  }
});

// Start the express app
if (!module.parent) {
  const port = process.env.VIRTUAL_PORT || 8080;

  app.listen(port);
  console.log(`Server listening on port ${port}`); // eslint-disable-line
}


module.exports = app;
module.exports.nunjucks = nunjucksEnvironment;
