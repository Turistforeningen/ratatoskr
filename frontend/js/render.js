import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore from './configureStore';
import { loginAdminToken } from './actions/user/loginAdminToken';
import { logout } from './actions/user/logout';

import Root from './components/Root.jsx';


const container = document.getElementById('root');

const render = (Component, store) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store}/>
    </AppContainer>,
    container
  );
};


function getUrlParam(name) {
  const url = window.location.href;
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


const bootstrap = () => {
  // Render after state redydration is done
  const store = configureStore(() => {
    render(Root, store);

    const admToken = getUrlParam('admtoken');

    // If admin token url-parameter is set
    if (admToken !== null) {
      // Logout if any active user
      store.dispatch(logout());

      // Verify admin token
      const userId = getUrlParam('userid');
      store.dispatch(loginAdminToken(userId, admToken));

      // Replace the url in history
      window.history.replaceState({}, '', '/');
    }

    // Hot Module Replacement API
    if (module.hot) {
      module.hot.accept(
        './components/Root.jsx',
        () => { render(Root, store); }
      );
    }
  });
};

export default bootstrap;
