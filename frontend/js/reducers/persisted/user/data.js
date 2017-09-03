import { combineReducers } from 'redux';


export default (state = {}, action) => {
  switch (action.type) {
    case 'USER_FETCH_COMMIT':
    case 'USER_UPDATE_COMMIT':
    case 'USER_LOGIN_COMMIT':
    case 'USER_LOGIN_VERIFY_SMS_CODE_COMMIT':
    case 'USER_LOGIN_SMS_SELECT_USER_COMMIT':
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT':
      return action.payload.data
        ? action.payload.data
        : state;
    case 'USER_LOGOUT':
      return {};
    default:
      return state;
  }
};
