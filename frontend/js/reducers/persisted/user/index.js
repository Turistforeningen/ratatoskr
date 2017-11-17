import { combineReducers } from 'redux';


const loginMethod = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SET_METHOD':
      return action.method;
    default:
      return state;
  }
};


const smsVerificationInProgress = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SEND_SMS_COMMIT':
      return !action.payload.error ? new Date().toString() : false;
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_CANCEL':
      return false;
    default:
      return state;
  }
};


const email = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return action.email;
    default:
      return state;
  }
};


const phoneNumber = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SEND_SMS':
      return action.phoneNumber;
    default:
      return state;
  }
};


const data = (state = {}, action) => {
  switch (action.type) {
    case 'USER_UPDATE_COMMIT':
    case 'USER_LOGIN_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT':
      return action.payload.user
        ? action.payload.user
        : state;
    case 'USER_LOGOUT':
      return {};
    default:
      return state;
  }
};


const lastUpdated = (state = null, action) => {
  switch (action.type) {
    case 'USER_UPDATE_COMMIT':
    case 'USER_LOGIN_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT': {
      return action.payload.user && action.payload.user.id
        ? (new Date()).toString()
        : null;
    }
    case 'USER_LOGOUT':
      return null;
    default:
      return state;
  }
};


const userReducer = combineReducers({
  loginMethod,
  smsVerificationInProgress,
  email,
  phoneNumber,
  data,
  lastUpdated,
});


export default userReducer;
