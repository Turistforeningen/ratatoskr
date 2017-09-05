import { combineReducers } from 'redux';


const accessToken = (state = null, action) => {
  const { type, payload } = action;
  const { accessToken: token } = ((payload || {}).HEADER_OPTS || {});

  if ((type === 'USER_UPDATE_COMMIT' && !token) || type === 'USER_LOGOUT') {
    return null;
  }

  return token || state;
};


const refreshToken = (state = null, action) => {
  const { type, payload } = action;
  const { refreshToken: token } = ((payload || {}).HEADER_OPTS || {});

  if ((type === 'USER_UPDATE_COMMIT' && !token) || type === 'USER_LOGOUT') {
    return null;
  }

  return token || state;
};


const tokensReducer = combineReducers({
  accessToken,
  refreshToken,
});


export default tokensReducer;
