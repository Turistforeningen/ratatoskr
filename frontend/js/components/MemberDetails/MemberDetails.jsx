import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { update } from '../../actions/user/data';
import {
  getUser,
  getLastUpdated,
  getIsUpdating,
} from '../../selectors/user/data';

import UserCard from './UserCard.jsx';


class MemberDetails extends Component {
  updateIntervalHandler = null;

  componentWillMount() {
    this.updateIntervalHandler = setInterval(this.updateUserData, 60000);
  }

  componentWillUnount() {
    if (this.updateIntervalHandler) {
      clearInterval(this.updateIntervalHandler);
    }
  }

  @autobind
  updateUserData() {
    const {
      user,
      lastUpdated,
      isUpdating,
      actions,
    } = this.props;

    let shouldUpdate = false;
    if (lastUpdated === null) {
      shouldUpdate = true;
    } else {
      const diff =
        (new Date().getTime() / 1000) - (lastUpdated.getTime() / 1000);
      if (diff > 3600) {
        shouldUpdate = true;
      }
    }

    if (user && user.id && shouldUpdate && !isUpdating) {
      actions.update();
    }
  }

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
  lastUpdated: getLastUpdated(state),
  isUpdating: getIsUpdating(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {update},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(MemberDetails);

export default connectedComponent;
