import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getIsOffline } from '../../selectors/offline';
import { getUser, getIsUpdating } from '../../selectors/user/data';
import {
  getIsPending,
  getUserList,
  getErrorMessage,
} from '../../selectors/user/login';

import Reset from './Reset.jsx';
import Form from './Form.jsx';
import UserSelect from './UserSelect.jsx';
import { login } from '../../actions/user/login';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      reset: false,
    };
  }

  @autobind
  login(email, password, userId) {
    const { actions } = this.props;
    this.setState({email, password});
    actions.login(email, password, userId);
  }

  @autobind
  selectUser(userId) {
    const { actions } = this.props;
    actions.login(this.state.email, this.state.password, userId);
  }

  @autobind
  toggleReset() {
    this.setState({
      reset: !this.state.reset,
    });
  }

  @autobind
  renderForm() {
    const { userList } = this.props;
    const { reset } = this.state;

    return userList.length || reset
      ? null
      : (
        <Form
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
          onSelect={this.selectUser}/>
      );
  }

  render() {
    const { user, isOffline, isUpdating, errorMessage } = this.props;

    if (isOffline || isUpdating || (user && user.id)) {
      return null;
    }

    return (
      <div>
        {this.renderForm()}
        {this.renderReset()}
        {this.renderUserSelect()}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isUpdating: getIsUpdating(state),
  isOffline: getIsOffline(state),
  isPending: getIsPending(state),
  errorMessage: getErrorMessage(state),
  userList: getUserList(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {login},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Login);

export default connectedComponent;
