import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

import { getUser } from '../../selectors/user/data';
import { logout } from '../../actions/user/logout';


class Logout extends Component {
  @autobind
  logout() {
    const { actions } = this.props;
    actions.logout();
  }

  render() {
    const { user, translate } = this.props;

    if (!user || !user.id) {
      return null;
    }

    return (
      <ul className="footer-menu">
        <li className="footer-menu__item">
          <a onClick={this.logout}>{ translate('footer.logout') }</a>
        </li>
      </ul>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {logout},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(Logout);

export default connectedComponent;
