import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUserList } from '../../selectors/user/login';


class UserSelect extends Component {
  @autobind
  select(userId) {
    return () => {
      const { onSelect } = this.props;
      onSelect(userId);
    };
  }

  render() {
    const { userList } = this.props;
    return (
      <div>
        {userList.map((user) =>
          <div key={user.id}>
            <a onClick={this.select(user.id)}>
              {JSON.stringify(user)}
            </a>
          </div>
        )}
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
)(UserSelect);

export default connectedComponent;
