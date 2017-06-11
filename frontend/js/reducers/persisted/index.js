import { combineReducers } from 'redux';

import user from './user';


const persistedReducer = combineReducers({
  user,
});


export default persistedReducer;
