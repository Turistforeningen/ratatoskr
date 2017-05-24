'use strict';

const fetch = require('isomorphic-fetch');
const { Loader } = require('nunjucks');


const fetchTemplateFromUrl = (url, cb) => {
  fetch(url)
    .then((response) => {
      if (response.status >= 400) {
        cb({
          status: response.status,
          content: response.text,
        });
      } else {
        response.text().then((text) => {
          cb(null, text);
        });
      }
    })
    .catch((err) => {
      throw new Error('Some fetchTemplateFromUrl error occured', err);
    });
};


const NunjuckCustomWebLoader = Loader.extend({
  async: true,

  init: (baseURL) => {
    this.baseURL = baseURL || '.';
  },

  getSource: (name, cb) => {
    const useCache = this.useCache;
    let result;
    fetchTemplateFromUrl(`${this.baseURL}/${name}`, (err, src) => {
      if (err) {
        if (cb) {
          cb(err.content);
        } else if (err.status === 404) {
          result = null;
        } else {
          throw err.content;
        }
      } else {
        result = {
          src,
          path: name,
          noCache: !useCache,
        };
        if (cb) {
          cb(null, result);
        }
      }
    });
  },
});


module.exports = NunjuckCustomWebLoader;
