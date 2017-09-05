// eslint-disable-next-line
export const logout = () => (dispatch, getState) => {
  dispatch({
    type: 'USER_LOGOUT',
  });
};
