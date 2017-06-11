import { getIsPending } from '../../selectors/user/login';
import { login as APIlogin } from '../../api/user';


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
        message: error.message || 'Noe gikk galt',
      });
    }
  );
};


export const clearUsers = () => ({
  type: 'USER_LOGIN_RESET_USER_LIST',
});
