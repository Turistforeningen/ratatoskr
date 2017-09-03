import { getIsPending } from '../../selectors/user/login';
import { loginAdminToken as APIloginAdminToken } from '../../api/user';


export const loginAdminToken = (userId, token) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_LOGIN_ADMIN_TOKEN',
  });

  return APIloginAdminToken(userId, token).then(
    (response) => {
      dispatch({
        type: 'USER_LOGIN_ADMIN_TOKEN_COMMIT',
        payload: response,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_LOGIN_ADMIN_TOKEN_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};


export const closeAdminTokenLogin = () => ({
  type: 'USER_LOGIN_ADMIN_TOKEN_CLOSE',
});
