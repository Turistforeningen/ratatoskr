import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SEND_SMS':
      return true;
    case 'USER_LOGIN_SEND_SMS_COMMIT':
    case 'USER_LOGIN_SEND_SMS_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SEND_SMS':
    case 'USER_LOGIN_SEND_SMS_COMMIT':
    case 'USER_LOGIN_CLEAR_ERROR':
      return null;
    case 'USER_LOGIN_SEND_SMS_ROLLBACK':
      return action.payload.error
        ? action.payload.error
        : 'network error';
    default:
      return state;
  }
};


const loginSMSsend = combineReducers({
  pending,
  errorMessage,
});


export default loginSMSsend;
