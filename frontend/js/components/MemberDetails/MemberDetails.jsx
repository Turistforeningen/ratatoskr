import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getTranslate } from 'react-localize-redux';

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

  componentWillReceiveProps(nextProps) {
    const { nextUser } = nextProps;
    const { user } = this.props;

    // Scroll to top if user data gets set
    if ((nextUser || {}).id !== (user || {}).id) {
      window.scrollTo(0, 0);
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
    const { user, isUpdating, translate } = this.props;

    if (!user || !user.id) {
      return null;
    }

    return (
      <div>
        <h1 className="heading">
          { translate('membership_details.title') }
          {isUpdating && (
            <small className="updating-status">
              { translate('membership_details.updating') }...
            </small>
          )}
        </h1>

        <UserCard user={user} />

        {!user.household.mainMember ? null : (
          <div>
            <h2 className="heading--sub">
              { translate('membership_details.main_member_title') }
            </h2>
            <UserCard
              user={user.household.mainMember}
              subUser={true} />
          </div>
        )}

        {!user.household.members || !user.household.members.length ? null : (
          <div>
            <h2 className="heading--sub">
              {user.household.isFamilyMember
                ? translate('membership_details.family_members_title')
                : translate('membership_details.household_members_title')
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
  translate: getTranslate(state.locale),
});


const connectedComponent = connect(
  mapStateToProps,
  {update},
  (stateProps, dispatchProps, ownProps) =>
    Object.assign({}, ownProps, stateProps, {actions: dispatchProps})
)(MemberDetails);

export default connectedComponent;
