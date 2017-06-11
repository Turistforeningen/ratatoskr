import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';


class Form extends Component {
  @autobind
  onSubmit() {
    const { onSubmit } = this.props;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    onSubmit(email, password);
  }

  render() {
    const { onSubmit } = this.props;

    return (
      <div>
        <div>
          <label htmlFor="login-form-email">Brukernavn</label>
          <input
            id="login-form-email"
            ref={(node) => { this.emailInput = node; }}
            defaultValue="r@r.com"
            type="email"/>
        </div>
        <div>
          <label htmlFor="login-form-password">Passord</label>
          <input
            id="login-form-password"
            ref={(node) => { this.passwordInput = node; }}
            defaultValue="test123"
            type="password"/>
        </div>
        <div>
          <button onClick={this.onSubmit}>Login</button>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Form);

export default connectedComponent;
