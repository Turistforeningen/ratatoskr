import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import {
  getIsPending,
  getErrorMessage,
  getWasSuccess,
} from '../../../selectors/user/reset';
import { reset, closeReset } from '../../../actions/user/reset';
import { getLastUsedEmail } from '../../../selectors/user/loginDNTUser';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';
import Success from './Success.jsx';


class Reset extends Component {
  constructor(props) {
    super(props);
    const { email, lastUsedEmail } = props;

    this.state = {
      valid: !!(email || lastUsedEmail || '').length,
    };
  }

  @autobind
  onChange(e) {
    const email = this.emailInput.value.trim();
    this.setState({ valid: !!email.length });
  }

  @autobind
  onSubmit(e) {
    const { actions } = this.props;
    actions.reset(this.emailInput.value.trim());
    e.preventDefault();
  }

  @autobind
  onClose(e) {
    const { actions, onCancel } = this.props;
    e.preventDefault();
    actions.closeReset();
    onCancel();
  }

  render() {
    const {
      pending,
      errorMessage,
      onCancel,
      wasSuccess,
      email,
      lastUsedEmail,
      translate,
    } = this.props;
    const { valid } = this.state;

    return (
      <form class="login-form reset-form" onSubmit={this.onSubmit}>
        <h4>{ translate('login.reset.title') }</h4>
        {wasSuccess ? null : <Error error={errorMessage} />}
        {wasSuccess ? null : <Intro error={errorMessage} />}
        {!wasSuccess ? null : <Success email={this.emailInput.value} />}
        {wasSuccess ? null : (
          <div>
            <div>
              <label htmlFor="reset-form-email">
                { translate('login.reset.email') }
              </label>
              <input
                id="reset-form-email"
                ref={(node) => { this.emailInput = node; }}
                defaultValue=""
                disabled={pending}
                defaultValue={email || lastUsedEmail}
                onChange={this.onChange}
                type="email" />
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
                type="submit"
                disabled={!valid}
              >
                { translate('login.reset.btn_reset') }
              </LaddaButton>
              <button
                type="button"
                onClick={onCancel}>
                { translate('login.reset.btn_cancel') }
              </button>
            </div>
            <div className="login-form__link-container">
              <br />
              <ExternalA href="https://www.dnt.no/minside/logg-inn/#registrering">
                { translate('login.reset.create_user') }
              </ExternalA>
            </div>
          </div>
        )}
        {!wasSuccess ? null : (
          <button
            onClick={this.onClose}
            type="button"
            className="success">
            { translate('login.reset.btn_back') }
          </button>
        )}
      </form>
    );
  }
}


const mapStateToProps = (state) => ({
  pending: getIsPending(state),
  errorMessage: getErrorMessage(state),
  wasSuccess: getWasSuccess(state),
  lastUsedEmail: getLastUsedEmail(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {reset, closeReset},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Reset);

export default connectedComponent;
