/* global ratatoskr */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore from './configureStore';
import { update } from './actions/user';

import Root from './components/Root.jsx';


const container = document.getElementById('root');
const initialState = ratatoskr.user ?
  {user: {data: ratatoskr.user}} :
  {};
const store = configureStore(initialState);


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store}/>
    </AppContainer>,
    container
  );
};


const bootstrap = () => {
  render(Root);
  store.dispatch(update());

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept(
      './components/Root.jsx',
      () => { render(Root); }
    );
  }
};

export default bootstrap;
