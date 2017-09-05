
// eslint-disable-next-line
export const getTokens = (state) => ({
  accessToken: state.persisted.tokens.accessToken,
  refreshToken: state.persisted.tokens.refreshToken,
});
