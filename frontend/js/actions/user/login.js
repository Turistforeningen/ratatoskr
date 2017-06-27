import { getIsPending } from '../../selectors/user/login';
import {
  login as APIlogin,
  reset as APIreset,
} from '../../api/user';


export const login = (inputEmail, password, userId) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  const email = inputEmail.trim();
  if (!email || !password) {
    dispatch({
      type: 'USER_LOGIN_COMMIT',
      payload: {
        VERSION_TAG: null,
        error: 'invalid credentials',
      },
    });
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_LOGIN',
  });

  return APIlogin(email, password, userId).then(
    (response) => {
      dispatch({
        type: 'USER_LOGIN_COMMIT',
        payload: response,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_LOGIN_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};


export const clearUsers = () => ({
  type: 'USER_LOGIN_RESET_USER_LIST',
});
