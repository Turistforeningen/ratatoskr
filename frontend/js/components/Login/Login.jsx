import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import { getIsOffline } from '../../selectors/offline';
import { getUser } from '../../selectors/user/data';
import { getIsPending as getIsUpdating } from '../../selectors/user/update';
import { getLoginMethod } from '../../selectors/user/login';
import {
  getIsActive as getIsAdminTokenLoginActive,
} from '../../selectors/user/loginAdminToken';
import {
  getSmsVerifyToken,
} from '../../selectors/user/loginSMSselectUser';
import { getLastUsedPhoneNumber } from '../../selectors/user/loginSMSsend';
import { clearErrors, setLoginMethod } from '../../actions/user/login';
import { loginDNTUser, clearUsers } from '../../actions/user/loginDNTUser';
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


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      reset: false,
      phoneNumber: props.lastUsedPhoneNumber || null,
      view: props.loginMethod || 'sms',
    };
  }

  @autobind
  login(email, password, userId) {
    const { actions } = this.props;
    this.setState({email, password});
    actions.loginDNTUser(email, password, userId);
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
      actions.loginDNTUser(this.state.email, this.state.password, userId);
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
    const { actions } = this.props;

    actions.clearErrors();

    this.setState({
      view: 'reset',
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }

  @autobind
  toggleDNTUser() {
    const { actions } = this.props;

    actions.clearErrors();
    actions.setLoginMethod('dnt-user');

    this.setState({
      view: 'dnt-user',
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }

  @autobind
  toggleSMS() {
    const { actions } = this.props;

    actions.clearErrors();
    actions.setLoginMethod('sms');

    this.setState({
      view: 'sms',
    });

    // Scroll to top
    window.scrollTo(0, 0);
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
          toggleReset={this.toggleReset}
          onSelect={this.selectUser}
          onCancel={this.toggleDNTUser} />
      );
  }

  @autobind
  renderReset() {
    const { userList } = this.props;
    const { reset, email } = this.state;

    return !reset
      ? null
      : (
        <Reset
          onCancel={this.toggleReset}
          email={email} />
      );
  }

  @autobind
  renderLogin() {
    const {
      user,
      isOffline,
      isUpdating,
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
            onSelect={this.selectUser}
            onResetuserList={this.resetUserSelectList}
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
  }

  render() {
    const { translate } = this.props;

    return (
      <div>
        <div className="login-form">
          <h3>{ translate('login.general_title') }</h3>
        </div>
        { this.renderLogin() }
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  loginMethod: getLoginMethod(state),
  user: getUser(state),
  isUpdating: getIsUpdating(state),
  isOffline: getIsOffline(state),
  adminTokenLoginIsActive: getIsAdminTokenLoginActive(state),
  smsVerifyToken: getSmsVerifyToken(state),
  lastUsedPhoneNumber: getLastUsedPhoneNumber(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {
    loginDNTUser,
    clearUsers,
    sendSMS,
    verifySMScode,
    selectUser,
    SMSclearUsers,
    clearErrors,
    setLoginMethod,
  },
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Login);

export default connectedComponent;
