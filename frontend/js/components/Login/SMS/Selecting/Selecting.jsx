import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import {
  getErrorMessage,
} from '../../../../selectors/user/loginSMSselectUser';


class Selecting extends Component {
  render() {
    const { errorMessage, onResetSelecting, translate } = this.props;

    if (errorMessage) {
      return (
        <div className="login-form">
          <h4>{ translate('login.sms.selecting.error.title') }</h4>

          <div className="login-form__error">
            { translate('login.sms.selecting.error.description') }
          </div>

          <div className="login-form__button-container">
            <button
              className="success"
              onClick={onResetSelecting}>
              { translate('login.sms.selecting.error.btn_back') }
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="login-form">
        <h4>{ translate('login.sms.selecting.pending') }</h4>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  errorMessage: getErrorMessage(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Selecting);

export default connectedComponent;
