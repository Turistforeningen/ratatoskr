import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../../selectors/offline';
import { getUser, getIsFetching, getErrorMessage } from '../../selectors/user';

import LoginForm from './LoginForm.jsx';


class Login extends Component {
  render() {
    const { isOffline, isFetching, errorMessage } = this.props;

    if (isOffline || isFetching || errorMessage) {
      return null;
    }

    return (
      <div>
        <LoginForm />
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
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Login);

export default connectedComponent;
