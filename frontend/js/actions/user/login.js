import { getIsPending } from '../../selectors/user/login';
import { login as APIlogin, reset as APIreset } from '../../api/user';


export const login = (email, password, userId) => (dispatch, getState) => {
  if (getIsPending(getState())) {
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


export const reset = (email) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_RESET',
  });

  return APIreset(email).then(
    (response) => {
      dispatch({
        type: 'USER_RESET_COMMIT',
        payload: response,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_RESET_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};
