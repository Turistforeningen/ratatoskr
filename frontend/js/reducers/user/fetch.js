import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
      return true;
    case 'USER_FETCH_COMMIT':
    case 'USER_FETCH_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_FETCH':
      return null;
    case 'USER_FETCH_COMMIT':
      return action.payload.error
        ? action.payload.error
        : null;
    case 'USER_FETCH_ROLLBACK':
      return 'network error';
    default:
      return state;
  }
};


const loginReducer = combineReducers({
  pending,
  errorMessage,
});


export default loginReducer;
