import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import {
  getLastUsedEmail,
  getIsPending,
  getErrorMessage,
} from '../../../../selectors/user/loginDNTUser';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class LoginForm extends Component {
  constructor(props) {
    super(props);
    const { lastUsedEmail } = props;

    this.state = {
      validEmail: !!(lastUsedEmail || '').length,
      validPass: false,
    };
  }

  @autobind
  onSubmit(e) {
    const { onSubmit } = this.props;
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value.trim();
    onSubmit(email, password);

    e.preventDefault();
  }

  @autobind
  onChange(field) {
    return (e) => {
      this.setState({ [`valid${field}`]: !!e.target.value.trim() });
    };
  }

  render() {
    const {
      pending,
      errorMessage,
      toggleReset,
      toggleSMS,
      lastUsedEmail,
      translate,
    } = this.props;
    const { validEmail, validPass } = this.state;

    return (
      <form class="login-form" onSubmit={this.onSubmit}>
        <h4>{ translate('login.dnt_user.form.title') }</h4>
        <Error error={errorMessage} />
        <Intro error={errorMessage} />
        <div>
          <label htmlFor="login-form-email">
            { translate('login.dnt_user.form.email') }
          </label>
          <input
            id="login-form-email"
            ref={(node) => { this.emailInput = node; }}
            defaultValue={lastUsedEmail || ''}
            disabled={pending}
            onChange={this.onChange('Email')}
            type="email"/>
        </div>
        <div>
          <label htmlFor="login-form-password">
            { translate('login.dnt_user.form.password') }
          </label>
          <input
            id="login-form-password"
            ref={(node) => { this.passwordInput = node; }}
            defaultValue=""
            disabled={pending}
            onChange={this.onChange('Pass')}
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
            disabled={!validEmail || !validPass}
          >
            { translate('login.dnt_user.form.login') }
          </LaddaButton>
        </div>
        <div className="login-form__link-container">
          <a onClick={toggleReset}>
            { translate('login.dnt_user.form.toggle_reset') }
          </a>
          <br />
          <ExternalA href="https://www.dnt.no/minside/logg-inn/#registrering">
            { translate('login.dnt_user.form.create_user') }
          </ExternalA>
          <br />
          <br />
          <a onClick={toggleSMS}>
            { translate('login.dnt_user.form.toggle_sms_login') }
          </a>
        </div>
      </form>
    );
  }
}


const mapStateToProps = (state) => ({
  pending: getIsPending(state),
  errorMessage: getErrorMessage(state),
  lastUsedEmail: getLastUsedEmail(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(LoginForm);

export default connectedComponent;
