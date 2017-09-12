import {
  login as APIlogin,
  reset as APIreset,
} from '../../api/user';


export const setLoginMethod = (method) => ({
  type: 'USER_LOGIN_SET_METHOD',
  method,
});


export const clearErrors = () => ({
  type: 'USER_LOGIN_CLEAR_ERROR',
});
