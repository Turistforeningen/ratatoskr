'use strict';

const fs = require('fs');

const variables = [
  {name: 'APP_SECRET', env: ['development', 'production']},
  {name: 'OAUTH_CLIENT_ID', env: ['development', 'production']},
  {name: 'OAUTH_CLIENT_SECRET', env: ['development', 'production']},
  {name: 'SENTRY_DSN', env: ['production']},
];


// In production mode, set values from /secrets/prod.json
function getFromJson() {
  try {
    return JSON.parse(
      fs.readFileSync('/secrets/prod.json', {encoding: 'utf-8'})
    );
  } catch (err) {
    throw new Error('Could not read secrets file "prod.json"');
  }
}

// In development mode, set values from environment variables
function getFromProcess() {
  return variables
    .filter((variable) => {
      if (variable.env) {
        return variable.env.find((env) => /^development|test$/.test(env));
      }
      return true;
    })
    .reduce((object, variable) => {
      const value = process.env[variable.name];
      object[variable.name] = value;

      return object;
    }, {});
}


// Set secret values
let secrets;

switch (process.env.NODE_ENV) {
  case 'development':
  case 'test':
    secrets = getFromProcess();
    break;
  case 'production':
    secrets = getFromJson();
    break;
  default:
    throw new Error('Environment variable "NODE_ENV" is undefined or invalid');
}


// Verify that all variables are set
variables
  .filter((variable) => {
    if (variable.env) {
      return variable.env.find(
        (env) => new RegExp(process.env.NODE_ENV).test(env)
      );
    }
    return true;
  })
  .forEach((variable) => {
    if (typeof secrets[variable.name] === 'undefined') {
      throw new Error(`Environvent variable ${variable.name} is missing`);
    }
  });


module.exports = secrets;
