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
        response.text()
          .then((text) => {
            cb(null, text);
          }).catch((err) => {
            cb({
              status: 'Unable to read template',
            });
          });
      }
    })
    .catch((err) => {
      throw new Error(err.message);
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
    try {
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
    } catch (e) {
      // eslint-disable-next-line
      console.log('UNABLE TO LOAD TEMPLATE FROM WEBPACK');
    }
  },
});


module.exports = NunjuckCustomWebLoader;
