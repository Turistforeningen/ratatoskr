import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getVersion } from '../../selectors/version';

import Logout from './Logout.jsx';


class Footer extends Component {
  render() {
    const { version } = this.props;
    const year = new Date().getFullYear();

    return (
      <footer>
        <nav>
          <ul className="footer-menu">
            <Logout />
            <li className="footer-menu__item">
              <a href="https://www.dnt.no/medlem/">Mer om medlemsskap</a>
            </li>
            <li className="footer-menu__item">
              <a href="https://www.dnt.no/">Mer om DNT</a>
            </li>
            <li className="footer-menu__item">
              <a href="https://www.dnt.no/personvern/">Personvern</a>
            </li>
          </ul>
        </nav>

        <div>
          &copy; {year} - Den Norske Turistforening
        </div>

        <div className="version">
          {version}
        </div>
      </footer>
    );
  }
}


const mapStateToProps = (state) => ({
  version: getVersion(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Footer);

export default connectedComponent;
