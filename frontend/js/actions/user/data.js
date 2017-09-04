
export const get = () => ({
  type: 'USER_FETCH',
  meta: {
    offline: {
      effect: {
        url: '/api/user/me',
        method: 'GET',
      },
      commit: { type: 'USER_FETCH_COMMIT' },
      rollback: { type: 'USER_FETCH_ROLLBACK' },
    },
  },
});


export const update = () => ({
  type: 'USER_UPDATE',
  meta: {
    offline: {
      effect: {
        url: '/api/user/me/update',
        method: 'POST',
      },
      commit: { type: 'USER_UPDATE_COMMIT' },
      rollback: { type: 'USER_UPDATE_ROLLBACK' },
    },
  },
});
