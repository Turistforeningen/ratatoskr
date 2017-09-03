import { combineReducers } from 'redux';

import fetch from './fetch';
import update from './update';
import login from './login';
import loginSMSsend from './loginSMSsend';
import loginSMSverify from './loginSMSverify';
import loginSMSselectUser from './loginSMSselectUser';
import loginAdminToken from './loginAdminToken';
import reset from './reset';


const userReducer = combineReducers({
  fetch,
  login,
  loginSMSsend,
  loginSMSverify,
  loginSMSselectUser,
  loginAdminToken,
  update,
  reset,
});


export default userReducer;
