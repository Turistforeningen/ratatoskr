
// eslint-disable-next-line
export const update = (tokens) => ({
  type: 'USER_UPDATE',
  meta: {
    offline: {
      effect: {
        url: '/api/user/me',
        method: 'GET',
        tokens,
      },
      commit: { type: 'USER_UPDATE_COMMIT' },
      rollback: { type: 'USER_UPDATE_ROLLBACK' },
    },
  },
});
