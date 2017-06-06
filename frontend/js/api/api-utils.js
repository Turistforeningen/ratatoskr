
export const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
};


export const checkStatus = (res) => {
  if (res.status >= 200 && res.status < 300) {
    const versionTag = res.headers.get('RATATOSKR-VERSION');
    return {versionTag, res};
  }

  if (res.status === 401) {
    window.location = '/login';
  }

  const error = new Error(res.statusText);
  error.res = res;

  throw error;
};
