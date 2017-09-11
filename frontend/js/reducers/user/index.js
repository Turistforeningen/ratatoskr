import { combineReducers } from 'redux';

import update from './update';
import logout from './logout';
import loginDNTUser from './loginDNTUser';
import loginSMSsend from './loginSMSsend';
import loginSMSverify from './loginSMSverify';
import loginSMSselectUser from './loginSMSselectUser';
import loginAdminToken from './loginAdminToken';
import reset from './reset';


const userReducer = combineReducers({
  logout,
  loginDNTUser,
  loginSMSsend,
  loginSMSverify,
  loginSMSselectUser,
  loginAdminToken,
  update,
  reset,
});


export default userReducer;
