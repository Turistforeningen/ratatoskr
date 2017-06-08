
export const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
};


export const checkStatus = (res) => {
  const versionTag = res.headers.get('RATATOSKR-VERSION');
  if (res.status >= 200 && res.status < 300) {
    return {versionTag, res};
  }

  const error = new Error(res.statusText);
  error.res = res;

  throw error;
};
