import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import {
  getIsPending,
  getErrorMessage,
} from '../../../../selectors/user/loginSMSverify';
import {
  getIsPending as getIsSendPending,
  getErrorMessage as getSendErrorMessage,
} from '../../../../selectors/user/loginSMSsend';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class Verify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resent: false,
      valid: false,
      resendThroughError: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { sendPending } = this.props;
    const {
      sendPending: nextSendPending,
      sendErrorMessage: nextSendErrorMessage,
    } = nextProps;

    if (sendPending && !nextSendPending && !nextSendErrorMessage) {
      this.setState({ resent: true });
      setTimeout(() => {
        this.setState({ resent: false });
      }, 5000);
    }
  }

  @autobind
  toggleDNTUser(e) {
    const { toggleDNTUser } = this.props;
    e.preventDefault();
    toggleDNTUser();
  }

  @autobind
  onSubmit(e) {
    const { onSubmit } = this.props;
    const code = this.codeInput.value.trim();

    e.preventDefault();
    onSubmit(code);
  }

  @autobind
  onChange(e) {
    this.setState({ valid: !!this.codeInput.value.trim() });
  }

  @autobind
  onCancel(e) {
    const { onCancel } = this.props;
    e.preventDefault();
    onCancel();
  }

  @autobind
  onResendCode(e) {
    const { onResendCode } = this.props;
    e.preventDefault();
    onResendCode();
  }

  render() {
    const {
      pending,
      errorMessage,
      sendPending,
      sendErrorMessage,
      translate,
    } = this.props;
    const { resent, valid } = this.state;

    return (
      <div>
        <form class="login-form" onSubmit={this.onSubmit}>
          <h4>{ translate('login.sms.verify.title') }</h4>
          <Error
            error={errorMessage}
            resent={this.resent}
            sendPending={this.sendPending}
            onResendCode={this.onResendCode} />
          <Intro error={errorMessage} />
          <div>
            <label htmlFor="login-form-code">
            { translate('login.sms.verify.code') }
            </label>
            <input
              id="login-form-code"
              ref={(node) => { this.codeInput = node; }}
              defaultValue=""
              disabled={pending}
              onChange={this.onChange}
              type="tel"
              noValidate />
            <br />
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
              disabled={!valid}
            >
              { translate('login.sms.verify.btn_login') }
            </LaddaButton>
            <button
              type="button"
              onClick={this.onCancel}>
              { translate('login.sms.verify.btn_cancel') }
            </button>
          </div>
          <div className="login-form__link-container">
            {resent ? (
              <div>
                <em>
                  { translate('login.sms.verify.resend.success') }
                </em>
              </div>
            ) : (
              <div>
                { translate('login.sms.verify.resend.ingress') }
                <br />
                {sendPending ? (
                  <em>{ translate('login.sms.verify.resend.pending') }</em>
                ) : (
                  <a onClick={this.onResendCode}>
                    <em>
                      { translate('login.sms.verify.resend.btn_resend') }
                    </em>
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="login-form__link-container">
            { translate('login.sms.verify.dnt_user.ingress') }<br />
            <a
              href="#"
              onClick={this.toggleDNTUser} >
              { translate('login.sms.verify.dnt_user.btn_login') }
            </a>
          </div>
        </form>

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  pending: getIsPending(state),
  errorMessage: getErrorMessage(state),
  sendPending: getIsSendPending(state),
  sendErrorMessage: getSendErrorMessage(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Verify);

export default connectedComponent;
