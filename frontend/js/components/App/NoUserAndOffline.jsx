import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../../selectors/offline';
import { getUser, getIsUpdating } from '../../selectors/user/data';


class NoUserAndOffline extends Component {
  render() {
    const { isOffline, user } = this.props;
    console.log('####', isOffline, user); // eslint-disable-line

    if (!isOffline || (isOffline && user && user.id)) {
      return null;
    }

    return (
      <div>
        <h2>Ingen internettforbindelse</h2>
        <p>
          Du må være tilkoblet internett for å kunne logg inn.
        </p>
        <p>
          Etter innlogging, vil informasjonen om ditt medlemsskap være lagret,
          {' '}
          og du kan åpne uten internettforbindelse.
        </p>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  isOffline: getIsOffline(state),
  user: getUser(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(NoUserAndOffline);

export default connectedComponent;
