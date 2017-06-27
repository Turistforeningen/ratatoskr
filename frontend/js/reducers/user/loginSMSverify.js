import { combineReducers } from 'redux';


const active = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SEND_SMS_COMMIT':
      return true;
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_CANCEL':
      return false;
    default:
      return state;
  }
};


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_VERIFY_SMS_CODE':
      return true;
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_VERIFY_SMS_CODE':
      return null;
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_LOGIN_VERIFY_SMS_CODE_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const loginSMSverify = combineReducers({
  active,
  pending,
  errorMessage,
});


export default loginSMSverify;
