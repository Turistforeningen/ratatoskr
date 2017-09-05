import { combineReducers } from 'redux';


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
  data,
  lastUpdated,
});


export default userReducer;
