import { getIsPending } from '../../selectors/user/loginSMSselectUser';
import { selectUser as APIselectUser } from '../../api/user';


export const selectUser = (inputPhoneNumber, userId, smsVerifyToken) =>
  (dispatch, getState) => {
    if (getIsPending(getState())) {
      return Promise.resolve();
    }

    const phoneNumber = inputPhoneNumber.trim();
    if (!phoneNumber) {
      dispatch({
        type: 'USER_LOGIN_SMS_SELECT_USER_COMMIT',
        payload: {
          VERSION_TAG: null,
          error: 'invalid credentials',
        },
      });
      return Promise.resolve();
    }

    dispatch({
      type: 'USER_LOGIN_SMS_SELECT_USER',
    });

    return APIselectUser(phoneNumber, userId, smsVerifyToken)
      .then((response) => {
        dispatch({
          type: 'USER_LOGIN_SMS_SELECT_USER_COMMIT',
          payload: response,
        });

        // Scroll to top
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        dispatch({
          type: 'USER_LOGIN_SMS_SELECT_USER_ROLLBACK',
          payload: {
            error: err.message || 'unknown error',
          },
        });
      });
  };


export const clearUsers = () => ({
  type: 'USER_LOGIN_SMS_SELECT_USER_RESET_LIST',
});
