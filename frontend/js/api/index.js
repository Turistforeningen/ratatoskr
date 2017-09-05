import { checkStatus, fetchOptions } from './api-utils';


export default ({url, ...effectOpts}) => {
  const method = effectOpts.method || 'GET';
  const defaultOptions = fetchOptions[effectOpts.method];

  // Add token headers
  let headers = {};
  if (effectOpts.tokens) {
    headers = {
      'RATATOSKR-AT': effectOpts.tokens.accessToken,
      'RATATOSKR-RT': effectOpts.tokens.refreshToken,
    };
    delete effectOpts.tokens;
  }

  // Set fetch options
  const options = {
    ...defaultOptions,
    ...effectOpts,
    headers: {
      ...defaultOptions.headers,
      ...headers,
    },
  };

  // Run fetch query
  return fetch(url, options)
    .then(checkStatus)
    .then(({res, headerOpts}) => {
      if (!res.ok) {
        return Promise.reject(res.text().then((msg) => new Error(msg)));
      }

      const promise = new Promise((resolve, reject) => {
        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
          })
          .catch((err) => {
            reject(new Error(err));
          });
      });

      return promise;
    });
};
