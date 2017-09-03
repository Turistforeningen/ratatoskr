import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
  getIsPending,
  getErrorMessage,
} from '../../../selectors/user/loginAdminToken';
import { closeAdminTokenLogin } from '../../../actions/user/loginAdminToken';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import Error from './Error.jsx';
import Success from './Success.jsx';


class AdminToken extends Component {
  @autobind
  onClose(e) {
    const { actions } = this.props;
    e.preventDefault();
    actions.closeAdminTokenLogin();
  }

  render() {
    const { pending, errorMessage } = this.props;

    return (
      <div>
        <h4>Logger inn med engangslenke</h4>

        {pending ? (
          <span>Vennligst vent...</span>
        ) : (
          <div>
            <Error error={errorMessage} />
            <button
              onClick={this.onClose}
              type="button"
              className="success">
              Gå tilbake
            </button>
          </div>
        )}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  pending: getIsPending(state),
  errorMessage: getErrorMessage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {closeAdminTokenLogin},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(AdminToken);

export default connectedComponent;
