
export const getIsActive = (state) =>
  state.persisted.user.smsVerificationInProgress;


export const getIsPending = (state) =>
  state.user.loginSMSverify.pending;


export const getErrorMessage = (state) =>
  state.user.loginSMSverify.errorMessage;
