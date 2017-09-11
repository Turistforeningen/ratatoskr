import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return true;
    case 'USER_LOGIN_COMMIT':
    case 'USER_LOGIN_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
    case 'USER_LOGIN_COMMIT':
    case 'USER_LOGIN_CLEAR_ERROR':
      return null;
    case 'USER_LOGIN_ROLLBACK':
      return action.payload.error
        ? action.payload.error
        : 'network error';
    default:
      return state;
  }
};


const users = (state = [], action) => {
  switch (action.type) {
    case 'USER_LOGIN_COMMIT':
      return action.payload.users
        ? action.payload.users
        : [];
    case 'USER_LOGIN_RESET_USER_LIST':
      return [];
    default:
      return state;
  }
};


const loginDNTUserReducer = combineReducers({
  pending,
  errorMessage,
  users,
});


export default loginDNTUserReducer;
