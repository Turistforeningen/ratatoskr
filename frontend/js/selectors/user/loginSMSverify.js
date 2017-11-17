
export const getIsActive = (state) => {
  const { smsVerificationInProgress } = state.persisted.user;

  if (!smsVerificationInProgress) {
    return false;
  }

  const t1 = new Date(smsVerificationInProgress).getTime();
  const t2 = new Date().getTime();
  const diff = (t2 - t1) / 1000;

  return diff < 5 * 60;
};


export const getIsPending = (state) =>
  state.user.loginSMSverify.pending;


export const getErrorMessage = (state) =>
  state.user.loginSMSverify.errorMessage;
