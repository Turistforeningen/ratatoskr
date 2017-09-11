import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
  getErrorMessage,
} from '../../../../selectors/user/loginSMSselectUser';


class Selecting extends Component {
  render() {
    const { errorMessage, onResetSelecting } = this.props;

    if (errorMessage) {
      return (
        <div className="login-form">
          <h4>Det oppstod et problem</h4>

          <div className="login-form__error">
            Vi klarte ikke å hente medlemsinformasjonen.
            {' '}Gå tilbake og prøv igjen.
          </div>

          <div className="login-form__button-container">
            <button
              className="success"
              onClick={onResetSelecting}>
              Gå tilbake
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="login-form">
        <h4>Venligst vent, henter medlemsinformasjonen</h4>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  errorMessage: getErrorMessage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Selecting);

export default connectedComponent;
