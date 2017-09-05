import { getIsPending } from '../../selectors/user/reset';
import { reset as APIreset } from '../../api/user';


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

      // Scroll to top
      window.scrollTo(0, 0);
    },
    (error) => {
      dispatch({
        type: 'USER_RESET_ROLLBACK',
        message: error.message || 'unknown error',
      });
    }
  );
};


export const closeReset = (email) => ({
  type: 'USER_RESET_CLOSE',
});
