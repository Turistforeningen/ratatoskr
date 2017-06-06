import { combineReducers } from 'redux';

import user from './user';
import version from './version';


// Bootstrap offline reducer to avoid errors when Hot Module Reloading
// changes to reducers
const offline = (state = {}, action) => state;


const rootReducer = combineReducers({
  offline,
  user,
  version,
});


export default rootReducer;
