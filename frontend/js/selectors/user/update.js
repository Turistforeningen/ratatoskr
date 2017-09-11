
export const getIsPending = (state) => state.user.update.pending;


export const getErrorMessage = (state) => state.user.update.errorMessage;


export const getShouldUpdate = (state) => {
  if (!state.user.logout.timestamp) {
    return true;
  }

  const pendingTimestamp = new Date(state.user.update.pendingTimestamp);
  const logoutTimestamp = new Date(state.user.logout.timestamp);

  return pendingTimestamp > logoutTimestamp;
};
