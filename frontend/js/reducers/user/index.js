import { combineReducers } from 'redux';

import fetch from './fetch';
import update from './update';
import login from './login';


const userReducer = combineReducers({
  fetch,
  login,
  update,
});


export default userReducer;
