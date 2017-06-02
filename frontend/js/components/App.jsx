import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { testAction } from '../actions/test';
import { getInit } from '../selectors/test';


class App extends Component {
  @autobind
  testTrigger(e) {
    const { testAction: te } = this.props;
    te();
    console.log(this.props); // eslint-disable-line
  }

  render() {
    const { init } = this.props;
    return (
      <div>
        <h1>Hello world</h1>
        <a onClick={this.testTrigger}>Test me!</a>
        <h3>{init}</h3>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  init: getInit(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {testAction}
)(App);

export default connectedComponent;
