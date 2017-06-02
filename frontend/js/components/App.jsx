import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { fetchUser } from '../actions/user';
import { getUser, getIsFetching, getErrorMessage } from '../selectors/user';


class App extends Component {
  @autobind
  fetchUser(e) {
    const { actions } = this.props;
    actions.fetchUser();
  }

  render() {
    const { init } = this.props;
    return (
      <div>
        <h1>Hello world</h1>
        <a onClick={this.fetchUser}>Fetch user!</a>
        <h3>{init}</h3>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  isFetching: getIsFetching(state),
  errorMessage: getErrorMessage(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {fetchUser},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(App);

export default connectedComponent;
