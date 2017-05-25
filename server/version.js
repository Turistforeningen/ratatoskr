'use strict';

const fs = require('fs');


const version = {tag: 'unknown'};

fs.readFile(`${__dirname}/version-tag`, {encoding: 'utf-8'}, (err, data) => {
  if (err) {
    console.log('UNABLE TO READ VERSION FILE'); // eslint-disable-line
    console.log(err); // eslint-disable-line
  } else {
    version.tag = data.trim();
  }
});


module.exports = version;
