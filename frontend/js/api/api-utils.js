
export const fetchOptions = {
  GET: {
    credentials: 'same-origin',
  },
};


export const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;

  throw error;
};
