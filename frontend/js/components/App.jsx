import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { update } from '../actions/user';
import { getIsOffline } from '../selectors/offline';
import { getVersion } from '../selectors/version';
import { getUser, getIsFetching, getErrorMessage } from '../selectors/user';

import User from './User.jsx';
import Logo from './Logo.jsx';
import Login from './Login/Login.jsx';


class App extends Component {
  @autobind
  update(e) {
    const { actions } = this.props;
    actions.update();
  }

  @autobind
  renderPleaseWait() {
    const { user, isFetching } = this.props;

    if ((user && user.id) || !isFetching) {
      return null;
    }

    return (
      <h1 class="header">
        <em>Vennligst vent...</em>
      </h1>
    );
  }

  @autobind
  renderMainContent() {
    const { user } = this.props;

    if (!user || !user.id) {
      return null;
    }

    return (
      <div>
        <h1 class="header">Mitt medlemsskap</h1>
        <User user={user} />

        {!user.household.mainMember ? null : (
          <div>
            <h2 class="header--sub">Hovedmedlem</h2>
            <User
              user={user.household.mainMember}
              subUser={true} />
          </div>
        )}

        {!user.household.members || !user.household.members.length ? null : (
          <div>
            <h2 class="header--sub">
              {user.household.isFamilyMember ?
                'Familiemedlemmer' :
                'Hustandsmedlemmer'
              }
            </h2>
            {user.household.members.map((u) => (
              <User
                key={u.id}
                user={u}
                subUser={true} />
            ))}
          </div>
        )}
      </div>
    );
  }

  render() {
    const { user, isOffline, version } = this.props;
    const year = new Date().getFullYear();

    return (
      <div>
        <header>
          <Logo />

          <div className="header-menu">
            {isOffline ? '[Offline mode]' : null}
            {' '}
            {!user || !user.id ? null : <a href="/logout">Logg ut</a>}
          </div>
        </header>

        <div className="container">
          {this.renderPleaseWait()}
          <Login />
          {this.renderMainContent()}
        </div>

        <footer>
          <nav>
            <ul className="footer-menu">
              <li className="footer-menu__item">
                <a href="https://www.dnt.no/medlem/">Mer om medlemsskap</a>
              </li>
              <li className="footer-menu__item">
                <a href="https://www.dnt.no/">Mer om DNT</a>
              </li>
              <li className="footer-menu__item">
                <a href="https://www.dnt.no/personvern/">Personvern</a>
              </li>
            </ul>
          </nav>

          <div>
            &copy; {year} - Den Norske Turistforening
          </div>

          <div className="version">
            {version}
          </div>
        </footer>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isFetching: getIsFetching(state),
  errorMessage: getErrorMessage(state),
  isOffline: getIsOffline(state),
  version: getVersion(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {update},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);

export default connectedComponent;
