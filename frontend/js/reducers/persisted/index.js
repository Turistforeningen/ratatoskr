import { combineReducers } from 'redux';

import user from './user';
import tokens from './tokens';


const language = (state = 'no', action) => {
  switch (action.type) {
    case '@@localize/SET_ACTIVE_LANGUAGE':
      return action.payload.languageCode;
    default:
      return state;
  }
};


const persistedReducer = combineReducers({
  user,
  tokens,
  language,
});


export default persistedReducer;
