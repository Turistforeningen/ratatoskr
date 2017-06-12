import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../selectors/offline';
import { getUser, getIsUpdating } from '../selectors/user/data';

import Footer from './App/Footer.jsx';
import User from './User.jsx';
import Logo from './Logo.jsx';
import Login from './Login/Login.jsx';


class App extends Component {
  @autobind
  renderPleaseWait() {
    const { user, isUpdating } = this.props;

    if ((user && user.id) || !isUpdating) {
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
    const { user, isOffline } = this.props;

    return (
      <div>
        <header>
          <Logo />

          <div className="header-menu">
            {isOffline ? '[Offline mode]' : null}
          </div>
        </header>

        <div className="container">
          {this.renderPleaseWait()}
          <Login />
          {this.renderMainContent()}
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
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);

export default connectedComponent;
