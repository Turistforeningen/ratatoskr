import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUserList } from '../../../selectors/user/loginDNTUser';

import LoginForm from './LoginForm/LoginForm.jsx';
import SelectUser from './SelectUser/SelectUser.jsx';


class DNTUser extends Component {
  render() {
    const {
      onSubmit,
      toggleReset,
      onSelect,
      onResetuserList,
      userList,
      toggleSMS,
    } = this.props;

    if (userList.length) {
      return (
        <SelectUser
          onSelect={onSelect}
          onResetuserList={onResetuserList} />
      );
    }

    return (
      <LoginForm
        onSubmit={onSubmit}
        toggleReset={toggleReset}
        toggleSMS={toggleSMS} />
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
)(DNTUser);

export default connectedComponent;
