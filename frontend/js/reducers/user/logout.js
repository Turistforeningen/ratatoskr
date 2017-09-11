import { combineReducers } from 'redux';


const timestamp = (state = null, action) => {
  switch (action.type) {
    case 'USER_LOGOUT':
      return new Date().toString();
    default:
      return state;
  }
};


const logoutReducer = combineReducers({
  timestamp,
});


export default logoutReducer;
