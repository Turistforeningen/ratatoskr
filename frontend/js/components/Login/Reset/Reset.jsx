import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
  getIsPending,
  getErrorMessage,
  getWasSuccess,
} from '../../../selectors/user/reset';
import { reset } from '../../../actions/user/reset';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';
import Success from './Success.jsx';


class Reset extends Component {
  @autobind
  onSubmit(e) {
    const { actions } = this.props;
    actions.reset(this.emailInput.value);

    e.preventDefault();
  }

  render() {
    const { pending, errorMessage, onCancel, wasSuccess } = this.props;

    return (
      <form class="login-form" onSubmit={this.onSubmit}>
        <h4>Gjennopprett passordet ditt</h4>
        {wasSuccess ? null : <Error error={errorMessage} />}
        {wasSuccess ? null : <Intro error={errorMessage} />}
        {!wasSuccess ? null : <Success email={this.emailInput.value} />}
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
                type="button"
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
            type="button"
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