import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { update } from '../../actions/user/data';
import { getTokens } from '../../selectors/user/tokens';
import { getIsPending as getIsUpdating } from '../../selectors/user/update';
import { getUser, getLastUpdated } from '../../selectors/user/data';

import UserCard from './UserCard.jsx';


class MemberDetails extends Component {
  updateIntervalHandler = null;

  componentWillMount() {
    this.updateIntervalHandler = setInterval(this.updateUserData, 60000);
    this.updateUserData(true);
  }

  componentWillUnount() {
    if (this.updateIntervalHandler) {
      clearInterval(this.updateIntervalHandler);
    }
  }

  @autobind
  updateUserData(force = false) {
    const {
      user,
      lastUpdated,
      isUpdating,
      actions,
      tokens,
    } = this.props;

    let shouldUpdate = force;
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
      actions.update(tokens);
    }
  }

  render() {
    const { user, isUpdating } = this.props;

    if (!user || !user.id) {
      return null;
    }

    return (
      <div>
        <h1 className="heading">
          Mitt medlemsskap
          {isUpdating && (
            <small>
              Oppdaterer
            </small>
          )}
        </h1>

        <a onClick={() => this.updateUserData(true)}>Oppdater</a>
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
  tokens: getTokens(state),
});


const connectedComponent = connect(
  mapStateToProps,
  {update},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(MemberDetails);

export default connectedComponent;
