import { checkStatus, fetchOptions } from './api-utils';


// eslint-disable-next-line
export const login = (email, password, userId) => {
  const promise = new Promise((resolve, reject) => {
    const url = userId
      ? `/api/user/login/${userId}`
      : '/api/user/login';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({email, password})},
    };

    fetch(url, options)
      .then(checkStatus)
      .then(({res, versionTag}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, VERSION_TAG: versionTag});
          })
          .catch((err) => {
            reject(new Error(err));
          });
      });
  });

  return promise;
};

// eslint-disable-next-line
export const logout = () => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/logout';

    fetch(url, fetchOptions.GET)
      .then(checkStatus)
      .then(({res, versionTag}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, VERSION_TAG: versionTag});
          })
          .catch((err) => {
            reject(new Error(err));
          });
      });
  });

  return promise;
};
