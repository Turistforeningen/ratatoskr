import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import { getIsOffline } from '../../selectors/offline';
import { getUser } from '../../selectors/user/data';


class NoUserAndOffline extends Component {
  render() {
    const { isOffline, user, translate } = this.props;

    if (!isOffline || (isOffline && user && user.id)) {
      return null;
    }

    return (
      <div>
        <h2>{ translate('offline.title') }</h2>
        <p>{ translate('offline.line1') }</p>
        <p>{ translate('offline.line2') }</p>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  isOffline: getIsOffline(state),
  user: getUser(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(NoUserAndOffline);

export default connectedComponent;
