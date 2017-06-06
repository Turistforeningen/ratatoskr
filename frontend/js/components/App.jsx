import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { update } from '../actions/user';
import { getIsOffline } from '../selectors/offline';
import { getUser, getIsFetching, getErrorMessage } from '../selectors/user';

import User from './User.jsx';
import Logo from './Logo.jsx';


class App extends Component {
  @autobind
  update(e) {
    const { actions } = this.props;
    actions.update();
  }

  render() {
    const { user, isOffline } = this.props;

    if (!user || !user.id) {
      return <span>Venligst vent!</span>;
    }

    return (
      <div className="container">
        <div class="top-menu">
          {isOffline ? '[Offline mode]' : null}
          {' '}
          <a href="/logout">Logg ut</a>
        </div>


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
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isFetching: getIsFetching(state),
  errorMessage: getErrorMessage(state),
  isOffline: getIsOffline(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {update},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);

export default connectedComponent;
