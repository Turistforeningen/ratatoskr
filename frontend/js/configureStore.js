import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers/index.js';


const configureStore = (initialData) => {
  const middlewares = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  const store = createStore(
    rootReducer,
    initialData,
    applyMiddleware(...middlewares),
  );

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept(
      './reducers',
      () => {
        const nextRootReducer = require('./reducers/index.js').default;
        store.replaceReducer(nextRootReducer);
      }
    );
  }

  return store;
};


export default configureStore;
