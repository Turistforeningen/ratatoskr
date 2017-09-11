import namesort from '../../lib/namesort';


export const getLastUsedEmail = (state) => state.persisted.user.email;


export const getIsPending = (state) => state.user.loginDNTUser.pending;


export const getErrorMessage = (state) => state.user.loginDNTUser.errorMessage;


export const getUserList = (state) =>
  state.user.loginDNTUser.users.sort(namesort('firstName'));
