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
      type: 'USER_LOGIN_SEND_SMS_COMMIT',
      payload: {
        VERSION_TAG: null,
        error: 'invalid credentials',
      },
    });
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_LOGIN_SEND_SMS',
  });

  return APIsendSMS(phoneNumber).then(
    (response) => {
      dispatch({
        type: 'USER_LOGIN_SEND_SMS_COMMIT',
        payload: response,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_LOGIN_SEND_SMS_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};
