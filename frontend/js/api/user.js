import { checkStatus, fetchOptions } from './api-utils';


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
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });

  return promise;
};


export const sendSMS = (phoneNumber) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/sms-code/generate';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({phoneNumber})},
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
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });

  return promise;
};


export const verifySMScode = (phoneNumber, code) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/sms-code/verify';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({phoneNumber, code})},
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
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });

  return promise;
};


export const selectUser = (phoneNumber, userId) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/sms-code/select-user';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({phoneNumber, userId})},
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
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });

  return promise;
};


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


export const reset = (email) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/reset';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({email})},
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
