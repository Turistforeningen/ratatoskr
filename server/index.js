'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const { Environment, FileSystemLoader } = require('nunjucks');
const NunjuckCustomWebLoader = require('./utils/nunjucks-custom-web-loader');

const controllers = require('./controllers');
const session = require('./lib/session');

// Initiate express app and router
const app = express();

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
app.use('/assets', express.static(`${__dirname}/assets`));


// Configure nunjucks template engine
const nunjucksOptions = {
  autoescape: true,
  noCache: process.env.NODE_ENV !== 'production',
};

const nunjucksEnvironment = new Environment(
  process.env.NODE_ENV === 'production' ?
    new FileSystemLoader(`${__dirname}/templates`, nunjucksOptions) :
    new NunjuckCustomWebLoader(
      'http://assets.medlem.dnt.local/server/templates',
      nunjucksOptions
    )
);
nunjucksEnvironment.express(app);


// Set the base router
app.use(process.env.VIRTUAL_PATH, controllers);


// Start the express app
if (!module.parent) {
  const port = process.env.VIRTUAL_PORT || 8080;

  app.listen(port);
  console.log(`Server listening on port ${port}`); // eslint-disable-line
}


module.exports = app;
module.exports.nunjucks = nunjucksEnvironment;
