import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../../selectors/offline';
import { getUser } from '../../selectors/user/data';
import { getIsPending as getIsUpdating } from '../../selectors/user/update';
import {
  getIsPending,
  getUserList,
  getErrorMessage,
} from '../../selectors/user/login';
import {
  getIsActive as getIsAdminTokenLoginActive,
} from '../../selectors/user/loginAdminToken';
import {
  getSmsVerifyToken,
} from '../../selectors/user/loginSMSselectUser';
import { login, clearUsers } from '../../actions/user/login';
import { sendSMS } from '../../actions/user/loginSMSsend';
import { verifySMScode } from '../../actions/user/loginSMSverify';
import {
  selectUser,
  clearUsers as SMSclearUsers,
} from '../../actions/user/loginSMSselectUser';

import AdminToken from './AdminToken/AdminToken.jsx';
import Reset from './Reset/Reset.jsx';
import DNTUser from './DNTUser/DNTUser.jsx';
import SMS from './SMS/SMS.jsx';
import UserSelect from './UserSelect/UserSelect.jsx';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      reset: false,
      phoneNumber: null,
      view: 'dnt-user',
    };
  }

  @autobind
  login(email, password, userId) {
    const { actions } = this.props;
    this.setState({email, password});
    actions.login(email, password, userId);
  }

  @autobind
  sendSMS(phoneNumber) {
    const { actions } = this.props;
    this.setState({phoneNumber});
    actions.sendSMS(phoneNumber);
  }

  @autobind
  verifySMS(code) {
    const { actions } = this.props;
    actions.verifySMScode(this.state.phoneNumber, code);
  }

  @autobind
  selectUser(userId) {
    const { actions, smsVerifyToken } = this.props;
    const { view, phoneNumber } = this.state;
    if (view === 'sms') {
      actions.selectUser(phoneNumber, userId, smsVerifyToken);
    } else {
      actions.login(this.state.email, this.state.password, userId);
    }
  }

  @autobind
  resetUserSelectList() {
    const { actions } = this.props;
    const { view } = this.state;
    if (view === 'sms') {
      actions.SMSclearUsers();
    } else {
      actions.clearUsers();
    }
  }

  @autobind
  toggleReset() {
    this.setState({
      view: 'reset',
    });
  }

  @autobind
  toggleDNTUser() {
    this.setState({
      view: 'dnt-user',
    });
  }

  @autobind
  toggleSMS() {
    this.setState({
      view: 'sms',
    });
  }

  @autobind
  renderSMS() {
    const { userList } = this.props;
    const { reset } = this.state;

    return userList.length || reset
      ? null
      : (
        <SMS
          onSubmitPhoneNumber={this.sendSMS}
          onSubmitCode={this.verifySMS}
          toggleReset={this.toggleReset} />
      );
  }

  @autobind
  renderDNTUser() {
    const { userList } = this.props;
    const { reset } = this.state;

    return userList.length || reset
      ? null
      : (
        <DNTUser
          onSubmit={this.login}
          toggleReset={this.toggleReset} />
      );
  }

  @autobind
  renderReset() {
    const { userList } = this.props;
    const { reset } = this.state;

    return !reset
      ? null
      : (
        <Reset
          onCancel={this.toggleReset}/>
      );
  }

  @autobind
  renderUserSelect() {
    const { userList } = this.props;
    return !userList.length
      ? null
      : (
        <UserSelect
          onSelect={this.selectUser}
          onCancel={this.toggleDNTUser} />
      );
  }

  render() {
    const {
      user,
      isOffline,
      isUpdating,
      errorMessage,
      adminTokenLoginIsActive,
    } = this.props;

    if (isOffline || isUpdating || (user && user.id)) {
      return null;
    }

    if (adminTokenLoginIsActive) {
      return <AdminToken />;
    }

    const { view } = this.state;

    switch (view) {
      // Reset password for DNT user
      case 'reset':
        return (
          <Reset
            onCancel={this.toggleDNTUser}/>
        );

      // Login form for DNT user
      case 'dnt-user':
        return (
          <DNTUser
            onSubmit={this.login}
            toggleReset={this.toggleReset}
            toggleSMS={this.toggleSMS} />
        );

      // SMS login form (default)
      default:
        return (
          <SMS
            onSubmitSend={this.sendSMS}
            onSubmitCode={this.verifySMS}
            onSelectUser={this.selectUser}
            toggleDNTUser={this.toggleDNTUser}
            onResetuserList={this.resetUserSelectList} />
        );
    }

    // return (
    //   <div>
    //     {this.renderSMS()}
    //     {this.renderForm()}
    //     {this.renderReset()}
    //     {this.renderUserSelect()}
    //   </div>
    // );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isUpdating: getIsUpdating(state),
  isOffline: getIsOffline(state),
  isPending: getIsPending(state),
  errorMessage: getErrorMessage(state),
  userList: getUserList(state),
  adminTokenLoginIsActive: getIsAdminTokenLoginActive(state),
  smsVerifyToken: getSmsVerifyToken(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {
    login,
    clearUsers,
    sendSMS,
    verifySMScode,
    selectUser,
    SMSclearUsers,
  },
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Login);

export default connectedComponent;
