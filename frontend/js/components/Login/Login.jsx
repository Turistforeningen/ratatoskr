import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../../selectors/offline';
import { getUser, getIsUpdating } from '../../selectors/user/data';

import LoginForm from './LoginForm.jsx';
import { login } from '../../actions/user/login';


class Login extends Component {
  @autobind
  login(email, password, userId) {
    const { actions } = this.props;
    actions.login(email, password, userId);
  }

  render() {
    const { isOffline, isUpdating, errorMessage } = this.props;

    if (isOffline || isUpdating) {
      return null;
    }

    return (
      <div>
        <LoginForm
          onSubmit={this.login}/>
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
  {login},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Login);

export default connectedComponent;
