import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getLastUpdated } from '../../selectors/user/data';
import { getVersion } from '../../selectors/version';

import Logout from './Logout.jsx';
import ExternalA from '../common/ExternalA.jsx';


class Footer extends Component {
  @autobind
  renderLastUpdate() {
    const { lastUpdated } = this.props;
    const pad = '00';
    const ddStr = lastUpdated.getDate().toString();
    const DD = pad.substring(0, 2 - ddStr.length) + ddStr;
    const mmStr = lastUpdated.getMonth().toString();
    const MM = pad.substring(0, 2 - mmStr.length) + mmStr;
    const YYYY = lastUpdated.getFullYear();
    const hhStr = lastUpdated.getHours().toString();
    const HH = pad.substring(0, 2 - hhStr.length) + hhStr;
    const iiStr = lastUpdated.getMinutes().toString();
    const II = pad.substring(0, 2 - iiStr.length) + iiStr;

    return `${DD}.${MM}.${YYYY} ${HH}:${II}`;
  }

  render() {
    const { version } = this.props;
    const year = new Date().getFullYear();

    return (
      <div className="container">
        <footer>
          <nav>
            <Logout />

            <div className="updated-timestamp">
              Medlemsdetaljer sist oppdatert: {this.renderLastUpdate()}
            </div>

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
  lastUpdated: getLastUpdated(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Footer);

export default connectedComponent;
