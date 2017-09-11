import { getUser } from '../../selectors/user/data';
import { getIsPending, getShouldUpdate } from '../../selectors/user/update';
import API from '../../api';


// export const update = (tokens) => ({
//   type: 'USER_UPDATE',
//   meta: {
//     offline: {
//       effect: {
//         url: '/api/user/me',
//         method: 'GET',
//         tokens,
//       },
//       commit: { type: 'USER_UPDATE_COMMIT' },
//       rollback: { type: 'USER_UPDATE_ROLLBACK' },
//     },
//   },
// });


// eslint-disable-next-line
export const update = (tokens) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_UPDATE',
  });

  const opts = {
    url: '/api/user/me',
    method: 'GET',
    tokens,
  };

  return API(opts).then(
    (response) => {
      // Check if user has logged out during the update request. If not,
      // return the user data. If logout has occured, return empty object.
      if (getShouldUpdate(getState())) {
        dispatch({
          type: 'USER_UPDATE_COMMIT',
          payload: response,
        });
      } else {
        dispatch({
          type: 'USER_UPDATE_COMMIT',
          payload: {},
        });
      }
    },
    (error) => {
      dispatch({
        type: 'USER_UPDATE_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};
