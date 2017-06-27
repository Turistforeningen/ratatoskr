
export const getIsActive = (state) =>
  state.user.loginSMSverify.active;


export const getIsPending = (state) =>
  state.user.loginSMSverify.pending;


export const getErrorMessage = (state) =>
  state.user.loginSMSverify.errorMessage;
