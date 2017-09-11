
export const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
  POST: {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};


export const checkStatus = (res) => {
  const headerOpts = {
    version: res.headers.get('RATATOSKR-VERSION'),
    accessToken: res.headers.get('RATATOSKR-AT'),
    refreshToken: res.headers.get('RATATOSKR-RT'),
  };
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve({headerOpts, res});
  }

  return res.json()
    .then((json) => {
      const error = new Error(json.error || 'unknown error');
      error.res = res;
      return Promise.reject(error);
    });
};
