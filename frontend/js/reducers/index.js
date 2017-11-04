import { combineReducers } from 'redux';
import { localeReducer as locale } from 'react-localize-redux';

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
  locale,
  version,
});


export default rootReducer;
