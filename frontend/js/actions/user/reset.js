import { getIsPending } from '../../selectors/user/reset';
import { reset as APIreset } from '../../api/user';


// eslint-disable-next-line
export const reset = (inputEmail) => (dispatch, getState) => {
  if (getIsPending(getState())) {
    return Promise.resolve();
  }

  const email = inputEmail.trim();
  if (!email) {
    dispatch({
      type: 'USER_RESET_COMMIT',
      payload: {
        VERSION_TAG: null,
        error: 'empty email',
      },
    });
    return Promise.resolve();
  }

  dispatch({
    type: 'USER_RESET',
  });

  return APIreset(email).then(
    (response) => {
      dispatch({
        type: 'USER_RESET_COMMIT',
        payload: response,
      });
    },
    (error) => {
      dispatch({
        type: 'USER_RESET_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};
