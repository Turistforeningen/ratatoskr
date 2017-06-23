import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { getUser } from '../../selectors/user/data';

import UserCard from './UserCard.jsx';


class MemberDetails extends Component {
  render() {
    const { user } = this.props;

    if (!user || !user.id) {
      return null;
    }

    return (
      <div>
        <h1 className="heading">Mitt medlemsskap</h1>
        <UserCard user={user} />

        {!user.household.mainMember ? null : (
          <div>
            <h2 className="heading--sub">Hovedmedlem</h2>
            <UserCard
              user={user.household.mainMember}
              subUser={true} />
          </div>
        )}

        {!user.household.members || !user.household.members.length ? null : (
          <div>
            <h2 className="heading--sub">
              {user.household.isFamilyMember ?
                'Familiemedlemmer' :
                'Hustandsmedlemmer'
              }
            </h2>
            {user.household.members.map((u) => (
              <UserCard
                key={u.id}
                user={u}
                subUser={true} />
            ))}
          </div>
        )}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: getUser(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(MemberDetails);

export default connectedComponent;
