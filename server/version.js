'use strict';

const fs = require('fs');


const version = {tag: 'unknown'};

fs.readFile(`${__dirname}/version-tag`, {encoding: 'utf-8'}, (err, data) => {
  console.log('File is read'); // eslint-disable-line
  if (err) {
    console.log('UNABLE TO READ VERSION FILE'); // eslint-disable-line
    console.log(err); // eslint-disable-line
  } else {
    version.tag = data.trim();
  }
  console.log('Version set', version); // eslint-disable-line
  console.log('data', data); // eslint-disable-line
});


module.exports = version;
