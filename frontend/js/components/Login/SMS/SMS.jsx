import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsActive } from '../../../selectors/user/loginSMSverify';
import { getHasUsers } from '../../../selectors/user/loginSMSselectUser';
import { cancel as verifyCancel } from '../../../actions/user/loginSMSverify';
import Send from './Send/Send.jsx';
import Verify from './Verify/Verify.jsx';
import SelectUser from './SelectUser/SelectUser.jsx';


class SMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: null,
    };
  }

  @autobind
  onSendSubmit(phoneNumber) {
    this.setState({phoneNumber}, this.onSendCode);
  }

  @autobind
  onSendCode() {
    const { onSubmitSend } = this.props;
    const { phoneNumber } = this.state;
    onSubmitSend(phoneNumber);
  }

  @autobind
  onSelectUser(userId) {
    const { onSelectUser } = this.props;
    onSelectUser(userId);

    // Scroll to top
    window.scrollTo(0, 0);
  }

  @autobind
  onVerifySubmit(code) {
    const { onSubmitCode } = this.props;
    onSubmitCode(code);
  }

  @autobind
  onVerifyCancel() {
    const { actions } = this.props;
    actions.verifyCancel();
  }

  @autobind
  onSelectUserCancel() {
    const { onResetuserList } = this.props;
    onResetuserList();
  }

  @autobind
  toggleDNTUser() {
    const { toggleDNTUser } = this.props;
    toggleDNTUser();
  }

  render() {
    const { isVerifyActive, hasUsers } = this.props;
    const { phoneNumber } = this.state;

    if (hasUsers) {
      return (
        <SelectUser
          onSelect={this.onSelectUser}
          onCancel={this.onSelectUserCancel} />
      );
    }

    if (isVerifyActive) {
      return (
        <Verify
          onSubmit={this.onVerifySubmit}
          onCancel={this.onVerifyCancel}
          onResendCode={this.onSendCode}
          toggleDNTUser={this.toggleDNTUser} />
      );
    }

    return (
      <div>
        <Send
          onSubmit={this.onSendSubmit}
          phoneNumber={phoneNumber}
          toggleDNTUser={this.toggleDNTUser} />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  isVerifyActive: getIsActive(state),
  hasUsers: getHasUsers(state),
});


const connectedComponent = connect(
  mapStateToProps,
  { verifyCancel },
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(SMS);

export default connectedComponent;
