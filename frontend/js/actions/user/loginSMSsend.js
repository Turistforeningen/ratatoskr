import { getIsPending } from '../../selectors/user/loginSMSsend';
import { sendSMS as APIsendSMS } from '../../api/user';


// eslint-disable-next-line
export const sendSMS = (inputPhoneNumber) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  const phoneNumber = inputPhoneNumber.trim();
  if (!phoneNumber) {
    dispatch({
      type: 'USER_LOGIN_SEND_SMS_ROLLBACK',
      payload: {
        error: 'invalid phone number',
      },
    });
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_LOGIN_SEND_SMS',
    phoneNumber,
  });

  return APIsendSMS(phoneNumber)
    .then((response) => {
      dispatch({
        type: 'USER_LOGIN_SEND_SMS_COMMIT',
        payload: response,
      });

      // Scroll to top
      window.scrollTo(0, 0);
    })
    .catch((err) => {
      dispatch({
        type: 'USER_LOGIN_SEND_SMS_ROLLBACK',
        payload: {
          error: err.message || 'unknown error',
        },
      });

      // Scroll to top
      window.scrollTo(0, 0);
    });
};
