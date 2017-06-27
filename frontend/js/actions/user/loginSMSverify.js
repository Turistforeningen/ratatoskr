import { getIsPending } from '../../selectors/user/loginSMSverify';
import { verifySMScode as APIverifySMScode } from '../../api/user';


export const verifySMScode = (inputPhoneNumber, inputCode) =>
  (dispatch, getState) => {
    if (getIsPending(getState())) {
      return Promise.resolve();
    }

    const phoneNumber = inputPhoneNumber.trim();
    const code = inputCode.trim();
    if (!phoneNumber || !code) {
      dispatch({
        type: 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT',
        payload: {
          VERSION_TAG: null,
          error: 'invalid credentials',
        },
      });
      return Promise.resolve();
    }

    dispatch({
      type: 'USER_LOGIN_VERIFY_SMS_CODE',
    });

    return APIverifySMScode(phoneNumber, code).then(
      (response) => {
        dispatch({
          type: 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT',
          payload: response,
        });
      },
      (error) => {
        dispatch({
          type: 'USER_LOGIN_VERIFY_SMS_CODE_ROLLBACK',
          message: error.message || 'unknown error',
        });
      }
    );
  };


export const cancel = () => ({
  type: 'USER_LOGIN_VERIFY_SMS_CODE_CANCEL',
});
