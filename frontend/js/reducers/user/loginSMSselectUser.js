import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SMS_SELECT_USER':
      return true;
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SMS_SELECT_USER':
      return null;
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_LOGIN_SMS_SELECT_USER_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const users = (state = [], action) => {
  switch (action.type) {
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
      return action.payload.users
        ? action.payload.users
        : [];
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_RESET_LIST':
      return [];
    default:
      return state;
  }
};


const smsVerifyToken = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
      return action.payload.smsVerifyToken
        ? action.payload.smsVerifyToken
        : null;
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_RESET_LIST':
      return null;
    default:
      return state;
  }
};


const loginSMSselectUser = combineReducers({
  pending,
  errorMessage,
  users,
  smsVerifyToken,
});


export default loginSMSselectUser;
