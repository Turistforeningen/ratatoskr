import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsPending, getErrorMessage } from '../../selectors/user/login';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import FormError from './FormError.jsx';
import FormIntro from './FormIntro.jsx';


class Form extends Component {
  @autobind
  onSubmit() {
    const { onSubmit } = this.props;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    onSubmit(email, password);
  }

  render() {
    const { onSubmit, pending, errorMessage } = this.props;

    return (
      <form class="login-form" onSubmit={this.onSubmit}>
        <h4>Logg inn med din DNT bruker.</h4>
        <FormError error={errorMessage} />
        <FormIntro error={errorMessage} />
        <div>
          <label htmlFor="login-form-email">Brukernavn</label>
          <input
            id="login-form-email"
            ref={(node) => { this.emailInput = node; }}
            defaultValue=""
            disabled={pending}
            type="email"/>
        </div>
        <div>
          <label htmlFor="login-form-password">Passord</label>
          <input
            id="login-form-password"
            ref={(node) => { this.passwordInput = node; }}
            defaultValue=""
            disabled={pending}
            type="password"/>
        </div>
        <div className="login-form__button-container">
          <LaddaButton
            loading={pending}
            onClick={this.onSubmit}
            data-size={L}
            data-style={EXPAND_LEFT}
            data-spinner-size={20}
            data-spinner-color="#ddd"
            data-spinner-lines={12}
            className="success"
          >
            Logg inn
          </LaddaButton>
        </div>
      </form>
    );
  }
}


const mapStateToProps = (state) => ({
  pending: getIsPending(state),
  errorMessage: getErrorMessage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Form);

export default connectedComponent;
