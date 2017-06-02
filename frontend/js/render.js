import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore from './configureStore';

import Root from './components/Root.jsx';


const store = configureStore();

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store}/>
    </AppContainer>,
    document.getElementById('root')
  );
};


const bootstrap = () => {
  render(Root);

  // Hot Module Replacement API
  if (module.hot) {
    module.hot.accept(
      './components/Root.jsx',
      () => { render(Root); }
    );
  }
};

export default bootstrap;
