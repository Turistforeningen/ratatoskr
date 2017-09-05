
export const getUser = (state) => state.persisted.user.data;


export const getLastUpdated = (state) => (
  state.persisted.user.lastUpdated
    ? new Date(state.persisted.user.lastUpdated)
    : null
);
