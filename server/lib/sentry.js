'use strict';

const Client = require('raven').Client;
const settings = require('./settings');


module.exports = new Client(settings.SENTRY_DSN);


if (settings.SENTRY_DSN) {
  module.exports.patchGlobal((id, err) => {
    /* eslint-disable no-console */
    console.error('Uncaught Exception');
    console.error(err.message);
    console.error(err.stack);
    /* eslint-enable */
    process.exit(1);
  });
}
