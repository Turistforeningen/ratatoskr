
export const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
};


export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  if (response.status === 401) {
    window.location = '/login';
  }

  const error = new Error(response.statusText);
  error.response = response;

  throw error;
};
