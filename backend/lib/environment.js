'use strict';

const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');


const isDirectory = (source) => lstatSync(source).isDirectory();


const environment = {
  native: process.env.IS_NATIVE === '1',
  production: process.env.NODE_ENV === 'production',
  development: process.env.NODE_ENV === 'development',
  test: process.env.NODE_ENV === 'test',
};


environment.ifNative = (a, b) => (environment.native ? a : b);
environment.ifProduction = (a, b) => (environment.production ? a : b);
environment.ifDevelopment = (a, b) => (environment.development ? a : b);
environment.ifTest = (a, b) => (environment.test ? a : b);


environment.getFaviconsFolderName = () => {
  const assetsPath = environment.ifProduction('/ratatoskr/build/assets', '/');

  return readdirSync(assetsPath)
    .map((name) => ({path: join(assetsPath, name), name}))
    .filter((item) => isDirectory(item.path))
    .map((item) => item.name)
    .filter((name) => name.substr(0, 9) === 'favicons-')
    .concat(['favicons'])[0];
};


module.exports = environment;
