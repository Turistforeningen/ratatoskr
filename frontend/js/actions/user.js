import { fetchUser as fetchUserAPI } from '../api/user';
import { getIsFetching } from '../selectors/user';


// eslint-disable-next-line
export const update = () => ({
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

// eslint-disable-next-line
export const login = () => ({
  type: 'USER_LOGIN',
  meta: {
    offline: {
      effect: {
        url: '/api/user/login',
        method: 'POST',
      },
      commit: { type: 'USER_LOGIN_COMMIT' },
      rollback: { type: 'USER_LOGIN_ROLLBACK' },
    },
  },
});
