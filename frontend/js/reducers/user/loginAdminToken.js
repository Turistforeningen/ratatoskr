import { combineReducers } from 'redux';


const active = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_ADMIN_TOKEN':
      return true;
    case 'USER_LOGIN_ADMIN_TOKEN_CLOSE':
      return false;
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT':
      return !!action.payload.error;
    default:
      return state;
  }
};


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN_ADMIN_TOKEN':
      return true;
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT':
    case 'USER_LOGIN_ADMIN_TOKEN_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN_ADMIN_TOKEN':
      return null;
    case 'USER_LOGIN_ADMIN_TOKEN_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_LOGIN_ADMIN_TOKEN_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const loginAdminToken = combineReducers({
  active,
  pending,
  errorMessage,
});


export default loginAdminToken;
