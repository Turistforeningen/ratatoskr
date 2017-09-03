import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_RESET':
      return true;
    case 'USER_RESET_COMMIT':
    case 'USER_RESET_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const success = (state = false, action) => {
  switch (action.type) {
    case 'USER_RESET':
    case 'USER_RESET_ROLLBACK':
    case 'USER_RESET_CLOSE':
      return false;
    case 'USER_RESET_COMMIT':
      return !!action.payload.success;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_RESET':
      return null;
    case 'USER_RESET_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_RESET_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const resetReducer = combineReducers({
  pending,
  errorMessage,
  success,
});


export default resetReducer;
