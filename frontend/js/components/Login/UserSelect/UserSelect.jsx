import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUserList } from '../../../selectors/user/login';


class UserSelect extends Component {
  @autobind
  select(userId) {
    return () => {
      const { onSelect } = this.props;
      onSelect(userId);
    };
  }

  render() {
    const { userList, onCancel } = this.props;
    return (
      <div>
        <h4>Vi fant flere brukere</h4>
        <p>
          Det er flere brukere som har samme kombinasjon av epost og passord.
        </p>
        <p>
          Velg den brukeren du ønsker å logge inn med.
        </p>

        {userList.map((user) => (
          <div
            key={user.id}
            className="box box--inactive">
            <div className="box__section">
              <a onClick={this.select(user.id)}>
                {user.firstName} {user.lastName}
              </a>
              {user.isMember ? null : (
                <div>
                  Ikke medlem
                </div>
              )}
              {!user.membershipType || !user.isMember ? null : (
                <div>
                  {user.membershipType}
                </div>
              )}
              {!user.memberid ? null : (
                <div>
                  Medlemsnummer: {user.memberid}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="login-form__button-container">
          <button
            onClick={onCancel}>
            Avbryt
          </button>
        </div>
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
