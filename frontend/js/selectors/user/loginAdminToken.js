
export const getIsActive = (state) =>
  state.user.loginAdminToken.active;


export const getIsPending = (state) =>
  state.user.loginAdminToken.pending;


export const getErrorMessage = (state) =>
  state.user.loginAdminToken.errorMessage;
