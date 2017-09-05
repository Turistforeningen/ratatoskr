import { combineReducers } from 'redux';

import user from './user';
import tokens from './tokens';


const persistedReducer = combineReducers({
  user,
  tokens,
});


export default persistedReducer;
