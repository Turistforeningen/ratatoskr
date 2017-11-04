import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { setActiveLanguage } from 'react-localize-redux';

import { getIsOffline } from '../selectors/offline';
import { getUser } from '../selectors/user/data';
import { getIsPending as getIsUpdating } from '../selectors/user/update';
import { gePersistedLanguage } from '../selectors/locale';

import NoUserAndOffline from './App/NoUserAndOffline.jsx';
import Footer from './App/Footer.jsx';
import Logo from './App/Logo.jsx';
import Login from './Login/Login.jsx';
import MemberDetails from './MemberDetails/MemberDetails.jsx';


class App extends Component {
  componentWillMount() {
    const { persistedLanguage } = this.props;

    let no = false;
    let testLanguage = '';

    if (persistedLanguage) {
      testLanguage = persistedLanguage;
    } else if (window.navigator.language) {
      testLanguage = window.navigator.language.toLowerCase();
    } else if (window.navigator.languages) {
      if (window.navigator.languages.length) {
        testLanguage = window.navigator.languages[0].toLowerCase();
      }
    } else if (window.navigator.browserLanguage) {
      testLanguage = window.navigator.browserLanguage.toLowerCase();
    }

    if (testLanguage.endsWith('no')) {
      no = true;
    }

    if (!no) {
      const { actions } = this.props;
      actions.setActiveLanguage('en');
    }
  }

  @autobind
  renderPleaseWait() {
    const { user, isUpdating } = this.props;

    if ((user && user.id) || !isUpdating) {
      return null;
    }

    return (
      <h1 className="heading">
        <em>Vennligst vent...</em>
      </h1>
    );
  }

  render() {
    const { user, isOffline } = this.props;

    return (
      <div>
        <div className="mobile-top-bar"></div>

        <div className="header-wrap">
          <header>
            <Logo />

            <div className="header-title">
              DNT Medlem
            </div>
          </header>
        </div>

        <div className="container container--main">
          {this.renderPleaseWait()}
          <Login />
          <MemberDetails />
          <NoUserAndOffline />
        </div>

        <Footer />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isUpdating: getIsUpdating(state),
  isOffline: getIsOffline(state),
  persistedLanguage: gePersistedLanguage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {setActiveLanguage},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);

export default connectedComponent;
