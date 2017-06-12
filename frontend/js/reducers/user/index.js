import { combineReducers } from 'redux';

import fetch from './fetch';
import update from './update';
import login from './login';
import reset from './reset';


const userReducer = combineReducers({
  fetch,
  login,
  update,
  reset,
});


export default userReducer;
