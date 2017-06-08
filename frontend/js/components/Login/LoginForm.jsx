import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { login } from '../../actions/user';


class LoginForm extends Component {
  @autobind
  attemptLogin() {
    const { actions } = this.props;
    actions.login();
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="login-form-email">Brukernavn</label>
          <input id="login-form-email" type="text"/>
        </div>
        <div>
          <label htmlFor="login-form-password">Passord</label>
          <input id="login-form-password" type="password"/>
        </div>
        <div>
          <button onClick={this.attemptLogin}>Login</button>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({});


const connectedComponent = connect(
  mapStateToProps,
  {login},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(LoginForm);

export default connectedComponent;
