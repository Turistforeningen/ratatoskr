import { getIsPending } from '../../selectors/user/loginDNTUser';
import { login as APIlogin } from '../../api/user';


export const loginDNTUser = (inputEmail, password, userId) =>
  (dispatch, getState) => {
    if (getIsPending(getState())) {
      return Promise.resolve();
    }

    const email = inputEmail.trim();
    if (!email || !password) {
      dispatch({
        type: 'USER_LOGIN_ROLLBACK',
        payload: {
          error: 'invalid credentials',
        },
      });
      return Promise.resolve();
    }

    dispatch({
      type: 'USER_LOGIN',
      email,
    });

    return APIlogin(email, password, userId)
      .then((response) => {
        dispatch({
          type: 'USER_LOGIN_COMMIT',
          payload: response,
        });

        // Scroll to top
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        dispatch({
          type: 'USER_LOGIN_ROLLBACK',
          payload: {
            error: err.message || 'unknown error',
          },
        });
      });
  };


export const clearUsers = () => ({
  type: 'USER_LOGIN_RESET_USER_LIST',
});
