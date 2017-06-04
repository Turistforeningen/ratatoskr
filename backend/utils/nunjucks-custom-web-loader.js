'use strict';

const { Loader } = require('nunjucks');

const loadFromWebpackDevServer = require('./load-from-webpack-dev-server');


const NunjuckCustomWebLoader = Loader.extend({
  async: true,

  init: (baseURL) => {
    this.baseURL = baseURL || '.';
  },

  getSource: (name, cb) => {
    const useCache = this.useCache;
    let result;
    try {
      loadFromWebpackDevServer(`${this.baseURL}/${name}`)
        .then((src) => {
          result = {
            src,
            path: name,
            noCache: !useCache,
          };
          if (cb) {
            cb(null, result);
          }
        });
    } catch (e) {
      // eslint-disable-next-line
      console.log('UNABLE TO LOAD TEMPLATE FROM WEBPACK');
      console.log(e); // eslint-disable-line
    }
  },
});


module.exports = NunjuckCustomWebLoader;
