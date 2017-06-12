import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getVersion } from '../../selectors/version';

import Logout from './Logout.jsx';
import ExternalA from '../ExternalA.jsx';


class Footer extends Component {
  render() {
    const { version } = this.props;
    const year = new Date().getFullYear();

    return (
      <div className="container">
        <footer>
          <nav>
            <Logout />
            <ul className="footer-menu footer-menu--sub">
              <li className="footer-menu__item">
                <ExternalA href="https://www.dnt.no/medlem/">
                  Mer om medlemsskap
                </ExternalA>
              </li>
              <li className="footer-menu__item">
                <ExternalA href="https://www.dnt.no/">
                  Mer om DNT
                </ExternalA>
              </li>
              <li className="footer-menu__item">
                <ExternalA href="https://www.dnt.no/personvern/">
                  Personvern
                </ExternalA>
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
      </div>
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
