import { checkStatus, fetchOptions } from './api-utils';


export default ({url, ...effectOpts}) => {
  const method = effectOpts.method || 'GET';
  const defaultOptions = fetchOptions[effectOpts.method];
  const options = { ...defaultOptions, ...effectOpts };

  return fetch(url, options)
    .then(checkStatus)
    .then((res) => (
      res.ok
        ? res.json()
        : Promise.reject(res.text().then((msg) => new Error(msg)))
    ));
};
