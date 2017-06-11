import { combineReducers } from 'redux';


export default (state = {}, action) => {
  switch (action.type) {
    case 'USER_FETCH_COMMIT':
    case 'USER_UPDATE_COMMIT':
    case 'USER_LOGIN_COMMIT':
      return action.payload.data
        ? action.payload.data
        : state;
    default:
      return state;
  }
};
