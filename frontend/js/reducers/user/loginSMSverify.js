import { combineReducers } from 'redux';


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
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_CLEAR_ERROR':
      return null;
    case 'USER_LOGIN_VERIFY_SMS_CODE_ROLLBACK':
      return action.payload.error
        ? action.payload.error
        : 'network error';
    default:
      return state;
  }
};


const loginSMSverify = combineReducers({
  pending,
  errorMessage,
});


export default loginSMSverify;
