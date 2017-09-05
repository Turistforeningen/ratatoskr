import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsPending, getErrorMessage } from '../../../selectors/user/login';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class DNTUser extends Component {
  @autobind
  onSubmit(e) {
    const { onSubmit } = this.props;
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    onSubmit(email, password);

    e.preventDefault();
  }

  render() {
    const {
      onSubmit,
      pending,
      errorMessage,
      toggleReset,
      toggleSMS,
    } = this.props;

    return (
      <form class="login-form" onSubmit={this.onSubmit}>
        <h4>Logg inn med din DNT-bruker.</h4>
        <Error error={errorMessage} />
        <Intro error={errorMessage} />
        <div>
          <label htmlFor="login-form-email">E-post</label>
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
        <div className="login-form__link-container">
          <a onClick={toggleReset}>
            Glemt passordet ditt?
          </a>
          <br />
          <ExternalA href="https://www.dnt.no/minside/logg-inn/#registrering">
            Opprett DNT-bruker
          </ExternalA>
          {/* <br />
          <br />
          <a onClick={toggleSMS}>
            Logg inn med SMS
          </a> */}
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
)(DNTUser);

export default connectedComponent;
