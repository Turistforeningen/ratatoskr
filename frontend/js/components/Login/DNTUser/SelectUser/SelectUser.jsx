import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

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
      translate,
    } = this.props;

    return (
      <div>
        <h4>{ translate('login.dnt_user.select_user.title') }</h4>
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
                { translate('login.dnt_user.select_user.btn_choose') }
              </LaddaButton>
              <a
                className="block"
                onClick={this.select(user.id)}>
                {user.firstName} {user.lastName}
              </a>
              {user.isMember ? null : (
                <div>
                  { translate('membership_details.types.not_member') }
                </div>
              )}
              {!user.membershipType || !user.isMember ? null : (
                <div>
                  { translate(`membership_details.types.${user.membershipType}`) }
                </div>
              )}
              {!user.memberid ? null : (
                <div>
                  { translate('membership_details.user.memberid') }:{' '}
                  {user.memberid}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="login-form__button-container">
          <button
            onClick={this.onCancel}>
            { translate('login.dnt_user.select_user.btn_cancel') }
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
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(SelectUser);

export default connectedComponent;
