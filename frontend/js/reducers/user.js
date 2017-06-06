import { combineReducers } from 'redux';


const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'USER_FETCH':
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
    case 'USER_FETCH_COMMIT':
      return null;
    case 'USER_FETCH_ROLLBACK':
      return 'err';
      // return action.message;
    default:
      return state;
  }
};


const data = (state = {}, action) => {
  switch (action.type) {
    case 'USER_FETCH_COMMIT':
      return action.payload.user;
    default:
      return state;
  }
};


const userReducer = combineReducers({
  isFetching,
  errorMessage,
  data,
});


export default userReducer;
