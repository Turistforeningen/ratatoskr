import { combineReducers } from 'redux';


const init = (state = 1, action) => {
  switch (action.type) {
    case 'INIT':
      return state + 2;
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  init,
});


export default rootReducer;
