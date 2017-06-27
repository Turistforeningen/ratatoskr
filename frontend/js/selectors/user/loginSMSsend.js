
export const getIsPending = (state) =>
  state.user.loginSMSsend.pending;


export const getErrorMessage = (state) =>
  state.user.loginSMSsend.errorMessage;
