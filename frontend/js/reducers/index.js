import { combineReducers } from 'redux';

import persisted from './persisted';
import user from './user';
import version from './version';


// Bootstrap offline reducer to avoid errors when Hot Module Reloading
// changes to reducers
const offline = (state = {}, action) => state;


const rootReducer = combineReducers({
  offline,
  persisted,
  user,
  version,
});


export default rootReducer;
