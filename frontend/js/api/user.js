import { checkStatus, fetchOptions } from './api-utils';


// eslint-disable-next-line
export const fetchUser = (aktivitetId) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/me';

    fetch(url, fetchOptions.GET)
      .then(checkStatus)
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });

  return promise;
};
