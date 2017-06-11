import { combineReducers } from 'redux';


const pending = (state = false, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
      return true;
    case 'USER_UPDATE_COMMIT':
    case 'USER_UPDATE_ROLLBACK':
      return false;
    default:
      return state;
  }
};


const errorMessage = (state = null, action) => {
  switch (action.type) {
    case 'USER_UPDATE':
    case 'USER_UPDATE_COMMIT':
      return null;
    case 'USER_UPDATE_ROLLBACK':
      return 'err';
      // return action.message;
    default:
      return state;
  }
};


const loginReducer = combineReducers({
  pending,
  errorMessage,
});


export default loginReducer;
