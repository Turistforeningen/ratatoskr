'use strict';

const fs = require('fs');

const variables = [
  {
    name: 'APP_SECRET',
  },
  {
    name: 'OAUTH_CLIENT_ID',
  },
  {
    name: 'OAUTH_CLIENT_SECRET',
  },
  {
    name: 'OAUTH_DOMAIN',
    default: 'https://www.dnt.no',
  },
  {
    name: 'SENTRY_DSN',
    env: ['production'],
  },
  {
    name: 'GA_CODE',
    env: ['production'],
  },
];


function getFromJson(file) {
  try {
    return JSON.parse(
      fs.readFileSync(file, {encoding: 'utf-8'})
    );
  } catch (err) {
    throw new Error(`Could not read secrets file "${file}"`);
  }
}


let settings;


// Set settings from secrets file
switch (process.env.NODE_ENV) {
  case 'development':
  case 'test':
    settings = getFromJson(`${__dirname}/../../secrets-dev/dev.json`);
    break;
  case 'production':
    settings = getFromJson('/secrets/prod.json');
    break;
  default:
    throw new Error('Environment variable "NODE_ENV" is undefined or invalid');
}


// Verify that all variables are set from secrets, or use the default value
variables
  .filter((variable) => {
    if (variable.env) {
      return variable.env.includes(process.env.NODE_ENV);
    }
    return true;
  })
  .forEach((variable) => {
    if (typeof settings[variable.name] === 'undefined') {
      if (typeof variable.default !== 'undefined') {
        settings[variable.name] = variable.default;
      } else {
        throw new Error(`Environvent variable ${variable.name} is missing`);
      }
    }
  });


module.exports = settings;
