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
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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


export const loginAdminToken = (userId, token) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/login/admin-token';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({userId, token})},
    };

    fetch(url, options)
      .then(checkStatus)
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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


export const selectUser = (phoneNumber, userId, smsVerifyToken) => {
  const promise = new Promise((resolve, reject) => {
    const url = '/api/user/sms-code/select-user';
    const options = {
      ...fetchOptions.POST,
      ...{body: JSON.stringify({phoneNumber, userId, smsVerifyToken})},
    };

    fetch(url, options)
      .then(checkStatus)
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
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
      .then(({res, headerOpts}) => {
        if (!res.ok) {
          reject(res.text().then((msg) => new Error(msg)));
        }

        res.json()
          .then((json) => {
            resolve({...json, HEADER_OPTS: headerOpts});
          })
          .catch((err) => {
            reject(new Error(err));
          });
      });
  });

  return promise;
};
