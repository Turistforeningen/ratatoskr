import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import {
  getUserList,
  getIsPending,
  getErrorMessage,
} from '../../../../selectors/user/loginDNTUser';

import LaddaButton, { L, EXPAND_LEFT } from 'react-ladda';
import Error from './Error.jsx';
import Intro from './Intro.jsx';


class SelectUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUserId: null,
    };
  }

  @autobind
  select(userId) {
    return () => {
      const { onSelect, isPending } = this.props;
      if (!isPending) {
        onSelect(userId);
        this.setState({ selectedUserId: userId });
      }
    };
  }

  @autobind
  onCancel(e) {
    const { onResetuserList } = this.props;
    e.preventDefault();
    onResetuserList();
  }

  render() {
    const { selectedUserId } = this.state;
    const {
      userList,
      isPending,
      errorMessage,
    } = this.props;

    return (
      <div>
        <h4>Vi fant flere brukere</h4>
        <Error error={errorMessage} />
        <Intro error={errorMessage} />

        {userList.map((user) => (
          <div
            key={user.id}
            className="box box--inactive">
            <div className="box__section">
              <LaddaButton
                loading={isPending && selectedUserId === user.id}
                onClick={this.select(user.id)}
                data-size={L}
                data-style={EXPAND_LEFT}
                data-spinner-size={20}
                data-spinner-color="#ddd"
                data-spinner-lines={12}
                disabled={isPending}
                className="btn success btn-sm float-right"
              >
                Velg
              </LaddaButton>
              <a
                className="block"
                onClick={this.select(user.id)}>
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
        ))}

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
  isPending: getIsPending(state),
  errorMessage: getErrorMessage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(SelectUser);

export default connectedComponent;
