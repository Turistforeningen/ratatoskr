import { combineReducers } from 'redux';


const isFetching = (state = false, action) => {
  switch (action.type) {
    case 'USER_FETCH_REQUEST':
      return true;
    case 'USER_FETCH_SUCCESS':
    case 'USER_FETCH_FAILURE':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_FETCH_REQUEST':
    case 'USER_FETCH_SUCCESS':
      return null;
    case 'USER_FETCH_FAILURE':
      return action.message;
    default:
      return state;
  }
};


const data = (state = {}, action) => {
  switch (action.type) {
    case 'USER_FETCH_SUCCESS':
      return action.data;
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
