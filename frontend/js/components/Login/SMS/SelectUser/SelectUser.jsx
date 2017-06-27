import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUserList } from '../../../../selectors/user/loginSMSselectUser';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import ExternalA from '../../../common/ExternalA.jsx';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class SelectUser extends Component {
  @autobind
  select(userId) {
    return (e) => {
      const { onSelect } = this.props;
      e.preventDefault();
      onSelect(userId);
    };
  }

  @autobind
  onCancel(e) {
    const { onCancel } = this.props;
    e.preventDefault();
    onCancel();
  }

  render() {
    const { userList } = this.props;

    return (
      <div>
        {userList.map((user) =>
          <div
            key={user.id}
            className="box box--inactive">
            <div className="box__section">
              <a onClick={this.select(user.id)}>
                {user.firstName} {user.lastName}
              </a>
              {user.isMember ? null : (
                <div>
                  Ikke medlem
                </div>
              )}
              {!user.membershipType || !user.isMember ? null : (
                <div>
                  {user.membershipType}
                </div>
              )}
              {!user.memberid ? null : (
                <div>
                  Medlemsnummer: {user.memberid}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="login-form__button-container">
          <button
            onClick={this.onCancel}>
            Avbryt
          </button>
        </div>

      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  userList: getUserList(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(SelectUser);

export default connectedComponent;
