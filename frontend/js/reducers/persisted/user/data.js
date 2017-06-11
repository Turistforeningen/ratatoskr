import { combineReducers } from 'redux';


export default (state = {}, action) => {
  switch (action.type) {
    case 'USER_FETCH_COMMIT':
    case 'USER_UPDATE_COMMIT':
      return action.payload.unauthorized
        ? {}
        : action.payload.user;
    default:
      return state;
  }
};
