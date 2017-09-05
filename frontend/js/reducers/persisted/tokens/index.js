import { combineReducers } from 'redux';


const accessToken = (state = null, action) => {
  if (
    action.type === 'USER_UPDATE_COMMIT' &&
    !action.payload.HEADER_OPTS.accessToken
  ) {
    return null;
  }

  if (!action.payload || !action.payload.HEADER_OPTS) {
    return state;
  }

  return action.payload.HEADER_OPTS.accessToken
    ? action.payload.HEADER_OPTS.accessToken
    : state;
};


const refreshToken = (state = null, action) => {
  if (
    action.type === 'USER_UPDATE_COMMIT' &&
    !action.payload.HEADER_OPTS.refreshToken
  ) {
    return null;
  }

  if (!action.payload || !action.payload.HEADER_OPTS) {
    return state;
  }

  return action.payload.HEADER_OPTS.refreshToken
    ? action.payload.HEADER_OPTS.refreshToken
    : state;
};


const tokensReducer = combineReducers({
  accessToken,
  refreshToken,
});


export default tokensReducer;
