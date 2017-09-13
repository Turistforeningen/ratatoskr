import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

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
    } = this.props;
    const { resent, valid } = this.state;

    return (
      <div>
        <form class="login-form" onSubmit={this.onSubmit}>
          <h4>Skriv inn koden du fikk på SMS</h4>
          <Error
            error={errorMessage}
            resent={this.resent}
            sendPending={this.sendPending}
            onResendCode={this.onResendCode} />
          <Intro error={errorMessage} />
          <div>
            <label htmlFor="login-form-code">Innloggingskode</label>
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
              Logg inn
            </LaddaButton>
            <button
              type="button"
              onClick={this.onCancel}>
              Avbryt
            </button>
          </div>
          <div className="login-form__link-container">
            {resent ? (
              <div>
                <em>
                  Vi har sendt koden på nytt!
                </em>
              </div>
            ) : (
              <div>
                Fikk du den ikke?
                <br />
                {sendPending ? (
                  <em>Sender ny kode...</em>
                ) : (
                  <a onClick={this.onResendCode}>
                    Send koden på nytt
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="login-form__link-container">
            Har du en DNT-bruker?<br />
            <a
              href="#"
              onClick={this.toggleDNTUser} >
              Logg inn med brukernavn og passord
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
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Verify);

export default connectedComponent;
