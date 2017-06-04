'use strict';

const https = require('https');


module.exports = (path) => {
  const promise = new Promise((resolve, reject) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    https.get(`https://a.test.bi/${path}`, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        resolve(rawData);
      });
    }).on('error', (e) => {
      throw e;
    });
  });

  return promise;
};
