'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { Environment, FileSystemLoader } = require('nunjucks');
const NunjuckCustomWebLoader = require('./utils/nunjucks-custom-web-loader');
const Raven = require('raven');

const controllers = require('./controllers');
const session = require('./lib/session');
const settings = require('./lib/settings');

// Initialize Raven
if (process.env.NODE_ENV !== 'production') {
  Raven.config(settings.SENTRY_DSN).install();
}

// Initiate express app and set Raven request handler
const app = express();
if (process.env.NODE_ENV !== 'production') {
  app.use(Raven.requestHandler());
}

app.set('x-powered-by', false);

app.use(bodyParser.json());

// Initiate session handling
app.use(session);
if (process.env.NODE_ENV === 'production') {
  // https://github.com/expressjs/session#cookiesecure
  app.set('trust proxy', 1);
}

// Route to assests
// Assets are built through Webpack and will be loaded using webpack dev server
// when in development mode
app.use('/assets', express.static(`${__dirname}/../build/assets`));


// Configure nunjucks template engine
const nunjucksOptions = {
  autoescape: true,
  noCache: process.env.NODE_ENV !== 'production',
};

const nunjucksEnvironment = new Environment(
  process.env.NODE_ENV === 'production' ?
    new FileSystemLoader(`${__dirname}/../build/templates`, nunjucksOptions) :
    new NunjuckCustomWebLoader(
      'http://assets.medlem.dnt.local/templates',
      nunjucksOptions
    )
);
nunjucksEnvironment.express(app);


// Set the base router
app.use(process.env.VIRTUAL_PATH, controllers);

// Add Raven error handler
if (process.env.NODE_ENV !== 'production') {
  app.use(Raven.errorHandler());
}

// Fallthrough error handler
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry);
});

// Start the express app
if (!module.parent) {
  const port = process.env.VIRTUAL_PORT || 8080;

  app.listen(port);
  console.log(`Server listening on port ${port}`); // eslint-disable-line
}


module.exports = app;
module.exports.nunjucks = nunjucksEnvironment;
