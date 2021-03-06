import namesort from '../../lib/namesort';


export const getIsPending = (state) =>
  state.user.loginSMSselectUser.pending;


export const getErrorMessage = (state) =>
  state.user.loginSMSselectUser.errorMessage;


export const getUserList = (state) =>
  state.user.loginSMSselectUser.users.sort(namesort('firstName'));


export const getHasUsers = (state) =>
  !!state.user.loginSMSselectUser.users.length;


export const getSmsVerifyToken = (state) =>
  state.user.loginSMSselectUser.smsVerifyToken;
