import { fetchUser as fetchUserAPI } from '../api/user';
import { getIsFetching } from '../selectors/user';


// eslint-disable-next-line
export const update = () => (dispatch, getState) => {
  if (getIsFetching(getState())) {
    return Promise.resolve();
  }

  dispatch({type: 'USER_FETCH_REQUEST'});

  return fetchUserAPI().then(
    (response) => {
      dispatch({
        type: 'USER_FETCH_SUCCESS',
        data: response.user,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_FETCH_FAILURE',
        message: error.message || 'Noe gikk galt',
      });
    }
  );
};
