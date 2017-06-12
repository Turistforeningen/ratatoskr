import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
  getIsPending,
  getErrorMessage,
  getWasSuccess,
} from '../../selectors/user/reset';
import { reset } from '../../actions/user/login';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../ExternalA.jsx';
import ResetError from './ResetError.jsx';
import ResetIntro from './ResetIntro.jsx';
import ResetSuccess from './ResetSuccess.jsx';


class Reset extends Component {
  @autobind
  onSubmit() {
    const { actions } = this.props;
    actions.reset(this.emailInput.value);
  }

  render() {
    const { pending, errorMessage, onCancel, wasSuccess } = this.props;

    return (
      <form class="login-form" onSubmit={this.onSubmit}>
        <h4>Gjennopprett passordet ditt</h4>
        {wasSuccess ? null : <ResetError error={errorMessage} />}
        {wasSuccess ? null : <ResetIntro error={errorMessage} />}
        {!wasSuccess ? null : <ResetSuccess email={this.emailInput.value} />}
        {wasSuccess ? null : (
          <div>
            <div>
              <label htmlFor="reset-form-email">E-post</label>
              <input
                id="reset-form-email"
                ref={(node) => { this.emailInput = node; }}
                defaultValue=""
                disabled={pending}
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
              >
                Gjenopprett
              </LaddaButton>
              <button
                onClick={onCancel}>
                Avbryt
              </button>
            </div>
            <div className="login-form__link-container">
              <br />
              <ExternalA href="https://www.dnt.no/minside/logg-inn/#registrering">
                Opprett DNT-bruker
              </ExternalA>
            </div>
          </div>
        )}
        {!wasSuccess ? null : (
          <button
            onClick={onCancel}
            className="success">
            Gå tilbake
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
});


const connectedComponent = connect(
  mapStateToProps,
  {reset},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Reset);

export default connectedComponent;
