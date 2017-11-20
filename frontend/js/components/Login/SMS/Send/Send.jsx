import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import {
  getIsPending,
  getErrorMessage,
  getLastUsedPhoneNumber,
} from '../../../../selectors/user/loginSMSsend';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import StoreIcons from '../../../common/StoreIcons.jsx';
import ExternalA from '../../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class Send extends Component {
  constructor(props) {
    super(props);
    const { phoneNumber, lastUsedPhoneNumber } = props;

    this.state = {
      valid: !!(phoneNumber || lastUsedPhoneNumber || '').length,
    };
  }

  @autobind
  onChange(e) {
    const phoneNumber = this.phoneNumberInput.value.trim();
    this.setState({ valid: !!phoneNumber.length });
  }

  @autobind
  onSubmit(e) {
    const { onSubmit } = this.props;
    const phoneNumber = this.phoneNumberInput.value.trim();

    e.preventDefault();
    onSubmit(phoneNumber);
  }

  @autobind
  toggleDNTUser(e) {
    const { toggleDNTUser } = this.props;
    e.preventDefault();
    toggleDNTUser();
  }

  render() {
    const {
      pending,
      errorMessage,
      phoneNumber,
      lastUsedPhoneNumber,
      translate,
    } = this.props;
    const { valid } = this.state;

    return (
      <div>
        <StoreIcons />

        <form class="login-form send-form" onSubmit={this.onSubmit}>
          <h4>{ translate('login.sms.send.title') }</h4>
          <Error
            error={errorMessage}
            toggleDNTUser={this.toggleDNTUser} />
          <Intro error={errorMessage} />
          <div>
            <label htmlFor="login-form-phone">
              { translate('login.sms.send.phonenumber') }
            </label>
            <input
              id="login-form-phone"
              ref={(node) => { this.phoneNumberInput = node; }}
              defaultValue={phoneNumber || lastUsedPhoneNumber || ''}
              disabled={pending}
              onChange={this.onChange}
              type="tel"
              noValidate />
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
              { translate('login.sms.send.btn_send') }
            </LaddaButton>
          </div>
          <div className="login-form__link-container">
            { translate('login.sms.send.dnt_user_label') }
            <br />
            <a
              href="#"
              onClick={this.toggleDNTUser} >
              { translate('login.sms.send.btn_dnt_user') }
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
  lastUsedPhoneNumber: getLastUsedPhoneNumber(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Send);

export default connectedComponent;
