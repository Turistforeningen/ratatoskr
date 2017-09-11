import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
      return true;
    case 'USER_UPDATE_COMMIT':
    case 'USER_UPDATE_ROLLBACK':
    case 'USER_LOGOUT':
      return false;
    default:
      return state;
  }
};


const pendingTimestamp = (state = null, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
      return new Date().toString();
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
    case 'USER_LOGOUT':
      return null;
    case 'USER_UPDATE_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_UPDATE_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const loginReducer = combineReducers({
  pending,
  errorMessage,
  pendingTimestamp,
});


export default loginReducer;
