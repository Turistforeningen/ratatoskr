import { createStore, applyMiddleware, compose } from 'redux';
import { offline } from 'redux-offline';
import defaultConfig from 'redux-offline/lib/defaults';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import effectReconciler from './api';
import rootReducer from './reducers/index.js';


const configureStore = (cb) => {
  const offlineConfig = {
    ...defaultConfig,
    effect: (effect, _action) => effectReconciler(effect),
    persistCallback: () => { cb(); },
    persistOptions: {
      whitelist: ['persisted', 'offline'],
    },
  };

  const getMiddlewares = () => {
    const middlewares = [thunk];
    if (process.env.NODE_ENV !== 'production') {
      middlewares.push(createLogger());
    }

    return applyMiddleware(...middlewares);
  };

  const store = offline(offlineConfig)(createStore)(
    rootReducer,
    {},
    getMiddlewares()
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
